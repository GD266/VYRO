import type { CaptureAngle, ConfidenceLevel, ISO8601 } from '@/types';

/** A point in normalized image coordinates. Origin is the top-left corner. */
export interface NormalizedPoint {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface BoundingBox {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface HeadPose {
  readonly pitchDegrees: number;
  readonly yawDegrees: number;
  readonly rollDegrees: number;
}

export interface ImageFrame {
  readonly uri: string;
  readonly width: number;
  readonly height: number;
  readonly rotationDegrees: 0 | 90 | 180 | 270;
  readonly capturedAt: ISO8601;
}

export interface CaptureSample {
  readonly id: string;
  readonly angle: CaptureAngle;
  readonly frame: ImageFrame;
}

/**
 * Raw capture metadata only. A session never contains permanent storage
 * decisions; retention is handled by the capture feature.
 */
export interface CaptureSession {
  readonly id: string;
  readonly createdAt: ISO8601;
  readonly consentVersion: string;
  readonly samples: readonly CaptureSample[];
}

export interface Landmark {
  readonly index: number;
  readonly point: NormalizedPoint;
  readonly visibility?: number;
}

export interface FaceLandmarkSet {
  readonly model: string;
  readonly modelVersion?: string;
  readonly landmarks: readonly Landmark[];
}

export interface FaceDetectionResult {
  readonly landmarks: FaceLandmarkSet;
  readonly boundingBox: BoundingBox;
  readonly pose: HeadPose;
  readonly detectionConfidence: number;
}

/**
 * The boundary between a native/on-device landmark engine and the analysis
 * layer. Implementations may wrap MediaPipe Face Landmarker, but the analysis
 * layer must not depend on that choice.
 */
export interface LandmarkDetector {
  readonly id: string;
  readonly model: string;
  detect(frame: ImageFrame): Promise<FaceDetectionResult>;
}

/**
 * Image-quality signals used by the quality gate. All values are normalized
 * to 0..1 except angles and counts. `blur` and `occlusion` increase with
 * degradation; `brightness`, `faceCoverage`, and `detectionConfidence`
 * increase with quality.
 */
export interface QualityMetrics {
  readonly brightness: number;
  readonly blur: number;
  readonly faceCoverage: number;
  readonly faceCenterOffset: number;
  readonly poseDeviationDegrees: number;
  readonly occlusion: number;
  readonly detectionConfidence: number;
  readonly landmarkCount: number;
}

export type QualityIssueCode =
  | 'too_dark'
  | 'too_bright'
  | 'blurry'
  | 'face_too_small'
  | 'face_too_large'
  | 'face_not_centered'
  | 'pose_out_of_range'
  | 'occluded'
  | 'low_detection_confidence'
  | 'insufficient_landmarks'
  | 'metrics_unavailable';

export interface QualityIssue {
  readonly code: QualityIssueCode;
  readonly severity: 'blocking' | 'warning';
  readonly message: string;
}

export interface QualityAssessment {
  readonly accepted: boolean;
  readonly issues: readonly QualityIssue[];
  readonly metrics: QualityMetrics;
}

export interface SampleQualityAssessment {
  readonly sampleId: string;
  readonly angle: CaptureAngle;
  readonly assessment: QualityAssessment;
}

export interface SessionQualityAssessment {
  readonly accepted: boolean;
  readonly samples: readonly SampleQualityAssessment[];
  readonly missingAngles: readonly CaptureAngle[];
  readonly issues: readonly QualityIssue[];
}

export interface QualityGateConfig {
  readonly minBrightness: number;
  readonly maxBrightness: number;
  readonly maxBlur: number;
  readonly minFaceCoverage: number;
  readonly maxFaceCoverage: number;
  readonly maxFaceCenterOffset: number;
  readonly maxPoseDeviationDegrees: number;
  readonly maxOcclusion: number;
  readonly minDetectionConfidence: number;
  readonly minLandmarkCount: number;
}

/** Confidence attached to a derived measurement, not to a person. */
export type MeasurementConfidence = ConfidenceLevel;
