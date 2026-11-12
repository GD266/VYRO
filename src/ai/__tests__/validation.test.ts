import { validateAIExplanation } from '@/ai';
import type { AnalysisReport } from '@/analysis';

const REPORT: AnalysisReport = {
  schemaVersion: '1.0',
  id: 'report-1',
  sessionId: 'session-1',
  createdAt: '2026-11-12T10:00:00.000Z',
  consentVersion: '2026-11-01',
  quality: {
    accepted: true,
    issues: [],
    missingAngles: [],
    samples: [],
  },
  measurements: [
    {
      definitionId: 'face-width-to-height-ratio',
      value: 0.87,
      unit: 'ratio',
      confidence: 'medium',
      sampleId: 'front-1',
      angle: 'front',
      computedAt: '2026-11-12T10:00:01.000Z',
    },
  ],
  observations: [],
  limitations: ['Exploratory only.'],
};

function explanation(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    schemaVersion: '1.0',
    summary: 'The report contains one geometric ratio.',
    observations: [
      {
        id: 'observation-1',
        measurementIds: ['face-width-to-height-ratio'],
        statement:
          'The face width-to-height ratio is reported as a geometric value.',
        confidence: 'medium',
        evidenceLevel: 'exploratory',
        limitations: ['Exploratory only.'],
      },
    ],
    recommendations: [],
    limitations: ['Exploratory only.'],
    ...overrides,
  };
}

describe('validateAIExplanation', () => {
  it('accepts a structurally valid, measurement-backed explanation', () => {
    const result = validateAIExplanation(explanation(), REPORT);

    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it('rejects an attractiveness claim', () => {
    const result = validateAIExplanation(
      explanation({ summary: 'This is an attractive face.' }),
      REPORT,
    );

    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toContain('prohibited_claim');
  });

  it('rejects a scoring claim', () => {
    const result = validateAIExplanation(
      explanation({ summary: 'Your score is 8 out of 10.' }),
      REPORT,
    );

    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toContain('prohibited_claim');
  });

  it('rejects an unknown measurement reference', () => {
    const result = validateAIExplanation(
      explanation({
        observations: [
          {
            id: 'observation-1',
            measurementIds: ['invented-measurement'],
            statement: 'A statement that cites a measurement that does not exist.',
            confidence: 'medium',
            evidenceLevel: 'exploratory',
            limitations: ['Exploratory only.'],
          },
        ],
      }),
      REPORT,
    );

    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toContain(
      'unknown_measurement',
    );
  });

  it('rejects high confidence attached to exploratory evidence', () => {
    const result = validateAIExplanation(
      explanation({
        observations: [
          {
            id: 'observation-1',
            measurementIds: ['face-width-to-height-ratio'],
            statement: 'The ratio is reported as a geometric value.',
            confidence: 'high',
            evidenceLevel: 'exploratory',
            limitations: ['Exploratory only.'],
          },
        ],
      }),
      REPORT,
    );

    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toContain(
      'confidence_evidence_mismatch',
    );
  });

  it('requires limitations at the top level', () => {
    const result = validateAIExplanation(explanation({ limitations: [] }), REPORT);

    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toContain(
      'missing_limitations',
    );
  });

  it('rejects a non-object response', () => {
    const result = validateAIExplanation('not json', REPORT);

    expect(result.valid).toBe(false);
    expect(result.issues[0]?.code).toBe('invalid_schema');
  });
});
