import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { ROUTES } from '@/constants';
import { theme } from '@/theme';

import { IconButton } from './IconButton';
import { Text } from './Text';

export interface ScreenHeaderProps {
  readonly title?: string;
  readonly subtitle?: string;
  /**
   * Omit to use the default back behavior. Pass `null` to hide the back
   * button, for example on a root-level screen.
   */
  readonly onBack?: (() => void) | null;
  readonly right?: ReactNode;
  readonly testID?: string;
}

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  right,
  testID,
}: ScreenHeaderProps) {
  const showBack = onBack !== null;

  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack();
      return;
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(ROUTES.home);
  };

  return (
    <View style={styles.container} testID={testID}>
      {showBack ? (
        <IconButton
          accessibilityLabel="Go back"
          name="chevron-back"
          onPress={handleBack}
          style={styles.back}
          tone="secondary"
        />
      ) : null}

      <View style={styles.copy}>
        {title === undefined ? null : (
          <Text variant="subheading" tone="primary" numberOfLines={1}>
            {title}
          </Text>
        )}
        {subtitle === undefined ? null : (
          <Text variant="caption" tone="tertiary" numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {right === undefined ? null : <View style={styles.right}>{right}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: theme.spacing.xl,
    minHeight: theme.layout.headerHeight,
  },
  back: {
    marginLeft: -theme.spacing.md,
    marginRight: theme.spacing.xs,
  },
  copy: {
    flex: 1,
  },
  right: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.md,
  },
});
