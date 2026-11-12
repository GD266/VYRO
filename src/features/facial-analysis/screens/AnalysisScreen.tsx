import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  Badge,
  Button,
  Card,
  FadeIn,
  Note,
  Screen,
  ScreenHeader,
  SectionHeader,
  StepItem,
  Text,
} from '@/components/ui';
import { ROUTES } from '@/constants';
import { theme } from '@/theme';
import { colors } from '@/theme/colors';

const PIPELINE = [
  {
    step: '01',
    title: 'Capture session',
    description:
      'Three angles, each checked against the quality gate before anything is measured.',
    status: 'Contract defined',
  },
  {
    step: '02',
    title: 'Landmark detection',
    description:
      'A face model returns points, head pose, and detection confidence. The analysis layer stays model-independent.',
    status: 'Interface only',
  },
  {
    step: '03',
    title: 'Measurements',
    description:
      'Ratios and geometric relationships are computed from landmarks. The current catalog is exploratory.',
    status: 'Catalog only',
  },
  {
    step: '04',
    title: 'Observation and explanation',
    description:
      'Statements must cite measurements. AI output is structurally validated before it can be displayed.',
    status: 'Guardrails only',
  },
] as const;

const NEVER_PRODUCED = [
  'An attractiveness score or ranking',
  'A genetic or ancestry inference',
  'A medical diagnosis or treatment plan',
  'An identity match or recognition result',
] as const;

export function AnalysisScreen() {
  return (
    <Screen
      footer={
        <View>
          <Button
            fullWidth
            label="Recommendation boundaries"
            onPress={() => router.push(ROUTES.recommendations)}
            size="lg"
          />
          <Button
            fullWidth
            label="View the progress model"
            onPress={() => router.push(ROUTES.progress)}
            size="sm"
            style={styles.secondaryAction}
            variant="ghost"
          />
        </View>
      }
    >
      <ScreenHeader title="Analysis" />

      <FadeIn>
        <Text tone="tertiary" variant="overline">
          Pipeline
        </Text>
        <Text style={styles.title} variant="title">
          From pixels to cautious statements.
        </Text>
        <Text style={styles.lead} tone="secondary" variant="body">
          VYRO separates four kinds of data: capture, landmarks, measurements,
          and interpretation. Each layer has a different confidence level, and
          they are never collapsed into a single score.
        </Text>
      </FadeIn>

      <FadeIn delay={90} style={styles.section}>
        <Note title="Not available in this build" tone="warning">
          The analysis engine is not implemented. No measurements, observations,
          or scores are generated, and no placeholder values are shown.
        </Note>
      </FadeIn>

      <FadeIn delay={150} style={styles.section}>
        <SectionHeader
          subtitle="Each stage has an explicit contract."
          title="The pipeline"
        />
        {PIPELINE.map((item, index) => (
          <StepItem
            badge={<Badge label={item.status} tone="outline" />}
            description={item.description}
            key={item.step}
            last={index === PIPELINE.length - 1}
            step={item.step}
            title={item.title}
          />
        ))}
      </FadeIn>

      <FadeIn delay={210} style={styles.section}>
        <SectionHeader
          subtitle="Hard product boundaries, not model behavior."
          title="What will never be produced"
        />
        <Card>
          {NEVER_PRODUCED.map((item) => (
            <View key={item} style={styles.neverRow}>
              <Ionicons
                color={colors.danger}
                name="close-circle-outline"
                size={16}
              />
              <Text style={styles.neverLabel} tone="secondary" variant="bodySmall">
                {item}
              </Text>
            </View>
          ))}
        </Card>
      </FadeIn>

      <FadeIn delay={270} style={styles.section}>
        <Card tone="muted">
          <Text variant="label" tone="secondary">
            Quality before interpretation
          </Text>
          <Text style={styles.cardBody} tone="tertiary" variant="bodySmall">
            A scan that fails lighting, blur, pose, or occlusion checks is
            rejected. VYRO does not analyze a poor capture on a best-effort
            basis, because a confident-looking result from bad input is worse
            than no result.
          </Text>
        </Card>
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
  neverRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  neverLabel: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  cardBody: {
    marginTop: theme.spacing.sm,
  },
  secondaryAction: {
    marginTop: theme.spacing.sm,
  },
});
