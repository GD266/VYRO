import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { theme } from '@/theme';
import { colors } from '@/theme/colors';

export interface DividerProps {
  readonly inset?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

export function Divider({ inset = false, style }: DividerProps) {
  return <View style={[styles.base, inset && styles.inset, style]} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.hairline,
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
  inset: {
    marginHorizontal: theme.spacing.xl,
  },
});
