import type { AnalysisReport } from '@/analysis';
import type { ConfidenceLevel, EvidenceLevel } from '@/types';
import { AppError } from '@/utils';

import {
  AI_EXPLANATION_SCHEMA_VERSION,
  type AIExplanation,
  type AIValidationIssue,
  type AIValidationResult,
} from './types';

const CONFIDENCE_LEVELS: readonly ConfidenceLevel[] = ['low', 'medium', 'high'];
const EVIDENCE_LEVELS: readonly EvidenceLevel[] = ['exploratory', 'emerging', 'supported'];
const RECOMMENDATION_CATEGORIES = ['hair', 'grooming', 'skincare', 'styling'] as const;
const RECOMMENDATION_EFFORT = ['low', 'medium', 'high'] as const;

interface ProhibitedPattern {
  readonly label: string;
  readonly pattern: RegExp;
}

/**
 * Defense-in-depth only. Structural validation and human review remain the
 * primary safeguards; a blocklist cannot prove that a statement is sound.
 */
const PROHIBITED_PATTERNS: readonly ProhibitedPattern[] = [
  { label: 'genetic inference', pattern: /\bgenetic|dna\b/i },
  { label: 'attractiveness judgment', pattern: /\battractive(ness)?\b|\bunattractive\b|\bugly\b/i },
  { label: 'medical diagnosis', pattern: /\bdiagnos(e|is|ed)\b|\bmedical condition\b|\bdisease\b/i },
  { label: 'identity recognition', pattern: /\bidentity\b|\bidentify you\b/i },
  { label: 'ethnicity or race inference', pattern: /\bethnic(ity)?\b|\brace\b/i },
  { label: 'age inference', pattern: /\byour age\b|\bhow old\b/i },
  { label: 'absolute claim', pattern: /\bguarantee(d)?\b|\b100%\b|\bperfect\b/i },
  { label: 'scoring language', pattern: /\bscore\b|\brating\b|\brank(ed|ing)?\b/i },
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function push(
  issues: AIValidationIssue[],
  code: AIValidationIssue['code'],
  path: string,
  message: string,
): void {
  issues.push({ code, path, message });
}

function checkText(
  value: unknown,
  path: string,
  issues: AIValidationIssue[],
  maximumLength: number,
): value is string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    push(issues, 'invalid_field', path, 'Expected a non-empty string.');
    return false;
  }

  if (value.length > maximumLength) {
    push(issues, 'invalid_field', path, `Text exceeds ${maximumLength} characters.`);
    return false;
  }

  for (const { label, pattern } of PROHIBITED_PATTERNS) {
    if (pattern.test(value)) {
      push(issues, 'prohibited_claim', path, `Contains prohibited ${label}.`);
    }
  }

  return true;
}

function checkMeasurementReferences(
  value: unknown,
  path: string,
  allowedIds: ReadonlySet<string>,
  issues: AIValidationIssue[],
): value is string[] {
  if (!isStringArray(value) || value.length === 0) {
    push(issues, 'missing_measurement_reference', path, 'At least one measurement ID is required.');
    return false;
  }

  for (const id of value) {
    if (!allowedIds.has(id)) {
      push(issues, 'unknown_measurement', `${path}.${id}`, 'Measurement ID is not in the report.');
    }
  }

  return true;
}

function checkEvidenceConfidence(
  evidenceLevel: unknown,
  confidence: unknown,
  path: string,
  issues: AIValidationIssue[],
): boolean {
  if (!EVIDENCE_LEVELS.includes(evidenceLevel as EvidenceLevel)) {
    push(issues, 'invalid_field', `${path}.evidenceLevel`, 'Unknown evidence level.');
    return false;
  }

  if (!CONFIDENCE_LEVELS.includes(confidence as ConfidenceLevel)) {
    push(issues, 'invalid_field', `${path}.confidence`, 'Unknown confidence level.');
    return false;
  }

  if (evidenceLevel === 'exploratory' && confidence === 'high') {
    push(
      issues,
      'confidence_evidence_mismatch',
      path,
      'Exploratory evidence cannot be presented with high confidence.',
    );
    return false;
  }

  return true;
}

export function validateAIExplanation(
  value: unknown,
  report: AnalysisReport,
): AIValidationResult {
  const issues: AIValidationIssue[] = [];

  if (!isRecord(value)) {
    return {
      valid: false,
      issues: [{ code: 'invalid_schema', path: '$', message: 'Expected a JSON object.' }],
    };
  }

  if (value.schemaVersion !== AI_EXPLANATION_SCHEMA_VERSION) {
    push(issues, 'invalid_schema', '$.schemaVersion', 'Unsupported explanation schema.');
  }

  checkText(value.summary, '$.summary', issues, 2_000);

  if (!isStringArray(value.limitations) || value.limitations.length === 0) {
    push(issues, 'missing_limitations', '$.limitations', 'At least one limitation is required.');
  } else {
    for (const [index, limitation] of value.limitations.entries()) {
      checkText(limitation, `$.limitations[${index}]`, issues, 500);
    }
  }

  const allowedIds = new Set(report.measurements.map((measurement) => measurement.definitionId));

  if (!Array.isArray(value.observations) || value.observations.length === 0) {
    push(issues, 'invalid_field', '$.observations', 'At least one observation is required.');
  } else {
    value.observations.forEach((observation, index) => {
      const path = `$.observations[${index}]`;
      if (!isRecord(observation)) {
        push(issues, 'invalid_schema', path, 'Expected an object.');
        return;
      }

      checkText(observation.id, `${path}.id`, issues, 100);
      checkText(observation.statement, `${path}.statement`, issues, 1_000);
      checkMeasurementReferences(observation.measurementIds, `${path}.measurementIds`, allowedIds, issues);
      checkEvidenceConfidence(observation.evidenceLevel, observation.confidence, path, issues);

      if (!isStringArray(observation.limitations) || observation.limitations.length === 0) {
        push(issues, 'missing_limitations', `${path}.limitations`, 'At least one limitation is required.');
      }
    });
  }

  if (!Array.isArray(value.recommendations)) {
    push(issues, 'invalid_field', '$.recommendations', 'Expected an array.');
  } else {
    value.recommendations.forEach((recommendation, index) => {
      const path = `$.recommendations[${index}]`;
      if (!isRecord(recommendation)) {
        push(issues, 'invalid_schema', path, 'Expected an object.');
        return;
      }

      checkText(recommendation.id, `${path}.id`, issues, 100);
      checkText(recommendation.action, `${path}.action`, issues, 500);
      checkText(recommendation.rationale, `${path}.rationale`, issues, 1_000);
      checkMeasurementReferences(recommendation.measurementIds, `${path}.measurementIds`, allowedIds, issues);

      if (
        typeof recommendation.category !== 'string' ||
        !(RECOMMENDATION_CATEGORIES as readonly string[]).includes(recommendation.category)
      ) {
        push(issues, 'invalid_field', `${path}.category`, 'Unknown recommendation category.');
      }
      if (
        typeof recommendation.effort !== 'string' ||
        !(RECOMMENDATION_EFFORT as readonly string[]).includes(recommendation.effort)
      ) {
        push(issues, 'invalid_field', `${path}.effort`, 'Unknown effort level.');
      }
      if (!EVIDENCE_LEVELS.includes(recommendation.evidenceLevel as EvidenceLevel)) {
        push(issues, 'invalid_field', `${path}.evidenceLevel`, 'Unknown evidence level.');
      }
    });
  }

  return { valid: issues.length === 0, issues };
}

export function parseAIExplanation(
  value: unknown,
  report: AnalysisReport,
): AIExplanation {
  const result = validateAIExplanation(value, report);
  if (!result.valid) {
    throw new AppError('ai', 'The AI explanation failed validation.', {
      context: { issueCodes: result.issues.map((issue) => issue.code) },
    });
  }
  return value as AIExplanation;
}
