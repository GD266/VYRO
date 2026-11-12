import { StyleSheet, View } from 'react-native';

import { theme } from '@/theme';
import { colors } from '@/theme/colors';

import { Text } from './Text';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info' | 'outline';

export interface BadgeProps {
  readonly label: string;
  readonly tone?: BadgeTone;
  readonly dot?: boolean;
}

const TONE_STYLES: Record<
  BadgeTone,
  { backgroundColor: string; borderColor: string; textColor: string }
> = {
  neutral: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    textColor: colors.textSecondary,
  },
  accent: {
    backgroundColor: 'rgba(214, 208, 195, 0.1)',
    borderColor: 'rgba(214, 208, 195, 0.22)',
    textColor: colors.accent,
  },
  success: {
    backgroundColor: colors.successSurface,
    borderColor: 'rgba(143, 174, 154, 0.28)',
    textColor: colors.success,
  },
  warning: {
    backgroundColor: colors.warningSurface,
    borderColor: 'rgba(199, 167, 106, 0.28)',
    textColor: colors.warning,
  },
  danger: {
    backgroundColor: colors.dangerSurface,
    borderColor: 'rgba(212, 122, 114, 0.28)',
    textColor: colors.danger,
  },
  info: {
    backgroundColor: colors.infoSurface,
    borderColor: 'rgba(143, 163, 184, 0.28)',
    textColor: colors.info,
  },
  outline: {
    backgroundColor: colors.transparent,
    borderColor: colors.border,
    textColor: colors.textTertiary,
  },
};

export function Badge({ label, tone = 'neutral', dot = false }: BadgeProps) {
  const toneStyle = TONE_STYLES[tone];

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: toneStyle.backgroundColor,
          borderColor: toneStyle.borderColor,
        },
      ]}
    >
      {dot ? (
        <View style={[styles.dot, { backgroundColor: toneStyle.textColor }]} />
      ) : null}
      <Text style={[styles.label, { color: toneStyle.textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: theme.radii.pill,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
  },
  dot: {
    borderRadius: theme.radii.pill,
    height: 5,
    marginRight: 6,
    width: 5,
  },
  label: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.medium,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
});
