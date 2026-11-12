import type { AnalysisReport } from '@/analysis';
import type { ConfidenceLevel, EvidenceLevel } from '@/types';

export const AI_EXPLANATION_SCHEMA_VERSION = '1.0' as const;

export type AIRecommendationCategory = 'hair' | 'grooming' | 'skincare' | 'styling';

export type AIRecommendationEffort = 'low' | 'medium' | 'high';

export interface AIExplanationObservation {
  readonly id: string;
  readonly measurementIds: readonly string[];
  readonly statement: string;
  readonly confidence: ConfidenceLevel;
  readonly evidenceLevel: EvidenceLevel;
  readonly limitations: readonly string[];
}

export interface AIRecommendation {
  readonly id: string;
  readonly category: AIRecommendationCategory;
  readonly action: string;
  readonly rationale: string;
  readonly measurementIds: readonly string[];
  readonly effort: AIRecommendationEffort;
  readonly evidenceLevel: EvidenceLevel;
}

export interface AIExplanation {
  readonly schemaVersion: typeof AI_EXPLANATION_SCHEMA_VERSION;
  readonly summary: string;
  readonly observations: readonly AIExplanationObservation[];
  readonly recommendations: readonly AIRecommendation[];
  readonly limitations: readonly string[];
}

export interface AIExplanationRequest {
  readonly report: AnalysisReport;
}

/**
 * Provider-independent AI boundary. The app never holds provider credentials;
 * implementations call a backend proxy that owns them.
 */
export interface AIProvider {
  readonly id: string;
  readonly model: string;
  explain(request: AIExplanationRequest): Promise<AIExplanation>;
}

export type AIValidationIssueCode =
  | 'invalid_schema'
  | 'invalid_field'
  | 'empty_response'
  | 'missing_measurement_reference'
  | 'unknown_measurement'
  | 'prohibited_claim'
  | 'confidence_evidence_mismatch'
  | 'missing_limitations';

export interface AIValidationIssue {
  readonly code: AIValidationIssueCode;
  readonly path: string;
  readonly message: string;
}

export interface AIValidationResult {
  readonly valid: boolean;
  readonly issues: readonly AIValidationIssue[];
}
