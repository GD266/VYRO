export type AppEnvironment = 'development' | 'preview' | 'production';

export const CAPTURE_ANGLES = ['front', 'left-profile', 'right-profile'] as const;

export type CaptureAngle = (typeof CAPTURE_ANGLES)[number];

export type ConfidenceLevel = 'low' | 'medium' | 'high';

/**
 * How much validated evidence exists for a measurement or observation.
 * `exploratory` is the only level permitted in the current build.
 */
export type EvidenceLevel = 'exploratory' | 'emerging' | 'supported';

export type MeasurementUnit = 'ratio' | 'degrees' | 'normalized';

export type ISO8601 = string;
