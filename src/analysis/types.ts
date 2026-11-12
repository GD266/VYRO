import type {
  CaptureAngle,
  ConfidenceLevel,
  EvidenceLevel,
  ISO8601,
  MeasurementUnit,
} from '@/types';
import type { SessionQualityAssessment } from '@/vision';

/**
 * The analysis boundary deliberately separates four kinds of data:
 *
 * 1. Capture data (`CaptureSession` in src/vision) — images and angle metadata.
 * 2. Landmarks (`FaceLandmarkSet` in src/vision) — model output, not meaning.
 * 3. Measurements (`MeasurementResult`) — arithmetic over landmarks.
 * 4. Observations and explanations (`Observation`, AI explanation) — interpretation.
 *
 * An observation must never be produced without traceable measurements, and an
 * AI explanation must never be treated as a measurement.
 */

export interface ReferenceRange {
  readonly minimum: number;
  readonly maximum: number;
  readonly source: string;
  readonly population?: string;
}

export interface MeasurementDefinition {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly unit: MeasurementUnit;
  readonly evidenceLevel: EvidenceLevel;
  readonly status: 'candidate' | 'validated';
  /**
   * Semantic landmark names, not provider-specific indices. The vision layer
   * maps a concrete model's landmarks to these names.
   */
  readonly requiredLandmarks: readonly string[];
  /** Null until a defensible, population-appropriate reference exists. */
  readonly referenceRange: ReferenceRange | null;
  readonly limitations: readonly string[];
}

export interface MeasurementResult {
  readonly definitionId: string;
  readonly value: number;
  readonly unit: MeasurementUnit;
  readonly confidence: ConfidenceLevel;
  readonly sampleId: string;
  readonly angle: CaptureAngle;
  readonly computedAt: ISO8601;
}

export interface Observation {
  readonly id: string;
  readonly measurementIds: readonly string[];
  readonly statement: string;
  readonly evidenceLevel: EvidenceLevel;
  readonly confidence: ConfidenceLevel;
  readonly limitations: readonly string[];
}

export interface AnalysisReport {
  readonly schemaVersion: '1.0';
  readonly id: string;
  readonly sessionId: string;
  readonly createdAt: ISO8601;
  readonly consentVersion: string;
  readonly quality: SessionQualityAssessment;
  readonly measurements: readonly MeasurementResult[];
  readonly observations: readonly Observation[];
  readonly limitations: readonly string[];
}

export interface AnalysisPipeline {
  readonly id: string;
  analyze(input: {
    readonly sessionId: string;
    readonly consentVersion: string;
  }): Promise<AnalysisReport>;
}

export class AnalysisNotAvailableError extends Error {
  constructor() {
    super('The facial analysis pipeline is not implemented in this build.');
    this.name = 'AnalysisNotAvailableError';
  }
}
