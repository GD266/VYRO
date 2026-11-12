import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  BrandMark,
  Button,
  Card,
  FadeIn,
  Screen,
  Text,
  type IconName,
} from '@/components/ui';
import { APP, RESEARCH_DISCLAIMER, ROUTES } from '@/constants';
import { useHasCurrentConsent } from '@/hooks';
import { theme } from '@/theme';
import { colors } from '@/theme/colors';

interface Principle {
  readonly icon: IconName;
  readonly title: string;
  readonly description: string;
}

const PRINCIPLES: readonly Principle[] = [
  {
    icon: 'analytics-outline',
    title: 'Measured, not guessed',
    description:
      'Landmarks and geometry are computed first. Interpretation comes only after the scan passes quality checks.',
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Private by design',
    description:
      'Built for on-device processing. No identity recognition, no public rankings, no facial data marketplace.',
  },
  {
    icon: 'scale-outline',
    title: 'Honest about limits',
    description:
      'No genetic claims, no attractiveness scores, and no medical advice. Uncertainty is shown, not hidden.',
  },
];

export function WelcomeScreen() {
  const hasConsent = useHasCurrentConsent();

  if (hasConsent) {
    return <Redirect href={ROUTES.home} />;
  }

  return (
    <Screen
      footer={
        <View>
          <Button
            fullWidth
            label="Continue"
            onPress={() => router.push(ROUTES.consent)}
            size="lg"
          />
          <Text
            align="center"
            style={styles.footerNote}
            tone="tertiary"
            variant="caption"
          >
            Adults 18+. Analysis is not available in this build.
          </Text>
        </View>
      }
    >
      <FadeIn style={styles.hero}>
        <BrandMark size={84} showTagline />
        <Text style={styles.overline} tone="tertiary" variant="overline">
          {APP.name} / Research preview
        </Text>
        <Text align="center" style={styles.title} variant="hero">
          See your face as geometry, not a verdict.
        </Text>
        <Text align="center" style={styles.subtitle} tone="secondary" variant="body">
          VYRO is building a measurement-first facial analysis tool. It keeps
          what a camera captures, what a model measures, and what can
          responsibly be said strictly separate.
        </Text>
      </FadeIn>

      <FadeIn delay={120} style={styles.principles}>
        {PRINCIPLES.map((principle) => (
          <Card key={principle.title} style={styles.principle} tone="muted">
            <View style={styles.principleHeader}>
              <View style={styles.principleIcon}>
                <Ionicons
                  color={colors.accent}
                  name={principle.icon}
                  size={18}
                />
              </View>
              <Text variant="subheading">{principle.title}</Text>
            </View>
            <Text style={styles.principleBody} tone="tertiary" variant="bodySmall">
              {principle.description}
            </Text>
          </Card>
        ))}
      </FadeIn>

      <FadeIn delay={220} style={styles.footerLinks}>
        <Button
          label="Read the privacy principles"
          onPress={() => router.push(ROUTES.privacy)}
          size="sm"
          variant="ghost"
        />
        <Text align="center" style={styles.disclaimer} tone="tertiary" variant="caption">
          {RESEARCH_DISCLAIMER}
        </Text>
      </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    paddingBottom: theme.spacing['3xl'],
    paddingTop: theme.spacing['3xl'],
  },
  overline: {
    marginTop: theme.spacing['2xl'],
  },
  title: {
    marginTop: theme.spacing.lg,
    maxWidth: 420,
  },
  subtitle: {
    marginTop: theme.spacing.lg,
    maxWidth: 420,
  },
  principles: {
    gap: theme.spacing.md,
  },
  principle: {
    padding: theme.spacing.lg,
  },
  principleHeader: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  principleIcon: {
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    width: 34,
  },
  principleBody: {
    marginTop: theme.spacing.sm,
  },
  footerLinks: {
    marginTop: theme.spacing['2xl'],
  },
  disclaimer: {
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  footerNote: {
    marginTop: theme.spacing.md,
  },
});
