import type { ViewStyle } from 'react-native';

import { colors, gradients } from './colors';
import { layout, radii, spacing } from './spacing';
import {
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  textVariants,
} from './typography';

export const shadows = {
  card: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.24,
    shadowRadius: 24,
    elevation: 6,
  },
  floating: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 20,
    elevation: 10,
  },
} satisfies Record<string, ViewStyle>;

export const theme = {
  colors,
  gradients,
  spacing,
  radii,
  layout,
  shadows,
  typography: {
    fontFamily,
    fontSize,
    fontWeight,
    letterSpacing,
    lineHeight,
    variants: textVariants,
  },
} as const;

export { colors, gradients } from './colors';
export { layout, radii, spacing } from './spacing';

export type AppTheme = typeof theme;
export type { TextVariant } from './typography';
