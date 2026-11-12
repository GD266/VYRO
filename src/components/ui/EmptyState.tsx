import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { theme } from '@/theme';
import { colors } from '@/theme/colors';

import { Text } from './Text';

export type EmptyStateIcon = ComponentProps<typeof Ionicons>['name'];

export interface EmptyStateProps {
  readonly title: string;
  readonly message: string;
  readonly icon?: EmptyStateIcon;
  readonly action?: ReactNode;
  readonly compact?: boolean;
}

export function EmptyState({
  title,
  message,
  icon = 'sparkles-outline',
  action,
  compact = false,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, compact && styles.compact]}>
      <View style={styles.icon}>
        <Ionicons color={colors.textSecondary} name={icon} size={22} />
      </View>
      <Text variant="subheading" tone="primary" align="center">
        {title}
      </Text>
      <Text
        variant="bodySmall"
        tone="tertiary"
        align="center"
        style={styles.message}
      >
        {message}
      </Text>
      {action === undefined ? null : <View style={styles.action}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing['3xl'],
  },
  compact: {
    paddingVertical: theme.spacing.xl,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.borderSubtle,
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    height: theme.layout.minTouchTarget,
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
    width: theme.layout.minTouchTarget,
  },
  message: {
    marginTop: theme.spacing.sm,
    maxWidth: 320,
  },
  action: {
    marginTop: theme.spacing.xl,
  },
});
