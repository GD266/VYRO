import { getMeasurementDefinition } from '@/analysis';
import type { AnalysisReport } from '@/analysis';
import { AppError } from '@/utils';

export interface ExplanationPrompt {
  readonly system: string;
  readonly user: string;
}

const SYSTEM_PROMPT = `You are an explanation layer for VYRO, a facial measurement research tool.

You receive only derived measurements and quality metadata. You never receive
images, names, contact details, account identifiers, or raw facial landmarks.

Rules:
1. Explain what the measurements are. Do not claim to know what they mean about
   a person's identity, health, genetics, ethnicity, age, or attractiveness.
2. Do not diagnose, treat, or imply a medical condition.
3. Do not score, rank, rate, or compare the person to an "ideal" face.
4. Cite at least one measurement ID for every observation and recommendation.
5. Use only measurement IDs present in the input. Never invent a measurement.
6. Mark exploratory evidence as exploratory. Do not attach high confidence to
   exploratory evidence.
7. Recommendations must be low-risk, cosmetic or grooming-related, and clearly
   optional. Do not recommend medical, surgical, or invasive procedures. Return
   an empty recommendations array when no recommendation is justified.
8. State limitations. If the data is insufficient, say so instead of guessing.
9. Return JSON only. Do not wrap it in Markdown fences or add commentary.

Return this shape:
{
  "schemaVersion": "1.0",
  "summary": "string",
  "observations": [
    {
      "id": "string",
      "measurementIds": ["string"],
      "statement": "string",
      "confidence": "low | medium | high",
      "evidenceLevel": "exploratory | emerging | supported",
      "limitations": ["string"]
    }
  ],
  "recommendations": [
    {
      "id": "string",
      "category": "hair | grooming | skincare | styling",
      "action": "string",
      "rationale": "string",
      "measurementIds": ["string"],
      "effort": "low | medium | high",
      "evidenceLevel": "exploratory | emerging | supported"
    }
  ],
  "limitations": ["string"]
}`;

export function buildExplanationPrompt(report: AnalysisReport): ExplanationPrompt {
  if (!report.quality.accepted) {
    throw new AppError(
      'validation',
      'An explanation cannot be requested for a scan that failed the quality gate.',
    );
  }

  if (report.measurements.length === 0) {
    throw new AppError(
      'validation',
      'An explanation cannot be requested without measurements.',
    );
  }

  const measurements = report.measurements.map((measurement) => {
    const definition = getMeasurementDefinition(measurement.definitionId);
    return {
      id: measurement.definitionId,
      label: definition?.label ?? measurement.definitionId,
      value: measurement.value,
      unit: measurement.unit,
      evidenceLevel: definition?.evidenceLevel ?? 'exploratory',
      limitations: definition?.limitations ?? [],
    };
  });

  const user = JSON.stringify(
    {
      task: 'Explain these measurements without making claims beyond the data.',
      measurements,
      quality: {
        accepted: report.quality.accepted,
        missingAngles: report.quality.missingAngles,
        issueCodes: report.quality.issues.map((issue) => issue.code),
      },
      reportLimitations: report.limitations,
    },
    null,
    2,
  );

  return { system: SYSTEM_PROMPT, user };
}
