export const ROUTES = {
  home: '/home',
  scan: '/scan',
  insights: '/insights',
  profile: '/profile',
  welcome: '/welcome',
  consent: '/consent',
  scanPreparation: '/scan/preparation',
  scanCapture: '/scan/capture',
  analysis: '/analysis',
  recommendations: '/recommendations',
  progress: '/progress',
  privacy: '/privacy',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
