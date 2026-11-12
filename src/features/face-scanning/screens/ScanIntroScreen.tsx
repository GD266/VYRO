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
import { RESEARCH_DISCLAIMER, ROUTES, SCAN_ANGLES } from '@/constants';
import { theme } from '@/theme';

export function ScanIntroScreen() {
  return (
    <Screen
      footer={
        <View>
          <Button
            fullWidth
            label="Walk through preparation"
            onPress={() => router.push(ROUTES.scanPreparation)}
            size="lg"
          />
          <Text align="center" style={styles.footerNote} tone="tertiary" variant="caption">
            No camera permission is requested in this build.
          </Text>
        </View>
      }
    >
      <ScreenHeader onBack={null} subtitle="Guided capture" title="Scan" />

      <FadeIn>
        <Badge label="Capture engine not installed" tone="warning" />
        <Text style={styles.title} variant="title">
          Three angles. One controlled session.
        </Text>
        <Text style={styles.lead} tone="secondary" variant="body">
          VYRO is designed around a fixed capture sequence. The same angles,
          lighting checks, and pose limits apply to every session so that later
          comparisons are like-for-like.
        </Text>
      </FadeIn>

      <FadeIn delay={100} style={styles.section}>
        <SectionHeader
          subtitle="Front and both profiles, captured in order."
          title="The sequence"
        />
        {SCAN_ANGLES.map((angle, index) => (
          <StepItem
            badge={<Badge label="Planned" tone="outline" />}
            description={angle.instruction}
            key={angle.id}
            last={index === SCAN_ANGLES.length - 1}
            step={`0${index + 1}`}
            title={angle.label}
          />
        ))}
      </FadeIn>

      <FadeIn delay={170} style={styles.section}>
        <Note title="Why three angles" tone="neutral">
          A frontal image supports bilateral geometry. Profiles add depth-sensitive
          context. A single frame would make the results look more certain than
          they are.
        </Note>
      </FadeIn>

      <FadeIn delay={230} style={styles.section}>
        <Card tone="muted">
          <Text variant="label" tone="secondary">
            Quality before interpretation
          </Text>
          <Text style={styles.cardBody} tone="tertiary" variant="bodySmall">
            Every frame must pass lighting, blur, centering, pose, and occlusion
            checks. A scan that fails is rejected and never analyzed on a
            best-effort basis.
          </Text>
        </Card>
      </FadeIn>

      <Text align="center" style={styles.disclaimer} tone="tertiary" variant="caption">
        {RESEARCH_DISCLAIMER}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: theme.spacing.lg,
  },
  lead: {
    marginTop: theme.spacing.md,
  },
  section: {
    marginTop: theme.spacing['3xl'],
  },
  cardBody: {
    marginTop: theme.spacing.sm,
  },
  disclaimer: {
    marginTop: theme.spacing['3xl'],
    paddingHorizontal: theme.spacing.lg,
  },
  footerNote: {
    marginTop: theme.spacing.md,
  },
});
