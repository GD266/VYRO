import type { CaptureAngle } from '@/types';
import { assessCaptureSession, assessSampleQuality, DEFAULT_QUALITY_GATE } from '@/vision';
import type { CaptureSample, QualityMetrics } from '@/vision';

const GOOD_METRICS: QualityMetrics = {
  brightness: 0.5,
  blur: 0.08,
  faceCoverage: 0.4,
  faceCenterOffset: 0.04,
  poseDeviationDegrees: 3,
  occlusion: 0.02,
  detectionConfidence: 0.96,
  landmarkCount: 478,
};

function sample(id: string, angle: CaptureAngle): CaptureSample {
  return {
    id,
    angle,
    frame: {
      capturedAt: '2026-11-12T10:00:00.000Z',
      height: 1920,
      rotationDegrees: 0,
      uri: `file:///tmp/${id}.jpg`,
      width: 1440,
    },
  };
}

describe('assessSampleQuality', () => {
  it('accepts a frame that satisfies every threshold', () => {
    const assessment = assessSampleQuality(GOOD_METRICS);

    expect(assessment.accepted).toBe(true);
    expect(assessment.issues).toHaveLength(0);
  });

  it('rejects a dark frame with a blocking issue', () => {
    const assessment = assessSampleQuality({
      ...GOOD_METRICS,
      brightness: DEFAULT_QUALITY_GATE.minBrightness - 0.05,
    });

    expect(assessment.accepted).toBe(false);
    expect(assessment.issues.map((issue) => issue.code)).toContain('too_dark');
    expect(assessment.issues.every((issue) => issue.severity === 'blocking')).toBe(true);
  });

  it('rejects a blurred frame', () => {
    const assessment = assessSampleQuality({
      ...GOOD_METRICS,
      blur: DEFAULT_QUALITY_GATE.maxBlur + 0.1,
    });

    expect(assessment.accepted).toBe(false);
    expect(assessment.issues.map((issue) => issue.code)).toContain('blurry');
  });

  it('rejects a frame with too few landmarks', () => {
    const assessment = assessSampleQuality({
      ...GOOD_METRICS,
      landmarkCount: 120,
    });

    expect(assessment.accepted).toBe(false);
    expect(assessment.issues.map((issue) => issue.code)).toContain(
      'insufficient_landmarks',
    );
  });
});

describe('assessCaptureSession', () => {
  const samples = [
    sample('front-1', 'front'),
    sample('left-1', 'left-profile'),
    sample('right-1', 'right-profile'),
  ];

  const metricsBySampleId = {
    'front-1': GOOD_METRICS,
    'left-1': GOOD_METRICS,
    'right-1': GOOD_METRICS,
  };

  it('accepts a complete session when every sample passes', () => {
    const assessment = assessCaptureSession({ samples }, metricsBySampleId);

    expect(assessment.accepted).toBe(true);
    expect(assessment.missingAngles).toHaveLength(0);
    expect(assessment.issues).toHaveLength(0);
  });

  it('rejects a session with a missing angle', () => {
    const assessment = assessCaptureSession(
      { samples: samples.slice(0, 2) },
      metricsBySampleId,
    );

    expect(assessment.accepted).toBe(false);
    expect(assessment.missingAngles).toEqual(['right-profile']);
  });

  it('rejects a session when one sample fails quality', () => {
    const assessment = assessCaptureSession(
      { samples },
      {
        ...metricsBySampleId,
        'left-1': { ...GOOD_METRICS, occlusion: 0.9 },
      },
    );

    expect(assessment.accepted).toBe(false);
    expect(assessment.samples[1]?.assessment.accepted).toBe(false);
  });

  it('fails closed when metrics are unavailable', () => {
    const assessment = assessCaptureSession({ samples }, {});

    expect(assessment.accepted).toBe(false);
    expect(
      assessment.issues.every((issue) => issue.code === 'metrics_unavailable'),
    ).toBe(true);
  });
});
