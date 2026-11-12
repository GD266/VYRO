import { CAPTURE_ANGLES } from '@/types';
import type { CaptureAngle } from '@/types';

import type {
  CaptureSession,
  CaptureSample,
  QualityAssessment,
  QualityGateConfig,
  QualityIssue,
  QualityMetrics,
  SampleQualityAssessment,
  SessionQualityAssessment,
} from './types';

/**
 * Conservative defaults. These are engineering thresholds for image quality,
 * not claims about facial appearance. They must be calibrated against a
 * device matrix before being treated as validated.
 */
export const DEFAULT_QUALITY_GATE: QualityGateConfig = {
  minBrightness: 0.25,
  maxBrightness: 0.9,
  maxBlur: 0.35,
  minFaceCoverage: 0.15,
  maxFaceCoverage: 0.8,
  maxFaceCenterOffset: 0.25,
  maxPoseDeviationDegrees: 12,
  maxOcclusion: 0.15,
  minDetectionConfidence: 0.7,
  minLandmarkCount: 468,
};

function issue(code: QualityIssue['code'], message: string): QualityIssue {
  return { code, severity: 'blocking', message };
}

export function assessSampleQuality(
  metrics: QualityMetrics,
  config: QualityGateConfig = DEFAULT_QUALITY_GATE,
): QualityAssessment {
  const issues: QualityIssue[] = [];

  if (metrics.brightness < config.minBrightness) {
    issues.push(issue('too_dark', 'The image is too dark. Move toward softer, even light.'));
  }
  if (metrics.brightness > config.maxBrightness) {
    issues.push(issue('too_bright', 'The image is overexposed. Reduce direct light on your face.'));
  }
  if (metrics.blur > config.maxBlur) {
    issues.push(issue('blurry', 'The image is blurry. Hold the phone steady and try again.'));
  }
  if (metrics.faceCoverage < config.minFaceCoverage) {
    issues.push(issue('face_too_small', 'Move closer so your face fills more of the frame.'));
  }
  if (metrics.faceCoverage > config.maxFaceCoverage) {
    issues.push(issue('face_too_large', 'Move back so your full face is inside the frame.'));
  }
  if (metrics.faceCenterOffset > config.maxFaceCenterOffset) {
    issues.push(issue('face_not_centered', 'Center your face inside the guide.'));
  }
  if (metrics.poseDeviationDegrees > config.maxPoseDeviationDegrees) {
    issues.push(issue('pose_out_of_range', 'Keep your head within the requested angle.'));
  }
  if (metrics.occlusion > config.maxOcclusion) {
    issues.push(issue('occluded', 'Part of your face is obscured. Remove hair or accessories.'));
  }
  if (metrics.detectionConfidence < config.minDetectionConfidence) {
    issues.push(issue('low_detection_confidence', 'A reliable face could not be detected. Try again.'));
  }
  if (metrics.landmarkCount < config.minLandmarkCount) {
    issues.push(issue('insufficient_landmarks', 'Not enough facial landmarks were detected.'));
  }

  return {
    accepted: issues.length === 0,
    issues,
    metrics,
  };
}

function missingMetricsAssessment(sample: CaptureSample): SampleQualityAssessment {
  const metrics: QualityMetrics = {
    brightness: 0,
    blur: 1,
    faceCoverage: 0,
    faceCenterOffset: 1,
    poseDeviationDegrees: 180,
    occlusion: 1,
    detectionConfidence: 0,
    landmarkCount: 0,
  };

  return {
    sampleId: sample.id,
    angle: sample.angle,
    assessment: {
      accepted: false,
      issues: [issue('metrics_unavailable', 'Quality could not be measured for this angle.')],
      metrics,
    },
  };
}

/**
 * Evaluates every sample in a session and enforces coverage of all three
 * angles. A session is accepted only when every sample passes and no angle
 * is missing.
 */
export function assessCaptureSession(
  session: Pick<CaptureSession, 'samples'>,
  metricsBySampleId: Readonly<Record<string, QualityMetrics>>,
  config: QualityGateConfig = DEFAULT_QUALITY_GATE,
): SessionQualityAssessment {
  const sampleAssessments = session.samples.map((sample) => {
    const metrics = metricsBySampleId[sample.id];
    return metrics === undefined
      ? missingMetricsAssessment(sample)
      : {
          sampleId: sample.id,
          angle: sample.angle,
          assessment: assessSampleQuality(metrics, config),
        };
  });

  const presentAngles = new Set<CaptureAngle>(session.samples.map((sample) => sample.angle));
  const missingAngles = CAPTURE_ANGLES.filter((angle) => !presentAngles.has(angle));
  const issues = sampleAssessments.flatMap((sample) => sample.assessment.issues);

  return {
    accepted:
      missingAngles.length === 0 &&
      sampleAssessments.length > 0 &&
      sampleAssessments.every((sample) => sample.assessment.accepted),
    samples: sampleAssessments,
    missingAngles,
    issues,
  };
}
