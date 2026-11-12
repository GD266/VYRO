export const spacing = {
  none: 0,
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
  '7xl': 80,
  '8xl': 96,
} as const;

export const radii = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  '2xl': 24,
  pill: 999,
} as const;

export const layout = {
  screenPadding: 20,
  maxContentWidth: 560,
  tabBarHeight: 64,
  headerHeight: 56,
  minTouchTarget: 44,
  compactWidth: 360,
  tabletWidth: 600,
} as const;

export type SpacingName = keyof typeof spacing;
