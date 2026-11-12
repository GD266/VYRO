import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { theme } from '@/theme';
import { colors } from '@/theme/colors';

export type CardTone = 'default' | 'elevated' | 'muted';

export interface CardProps {
  readonly children: ReactNode;
  readonly onPress?: () => void;
  readonly tone?: CardTone;
  readonly padded?: boolean;
  readonly accessibilityLabel?: string;
  readonly accessibilityHint?: string;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

const TONE_STYLES: Record<CardTone, ViewStyle> = {
  default: {
    backgroundColor: colors.surface,
    borderColor: colors.borderSubtle,
  },
  elevated: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
  },
  muted: {
    backgroundColor: colors.backgroundElevated,
    borderColor: colors.borderSubtle,
  },
};

export function Card({
  children,
  onPress,
  tone = 'default',
  padded = true,
  accessibilityLabel,
  accessibilityHint,
  style,
  testID,
}: CardProps) {
  const contentStyle = [
    styles.base,
    TONE_STYLES[tone],
    padded && styles.padded,
    style,
  ];

  if (onPress === undefined) {
    return (
      <View style={contentStyle} testID={testID}>
        {children}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        contentStyle,
        pressed && styles.pressed,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  padded: {
    padding: theme.spacing.xl,
  },
  pressed: {
    backgroundColor: colors.surfacePressed,
  },
});
