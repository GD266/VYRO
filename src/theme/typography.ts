import { Platform, type TextStyle } from 'react-native';

export const fontFamily =
  Platform.select({
    ios: 'System',
    android: 'sans-serif',
    default: 'System',
  }) ?? 'System';

export const fontWeight = {
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
} as const;

export const fontSize = {
  xs: 11,
  sm: 12,
  md: 14,
  base: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 38,
  '5xl': 46,
} as const;

export const lineHeight = {
  xs: 16,
  sm: 18,
  md: 20,
  base: 23,
  lg: 24,
  xl: 28,
  '2xl': 32,
  '3xl': 38,
  '4xl': 44,
  '5xl': 52,
} as const;

export const letterSpacing = {
  tighter: -1.2,
  tight: -0.6,
  normal: 0,
  wide: 0.4,
  wider: 1.2,
  widest: 2.2,
} as const;

export const textVariants = {
  display: {
    fontSize: fontSize['5xl'],
    lineHeight: lineHeight['5xl'],
    fontWeight: fontWeight.light,
    letterSpacing: letterSpacing.tighter,
  },
  hero: {
    fontSize: fontSize['4xl'],
    lineHeight: lineHeight['4xl'],
    fontWeight: fontWeight.light,
    letterSpacing: letterSpacing.tight,
  },
  title: {
    fontSize: fontSize['3xl'],
    lineHeight: lineHeight['3xl'],
    fontWeight: fontWeight.regular,
    letterSpacing: letterSpacing.tight,
  },
  heading: {
    fontSize: fontSize['2xl'],
    lineHeight: lineHeight['2xl'],
    fontWeight: fontWeight.medium,
    letterSpacing: -0.3,
  },
  subheading: {
    fontSize: fontSize.lg,
    lineHeight: lineHeight.lg,
    fontWeight: fontWeight.medium,
    letterSpacing: -0.1,
  },
  body: {
    fontSize: fontSize.base,
    lineHeight: lineHeight.base,
    fontWeight: fontWeight.regular,
  },
  bodySmall: {
    fontSize: fontSize.md,
    lineHeight: lineHeight.md + 1,
    fontWeight: fontWeight.regular,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.wide,
  },
  caption: {
    fontSize: fontSize.sm,
    lineHeight: lineHeight.sm,
    fontWeight: fontWeight.regular,
    letterSpacing: 0.2,
  },
  overline: {
    fontSize: fontSize.xs,
    lineHeight: lineHeight.xs,
    fontWeight: fontWeight.medium,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase',
  },
} satisfies Record<string, TextStyle>;

export type TextVariant = keyof typeof textVariants;
