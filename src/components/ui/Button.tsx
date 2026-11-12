import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useHaptics } from '@/hooks';
import { theme } from '@/theme';
import { colors } from '@/theme/colors';

import { Text } from './Text';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  readonly label: string;
  readonly onPress?: () => void;
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly icon?: ReactNode;
  readonly trailingIcon?: ReactNode;
  readonly fullWidth?: boolean;
  readonly haptic?: boolean;
  readonly accessibilityHint?: string;
  readonly testID?: string;
  readonly style?: StyleProp<ViewStyle>;
}

const VARIANT_STYLES: Record<ButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  secondary: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
  },
  outline: {
    backgroundColor: colors.transparent,
    borderColor: colors.border,
  },
  ghost: {
    backgroundColor: colors.transparent,
    borderColor: colors.transparent,
  },
  danger: {
    backgroundColor: colors.dangerSurface,
    borderColor: 'rgba(212, 122, 114, 0.35)',
  },
};

const LABEL_TONE: Record<ButtonVariant, 'inverse' | 'primary' | 'secondary' | 'danger'> = {
  primary: 'inverse',
  secondary: 'primary',
  outline: 'primary',
  ghost: 'secondary',
  danger: 'danger',
};

const SIZE_STYLES: Record<ButtonSize, ViewStyle> = {
  sm: {
    minHeight: 40,
    paddingHorizontal: theme.spacing.lg,
  },
  md: {
    minHeight: theme.layout.minTouchTarget,
    paddingHorizontal: theme.spacing.xl,
  },
  lg: {
    minHeight: 54,
    paddingHorizontal: theme.spacing['2xl'],
  },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  trailingIcon,
  fullWidth = false,
  haptic = true,
  accessibilityHint,
  testID,
  style,
}: ButtonProps) {
  const triggerHaptic = useHaptics();
  const isDisabled = disabled || loading;
  const indicatorColor =
    variant === 'primary' ? colors.accentContrast : colors.accent;

  const handlePress = () => {
    if (haptic) {
      triggerHaptic('light');
    }
    onPress?.();
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      accessibilityHint={accessibilityHint}
      accessibilityLabel={label}
      disabled={isDisabled}
      onPress={handlePress}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        fullWidth && styles.fullWidth,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={indicatorColor} />
      ) : (
        <View style={styles.content}>
          {icon === undefined ? null : <View style={styles.icon}>{icon}</View>}
          <Text variant="label" tone={LABEL_TONE[variant]} numberOfLines={1}>
            {label}
          </Text>
          {trailingIcon === undefined ? null : (
            <View style={styles.trailingIcon}>{trailingIcon}</View>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: theme.radii.md,
    borderWidth: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fullWidth: {
    alignSelf: 'stretch',
  },
  pressed: {
    opacity: 0.82,
  },
  disabled: {
    opacity: 0.45,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  trailingIcon: {
    marginLeft: theme.spacing.sm,
  },
});
