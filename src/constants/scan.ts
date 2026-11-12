import type { CaptureAngle } from '@/types';

export interface ScanAngleDefinition {
  readonly id: CaptureAngle;
  readonly label: string;
  readonly shortLabel: string;
  readonly instruction: string;
}

export const SCAN_ANGLES: readonly ScanAngleDefinition[] = [
  {
    id: 'front',
    label: 'Front view',
    shortLabel: 'Front',
    instruction: 'Look straight ahead with your face relaxed and your eyes open.',
  },
  {
    id: 'left-profile',
    label: 'Left profile',
    shortLabel: 'Left',
    instruction: 'Turn your head to show your left profile, keeping your gaze level.',
  },
  {
    id: 'right-profile',
    label: 'Right profile',
    shortLabel: 'Right',
    instruction: 'Turn your head to show your right profile, keeping your gaze level.',
  },
];

export interface PreparationItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export const PREPARATION_ITEMS: readonly PreparationItem[] = [
  {
    id: 'lighting',
    title: 'Even, soft lighting',
    description: 'Face a window or a diffuse light source. Avoid harsh shadows and backlighting.',
  },
  {
    id: 'expression',
    title: 'Neutral expression',
    description: 'Relax your face, keep your eyes open, and avoid smiling during capture.',
  },
  {
    id: 'hair',
    title: 'Hair away from the face',
    description: 'Pull hair back so the forehead, ears, and jawline remain visible.',
  },
  {
    id: 'accessories',
    title: 'Remove glasses and hats',
    description: 'Remove eyewear, hats, and anything that obscures facial landmarks.',
  },
  {
    id: 'steady',
    title: 'Hold the phone steady',
    description: 'Use a stable position at eye level. Keep your head still between angles.',
  },
];
