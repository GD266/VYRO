import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { theme } from '@/theme';

import { Text } from './Text';

export interface SectionHeaderProps {
  readonly title: string;
  readonly subtitle?: string;
  readonly action?: ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.copy}>
        <Text variant="subheading" tone="primary">
          {title}
        </Text>
        {subtitle === undefined ? null : (
          <Text variant="bodySmall" tone="tertiary" style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </View>
      {action === undefined ? null : <View>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  copy: {
    flex: 1,
    paddingRight: theme.spacing.md,
  },
  subtitle: {
    marginTop: theme.spacing.xs,
  },
});
