import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  Badge,
  Button,
  Card,
  Divider,
  EmptyState,
  FadeIn,
  ListItem,
  Note,
  Screen,
  ScreenHeader,
  SectionHeader,
  Text,
  type IconName,
} from '@/components/ui';
import { ROUTES } from '@/constants';
import { theme } from '@/theme';
import { colors } from '@/theme/colors';

interface RecommendationCategory {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: IconName;
}

const CATEGORIES: readonly RecommendationCategory[] = [
  {
    id: 'hair',
    title: 'Hair',
    description: 'Cut, styling, and maintenance options.',
    icon: 'cut-outline',
  },
  {
    id: 'grooming',
    title: 'Grooming',
    description: 'Low-risk routines for hair and facial hair.',
    icon: 'sparkles-outline',
  },
  {
    id: 'skincare',
    title: 'Skincare',
    description: 'General, non-medical care and consistency.',
    icon: 'water-outline',
  },
  {
    id: 'styling',
    title: 'Styling',
    description: 'Framing, color, and presentation choices.',
    icon: 'shirt-outline',
  },
];

const GUARDRAILS = [
  'Every suggestion cites the measurements behind it.',
  'No medical, surgical, or invasive procedures.',
  'No brand deals, affiliate placements, or paid ranking.',
  'An empty result is a valid and common outcome.',
] as const;

export function RecommendationsScreen() {
  return (
    <Screen
      footer={
        <Button
          fullWidth
          label="Review the analysis pipeline"
          onPress={() => router.push(ROUTES.analysis)}
          size="lg"
        />
      }
    >
      <ScreenHeader title="Recommendations" />

      <FadeIn>
        <Text tone="tertiary" variant="overline">
          Guidance, with limits
        </Text>
        <Text style={styles.title} variant="title">
          Optional suggestions, traceable to data.
        </Text>
        <Text style={styles.lead} tone="secondary" variant="body">
          Recommendations are cosmetic and grooming-oriented. They are never a
          verdict, a requirement, or a promise. If the data does not justify a
          suggestion, VYRO returns nothing.
        </Text>
      </FadeIn>

      <FadeIn delay={90} style={styles.section}>
        <Card padded={false}>
          <EmptyState
            compact
            icon="bulb-outline"
            message="Recommendations require accepted measurements. Neither exists in this build."
            title="No recommendations yet"
          />
        </Card>
      </FadeIn>

      <FadeIn delay={150} style={styles.section}>
        <SectionHeader
          subtitle="Each category stays deliberately narrow."
          title="Categories"
        />
        <Card padded={false}>
          {CATEGORIES.map((category, index) => (
            <View key={category.id}>
              {index === 0 ? null : <Divider inset />}
              <ListItem
                description={category.description}
                leftIcon={category.icon}
                right={<Badge label="Awaiting analysis" tone="outline" />}
                title={category.title}
              />
            </View>
          ))}
        </Card>
      </FadeIn>

      <FadeIn delay={210} style={styles.section}>
        <SectionHeader
          subtitle="These rules apply before any model output."
          title="Guardrails"
        />
        <Card>
          {GUARDRAILS.map((guardrail) => (
            <View key={guardrail} style={styles.guardrailRow}>
              <Ionicons
                color={colors.success}
                name="checkmark-circle-outline"
                size={16}
              />
              <Text
                style={styles.guardrailLabel}
                tone="secondary"
                variant="bodySmall"
              >
                {guardrail}
              </Text>
            </View>
          ))}
        </Card>
      </FadeIn>

      <FadeIn delay={270} style={styles.section}>
        <Note title="Why nothing is shown" tone="warning">
          A recommendation without measurement provenance is an opinion. VYRO
          does not display opinions dressed as analysis.
        </Note>
      </FadeIn>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: theme.spacing.md,
  },
  lead: {
    marginTop: theme.spacing.md,
  },
  section: {
    marginTop: theme.spacing['3xl'],
  },
  guardrailRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  guardrailLabel: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
});
