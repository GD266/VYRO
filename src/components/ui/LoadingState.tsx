import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { theme } from '@/theme';
import { colors } from '@/theme/colors';

import { Text } from './Text';

export interface LoadingStateProps {
  readonly message?: string;
  readonly compact?: boolean;
}

export function LoadingState({
  message = 'Loading',
  compact = false,
}: LoadingStateProps) {
  return (
    <View
      accessibilityLabel={message}
      accessibilityRole="progressbar"
      style={[styles.container, compact && styles.compact]}
    >
      <ActivityIndicator color={colors.accent} size="small" />
      <Text variant="bodySmall" tone="tertiary" style={styles.message}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing['4xl'],
  },
  compact: {
    paddingVertical: theme.spacing.xl,
  },
  message: {
    marginTop: theme.spacing.md,
  },
});
