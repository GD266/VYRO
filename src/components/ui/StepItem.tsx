import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { theme } from '@/theme';
import { colors } from '@/theme/colors';

import { Text } from './Text';

export interface StepItemProps {
  /** A short marker such as "01" or "A". */
  readonly step: string;
  readonly title: string;
  readonly description: string;
  readonly badge?: ReactNode;
  readonly last?: boolean;
}

/**
 * A vertical step with a rail. Used for the capture sequence, the analysis
 * pipeline, and the insight-formation model.
 */
export function StepItem({
  step,
  title,
  description,
  badge,
  last = false,
}: StepItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.rail}>
        <View style={styles.marker}>
          <Text style={styles.markerLabel}>{step}</Text>
        </View>
        {last ? null : <View style={styles.line} />}
      </View>

      <View style={[styles.content, last && styles.contentLast]}>
        <View style={styles.titleRow}>
          <Text variant="body" tone="primary" style={styles.title}>
            {title}
          </Text>
          {badge === undefined ? null : <View style={styles.badge}>{badge}</View>}
        </View>
        <Text variant="bodySmall" tone="tertiary" style={styles.description}>
          {description}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  rail: {
    alignItems: 'center',
    marginRight: theme.spacing.lg,
    width: 30,
  },
  marker: {
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  markerLabel: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.medium,
    letterSpacing: 0.6,
  },
  line: {
    backgroundColor: colors.border,
    flex: 1,
    marginTop: theme.spacing.sm,
    width: StyleSheet.hairlineWidth,
  },
  content: {
    flex: 1,
    paddingBottom: theme.spacing.xl,
  },
  contentLast: {
    paddingBottom: 0,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 3,
  },
  title: {
    flexShrink: 1,
  },
  badge: {
    marginLeft: theme.spacing.sm,
  },
  description: {
    marginTop: theme.spacing.xs,
  },
});
