import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { useHaptics } from '@/hooks';
import { theme } from '@/theme';
import { colors } from '@/theme/colors';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export interface IconButtonProps {
  readonly name: IconName;
  readonly onPress: () => void;
  readonly accessibilityLabel: string;
  readonly size?: number;
  readonly tone?: 'primary' | 'secondary' | 'danger';
  readonly variant?: 'ghost' | 'surface';
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

export function IconButton({
  name,
  onPress,
  accessibilityLabel,
  size = 22,
  tone = 'primary',
  variant = 'ghost',
  style,
  testID,
}: IconButtonProps) {
  const triggerHaptic = useHaptics();
  const color =
    tone === 'danger'
      ? colors.danger
      : tone === 'secondary'
        ? colors.textSecondary
        : colors.text;

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={12}
      onPress={() => {
        triggerHaptic('light');
        onPress();
      }}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        variant === 'surface' && styles.surface,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Ionicons color={color} name={name} size={size} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: theme.radii.pill,
    height: theme.layout.minTouchTarget,
    justifyContent: 'center',
    width: theme.layout.minTouchTarget,
  },
  surface: {
    backgroundColor: colors.surface,
    borderColor: colors.borderSubtle,
    borderWidth: 1,
  },
  pressed: {
    backgroundColor: colors.surfacePressed,
  },
});
