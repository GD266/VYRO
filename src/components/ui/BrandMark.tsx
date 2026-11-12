import { LinearGradient } from 'expo-linear-gradient';
import { Platform, StyleSheet, View } from 'react-native';

import { APP } from '@/constants';
import { theme } from '@/theme';

import { Text } from './Text';

const SERIF_FONT =
  Platform.select({
    ios: 'Georgia',
    android: 'serif',
    default: 'Georgia',
  }) ?? 'serif';

export interface BrandMarkProps {
  readonly size?: number;
  readonly showWordmark?: boolean;
  readonly showTagline?: boolean;
}

/**
 * The VYRO monogram. A serif V on a charcoal metallic tile keeps the mark
 * quiet enough for a measurement tool while still feeling deliberate.
 */
export function BrandMark({
  size = 72,
  showWordmark = false,
  showTagline = false,
}: BrandMarkProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        accessibilityLabel="VYRO"
        accessibilityRole="image"
        colors={['#202127', '#0B0C0F']}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={[
          styles.mark,
          {
            borderRadius: size * 0.26,
            height: size,
            width: size,
          },
        ]}
      >
        <Text
          style={[
            styles.letter,
            {
              fontSize: size * 0.52,
              lineHeight: size * 0.66,
            },
          ]}
        >
          V
        </Text>
        <View style={[styles.rule, { width: size * 0.26 }]} />
      </LinearGradient>

      {showWordmark ? (
        <Text variant="label" tone="primary" style={styles.wordmark}>
          VYRO
        </Text>
      ) : null}

      {showTagline ? (
        <Text variant="caption" tone="tertiary" style={styles.tagline}>
          {APP.tagline}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  mark: {
    alignItems: 'center',
    borderColor: 'rgba(214, 208, 195, 0.22)',
    borderWidth: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  letter: {
    color: theme.colors.accentStrong,
    fontFamily: SERIF_FONT,
    includeFontPadding: false,
    marginTop: -2,
    textAlign: 'center',
  },
  rule: {
    backgroundColor: 'rgba(214, 208, 195, 0.4)',
    height: StyleSheet.hairlineWidth,
    marginTop: 2,
  },
  wordmark: {
    fontSize: 14,
    letterSpacing: 7,
    marginTop: theme.spacing.md,
    paddingLeft: 7,
  },
  tagline: {
    letterSpacing: 0.4,
    marginTop: theme.spacing.xs,
  },
});
