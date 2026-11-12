import { useWindowDimensions } from 'react-native';

import { layout } from '@/theme';

export interface ResponsiveLayout {
  readonly width: number;
  readonly height: number;
  readonly isCompact: boolean;
  readonly isTablet: boolean;
  readonly contentWidth: number;
}

export function useResponsiveLayout(): ResponsiveLayout {
  const { width, height } = useWindowDimensions();

  return {
    width,
    height,
    isCompact: width < layout.compactWidth,
    isTablet: width >= layout.tabletWidth,
    contentWidth: Math.min(width, layout.maxContentWidth),
  };
}
