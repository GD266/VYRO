import type { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
  type Edge,
} from 'react-native-safe-area-context';

import { theme } from '@/theme';

const DEFAULT_EDGES: readonly Edge[] = ['top', 'left', 'right'];

export interface ScreenProps {
  readonly children: ReactNode;
  /** Enables vertical scrolling. Prefer this for every content-heavy screen. */
  readonly scroll?: boolean;
  /** Applies the standard horizontal screen gutter. */
  readonly padded?: boolean;
  readonly edges?: readonly Edge[];
  /** Sticky action area rendered above the bottom safe area. */
  readonly footer?: ReactNode;
  readonly contentStyle?: StyleProp<ViewStyle>;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

/**
 * The shared screen shell. Handles safe areas, tablet-width content, and the
 * sticky footer used by the guided flow.
 */
export function Screen({
  children,
  scroll = true,
  padded = true,
  edges = DEFAULT_EDGES,
  footer,
  contentStyle,
  style,
  testID,
}: ScreenProps) {
  const insets = useSafeAreaInsets();
  const hasFooter = footer !== undefined;

  return (
    <SafeAreaView edges={edges} style={[styles.safeArea, style]} testID={testID}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            padded && styles.padded,
            {
              paddingBottom: hasFooter
                ? theme.spacing['3xl']
                : insets.bottom + theme.spacing['4xl'],
            },
            contentStyle,
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.column}>{children}</View>
        </ScrollView>
      ) : (
        <View style={[styles.body, padded && styles.padded, contentStyle]}>
          <View style={styles.column}>{children}</View>
        </View>
      )}

      {hasFooter ? (
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(insets.bottom, theme.spacing.lg) },
          ]}
        >
          <View style={styles.column}>{footer}</View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.background,
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  body: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: theme.layout.screenPadding,
  },
  column: {
    alignSelf: 'center',
    maxWidth: theme.layout.maxContentWidth,
    width: '100%',
  },
  footer: {
    backgroundColor: theme.colors.backgroundElevated,
    borderTopColor: theme.colors.hairline,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: theme.layout.screenPadding,
    paddingTop: theme.spacing.lg,
  },
});
