export const APP = {
  name: 'VYRO',
  tagline: 'Facial intelligence, grounded.',
  version: '0.1.0',
  researchPreview: true,
  minimumAge: 18,
  consentVersion: '2026-11-01',
} as const;

export const STORAGE_KEYS = {
  preferences: 'vyro.preferences.v1',
} as const;

export const RESEARCH_DISCLAIMER =
  'VYRO is a research preview. Facial analysis is not available in this build, and no scores or conclusions are generated.';
