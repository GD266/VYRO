import type { MeasurementDefinition } from './types';

const UNVALIDATED_REFERENCE_LIMITATION =
  'No validated, population-appropriate reference range has been established for VYRO.';

/**
 * A catalog of candidate measurements. Every entry is explicitly exploratory:
 * the arithmetic is defined, but the meaning and reference values are not yet
 * validated. Nothing in this catalog is used to score a person.
 */
export const MEASUREMENT_CATALOG: readonly MeasurementDefinition[] = [
  {
    id: 'interocular-distance-ratio',
    label: 'Interocular distance ratio',
    description: 'Distance between eye centers divided by face width.',
    unit: 'ratio',
    evidenceLevel: 'exploratory',
    status: 'candidate',
    requiredLandmarks: [
      'left-eye-center',
      'right-eye-center',
      'face-left',
      'face-right',
    ],
    referenceRange: null,
    limitations: [
      UNVALIDATED_REFERENCE_LIMITATION,
      'Landmark placement and head pose affect the result.',
    ],
  },
  {
    id: 'intercanthal-distance-ratio',
    label: 'Intercanthal distance ratio',
    description: 'Distance between the inner eye corners divided by face width.',
    unit: 'ratio',
    evidenceLevel: 'exploratory',
    status: 'candidate',
    requiredLandmarks: [
      'left-eye-inner',
      'right-eye-inner',
      'face-left',
      'face-right',
    ],
    referenceRange: null,
    limitations: [
      UNVALIDATED_REFERENCE_LIMITATION,
      'Inner-corner landmarks are sensitive to eye shape and detection error.',
    ],
  },
  {
    id: 'face-width-to-height-ratio',
    label: 'Face width-to-height ratio',
    description: 'Bizygomatic width divided by facial height in the frontal view.',
    unit: 'ratio',
    evidenceLevel: 'exploratory',
    status: 'candidate',
    requiredLandmarks: ['face-left', 'face-right', 'forehead-top', 'chin-bottom'],
    referenceRange: null,
    limitations: [
      UNVALIDATED_REFERENCE_LIMITATION,
      'Perspective and camera distance change apparent proportions.',
    ],
  },
  {
    id: 'jaw-width-ratio',
    label: 'Jaw width ratio',
    description: 'Jaw width divided by face width.',
    unit: 'ratio',
    evidenceLevel: 'exploratory',
    status: 'candidate',
    requiredLandmarks: ['jaw-left', 'jaw-right', 'face-left', 'face-right'],
    referenceRange: null,
    limitations: [
      UNVALIDATED_REFERENCE_LIMITATION,
      'Jaw landmarks are often partially obscured by hair or shadow.',
    ],
  },
  {
    id: 'mouth-width-ratio',
    label: 'Mouth width ratio',
    description: 'Mouth corner distance divided by face width.',
    unit: 'ratio',
    evidenceLevel: 'exploratory',
    status: 'candidate',
    requiredLandmarks: ['mouth-left', 'mouth-right', 'face-left', 'face-right'],
    referenceRange: null,
    limitations: [
      UNVALIDATED_REFERENCE_LIMITATION,
      'Expression and lip posture change the measurement.',
    ],
  },
  {
    id: 'nasal-width-ratio',
    label: 'Nasal width ratio',
    description: 'Nose width divided by face width.',
    unit: 'ratio',
    evidenceLevel: 'exploratory',
    status: 'candidate',
    requiredLandmarks: ['nose-left', 'nose-right', 'face-left', 'face-right'],
    referenceRange: null,
    limitations: [
      UNVALIDATED_REFERENCE_LIMITATION,
      'Lighting and pose can move apparent nostril boundaries.',
    ],
  },
  {
    id: 'eye-aspect-ratio',
    label: 'Eye aspect ratio',
    description: 'Eye opening height divided by eye width.',
    unit: 'ratio',
    evidenceLevel: 'exploratory',
    status: 'candidate',
    requiredLandmarks: ['left-eye-upper', 'left-eye-lower', 'left-eye-outer', 'left-eye-inner'],
    referenceRange: null,
    limitations: [
      UNVALIDATED_REFERENCE_LIMITATION,
      'Blinking and gaze direction strongly affect this ratio.',
    ],
  },
  {
    id: 'midface-height-ratio',
    label: 'Midface height ratio',
    description: 'Distance from eye line to mouth line divided by facial height.',
    unit: 'ratio',
    evidenceLevel: 'exploratory',
    status: 'candidate',
    requiredLandmarks: ['eye-line-center', 'mouth-line-center', 'forehead-top', 'chin-bottom'],
    referenceRange: null,
    limitations: [
      UNVALIDATED_REFERENCE_LIMITATION,
      'Reference points must be defined consistently across poses.',
    ],
  },
  {
    id: 'symmetry-deviation-index',
    label: 'Symmetry deviation index',
    description: 'Mean geometric deviation of paired landmarks from the facial midline.',
    unit: 'normalized',
    evidenceLevel: 'exploratory',
    status: 'candidate',
    requiredLandmarks: ['facial-midline', 'paired-landmarks'],
    referenceRange: null,
    limitations: [
      UNVALIDATED_REFERENCE_LIMITATION,
      'Deviation is not a judgment of appearance, health, or attractiveness.',
      'Head pose and lens distortion can create apparent asymmetry.',
    ],
  },
];

export function getMeasurementDefinition(id: string): MeasurementDefinition | undefined {
  return MEASUREMENT_CATALOG.find((definition) => definition.id === id);
}
