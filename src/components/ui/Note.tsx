import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { theme } from '@/theme';
import { colors } from '@/theme/colors';

import type { IconName } from './IconButton';
import { Text } from './Text';

export type NoteTone = 'neutral' | 'info' | 'warning' | 'success';

export interface NoteProps {
  readonly children: ReactNode;
  readonly tone?: NoteTone;
  readonly icon?: IconName;
  readonly title?: string;
  readonly style?: StyleProp<ViewStyle>;
}

const TONE_STYLES: Record<
  NoteTone,
  { readonly background: string; readonly border: string; readonly icon: string }
> = {
  neutral: {
    background: colors.backgroundElevated,
    border: colors.borderSubtle,
    icon: colors.textTertiary,
  },
  info: {
    background: colors.infoSurface,
    border: 'rgba(143, 163, 184, 0.24)',
    icon: colors.info,
  },
  warning: {
    background: colors.warningSurface,
    border: 'rgba(199, 167, 106, 0.24)',
    icon: colors.warning,
  },
  success: {
    background: colors.successSurface,
    border: 'rgba(143, 174, 154, 0.24)',
    icon: colors.success,
  },
};

const DEFAULT_ICONS: Record<NoteTone, IconName> = {
  neutral: 'information-circle-outline',
  info: 'shield-checkmark-outline',
  warning: 'alert-circle-outline',
  success: 'checkmark-circle-outline',
};

export function Note({
  children,
  tone = 'neutral',
  icon,
  title,
  style,
}: NoteProps) {
  const toneStyle = TONE_STYLES[tone];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: toneStyle.background, borderColor: toneStyle.border },
        style,
      ]}
    >
      <Ionicons
        color={toneStyle.icon}
        name={icon ?? DEFAULT_ICONS[tone]}
        size={18}
        style={styles.icon}
      />
      <View style={styles.copy}>
        {title === undefined ? null : (
          <Text variant="label" tone="primary" style={styles.title}>
            {title}
          </Text>
        )}
        <Text variant="bodySmall" tone="secondary">
          {children}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    flexDirection: 'row',
    padding: theme.spacing.lg,
  },
  icon: {
    marginRight: theme.spacing.md,
    marginTop: 2,
  },
  copy: {
    flex: 1,
  },
  title: {
    marginBottom: theme.spacing.xs,
  },
});
