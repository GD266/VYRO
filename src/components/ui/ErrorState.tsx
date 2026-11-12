import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { theme } from '@/theme';
import { colors } from '@/theme/colors';

import { Button } from './Button';
import { Text } from './Text';

export interface ErrorStateProps {
  readonly title?: string;
  readonly message: string;
  readonly onRetry?: () => void;
  readonly retryLabel?: string;
  readonly compact?: boolean;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
  compact = false,
}: ErrorStateProps) {
  return (
    <View style={[styles.container, compact && styles.compact]}>
      <View style={styles.icon}>
        <Ionicons color={colors.danger} name="alert-circle-outline" size={22} />
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
      {onRetry === undefined ? null : (
        <Button
          label={retryLabel}
          onPress={onRetry}
          size="sm"
          style={styles.action}
          variant="secondary"
        />
      )}
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
    backgroundColor: colors.dangerSurface,
    borderColor: 'rgba(212, 122, 114, 0.28)',
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
