import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  Button,
  Card,
  EmptyState,
  FadeIn,
  Note,
  Screen,
  ScreenHeader,
  SectionHeader,
  StepItem,
  Text,
} from '@/components/ui';
import { RESEARCH_DISCLAIMER, ROUTES } from '@/constants';
import { theme } from '@/theme';
import { colors } from '@/theme/colors';

const INSIGHT_STEPS = [
  {
    step: '01',
    title: 'Accepted capture',
    description: 'Every angle passes the quality gate.',
  },
  {
    step: '02',
    title: 'Landmarks',
    description: 'A face model locates points and reports confidence.',
  },
  {
    step: '03',
    title: 'Measurements',
    description: 'Geometry is computed from landmarks with explicit units.',
  },
  {
    step: '04',
    title: 'Observation',
    description: 'A statement is tied to one or more measurements.',
  },
  {
    step: '05',
    title: 'Explanation',
    description: 'Optional language, validated against the same evidence.',
  },
] as const;

const NOT_AN_INSIGHT = [
  'A score out of ten',
  'A verdict about your appearance',
  'A diagnosis or health prediction',
  'A comparison with other people',
] as const;

export function InsightsScreen() {
  return (
    <Screen>
      <ScreenHeader onBack={null} subtitle="Evidence first" title="Insights" />

      <FadeIn>
        <Text tone="tertiary" variant="overline">
          Insights
        </Text>
        <Text style={styles.title} variant="title">
          Evidence before interpretation.
        </Text>
        <Text style={styles.lead} tone="secondary" variant="body">
          An insight is a traceable statement about measurements, not a hot take
          about a face. VYRO will show the measurement, its confidence, and its
          limitations together.
        </Text>
      </FadeIn>

      <FadeIn delay={90} style={styles.section}>
        <Card padded={false}>
          <EmptyState
            action={
              <Button
                label="See the pipeline"
                onPress={() => router.push(ROUTES.analysis)}
                size="sm"
                variant="secondary"
              />
            }
            icon="sparkles-outline"
            message="Insights require an accepted scan and validated measurements. Neither is available in this build."
            title="No insights yet"
          />
        </Card>
      </FadeIn>

      <FadeIn delay={150} style={styles.section}>
        <SectionHeader
          subtitle="Each step narrows what can be claimed."
          title="How an insight is formed"
        />
        {INSIGHT_STEPS.map((item, index) => (
          <StepItem
            description={item.description}
            key={item.step}
            last={index === INSIGHT_STEPS.length - 1}
            step={item.step}
            title={item.title}
          />
        ))}
      </FadeIn>

      <FadeIn delay={210} style={styles.section}>
        <SectionHeader
          subtitle="Language is constrained by design."
          title="What an insight is not"
        />
        <Card>
          {NOT_AN_INSIGHT.map((item) => (
            <View key={item} style={styles.notRow}>
              <Ionicons
                color={colors.danger}
                name="close-circle-outline"
                size={16}
              />
              <Text style={styles.notLabel} tone="secondary" variant="bodySmall">
                {item}
              </Text>
            </View>
          ))}
        </Card>
      </FadeIn>

      <FadeIn delay={270} style={styles.section}>
        <Note title="No synthetic previews" tone="neutral">
          VYRO does not show mock scores or sample insights. The empty state is
          the honest state until the engine exists.
        </Note>
      </FadeIn>

      <Button
        fullWidth
        label="Open the progress model"
        onPress={() => router.push(ROUTES.progress)}
        style={styles.progressButton}
        variant="secondary"
      />

      <Text align="center" style={styles.disclaimer} tone="tertiary" variant="caption">
        {RESEARCH_DISCLAIMER}
      </Text>
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
  notRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  notLabel: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  progressButton: {
    marginTop: theme.spacing['3xl'],
  },
  disclaimer: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
});
