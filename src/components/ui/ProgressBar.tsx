import { StyleSheet, View } from 'react-native';

import { theme } from '@/theme';
import { colors } from '@/theme/colors';

import { Text } from './Text';

export interface ProgressBarProps {
  /** A value between 0 and 1. Values outside the range are clamped. */
  readonly value: number;
  readonly label?: string;
  readonly caption?: string;
}

export function ProgressBar({ value, label, caption }: ProgressBarProps) {
  const clamped = Math.min(Math.max(value, 0), 1);
  const percent = Math.round(clamped * 100);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ max: 100, min: 0, now: percent }}
    >
      {label === undefined && caption === undefined ? null : (
        <View style={styles.header}>
          {label === undefined ? null : (
            <Text variant="label" tone="secondary">
              {label}
            </Text>
          )}
          {caption === undefined ? null : (
            <Text variant="caption" tone="tertiary">
              {caption}
            </Text>
          )}
        </View>
      )}
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percent}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  track: {
    backgroundColor: colors.surfacePressed,
    borderRadius: theme.radii.pill,
    height: 4,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    backgroundColor: colors.accent,
    borderRadius: theme.radii.pill,
    height: '100%',
  },
});
