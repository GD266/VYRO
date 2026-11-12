import type { ReactNode } from 'react';
import {
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
} from 'react-native';

import { theme, type TextVariant } from '@/theme';
import { colors } from '@/theme/colors';

export type TextTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'disabled'
  | 'accent'
  | 'accentMuted'
  | 'danger'
  | 'success'
  | 'warning'
  | 'inverse';

const TONE_COLORS: Record<TextTone, string> = {
  primary: colors.text,
  secondary: colors.textSecondary,
  tertiary: colors.textTertiary,
  disabled: colors.textDisabled,
  accent: colors.accent,
  accentMuted: colors.accentMuted,
  danger: colors.danger,
  success: colors.success,
  warning: colors.warning,
  inverse: colors.accentContrast,
};

export interface TextProps extends RNTextProps {
  readonly children?: ReactNode;
  readonly variant?: TextVariant;
  readonly tone?: TextTone;
  readonly align?: TextStyle['textAlign'];
}

export function Text({
  children,
  variant = 'body',
  tone = 'primary',
  align,
  style,
  ...rest
}: TextProps) {
  return (
    <RNText
      {...rest}
      style={[
        theme.typography.variants[variant],
        { color: TONE_COLORS[tone] },
        align === undefined ? null : { textAlign: align },
        style,
      ]}
    >
      {children}
    </RNText>
  );
}
