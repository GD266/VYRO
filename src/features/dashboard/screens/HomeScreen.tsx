import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  Badge,
  Button,
  Card,
  Divider,
  EmptyState,
  FadeIn,
  IconButton,
  ListItem,
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
import { getGreeting } from '@/utils';

const BOUNDARY_STEPS = [
  {
    step: '01',
    title: 'Capture',
    description:
      'Three guided angles, checked for light, blur, pose, and occlusion before anything else happens.',
  },
  {
    step: '02',
    title: 'Landmarks',
    description:
      'A face model locates points and reports confidence. No identity is inferred from them.',
  },
  {
    step: '03',
    title: 'Measurements',
    description:
      'Geometry is computed from landmarks. Ratios and distances, not judgments.',
  },
  {
    step: '04',
    title: 'Explanation',
    description:
      'Optional language that must cite measurements. It is never treated as evidence.',
  },
] as const;

export function HomeScreen() {
  return (
    <Screen>
      <ScreenHeader
        onBack={null}
        right={
          <IconButton
            accessibilityLabel="Open privacy principles"
            name="shield-checkmark-outline"
            onPress={() => router.push(ROUTES.privacy)}
            tone="secondary"
            variant="surface"
          />
        }
        title="VYRO"
        subtitle="Research preview"
      />

      <FadeIn>
        <Text variant="title">{getGreeting()}.</Text>
        <Text style={styles.lead} tone="secondary" variant="body">
          This is your private workspace for measured facial analysis. Nothing
          is analyzed yet.
        </Text>
      </FadeIn>

      <FadeIn delay={90}>
        <LinearGradient
          colors={theme.gradients.hero}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={styles.hero}
        >
          <View style={styles.heroHeader}>
            <Badge dot label="Foundation build" tone="outline" />
            <Text tone="tertiary" variant="overline">
              Status
            </Text>
          </View>

          <Text style={styles.heroTitle} variant="heading">
            No scan yet.
          </Text>
          <Text style={styles.heroBody} tone="secondary" variant="bodySmall">
            The capture and analysis engines are not part of this build. You can
            walk through the planned flow and review every boundary first.
          </Text>

          <Button
            fullWidth
            label="Explore the scan flow"
            onPress={() => router.navigate(ROUTES.scan)}
            style={styles.heroAction}
          />
          <Button
            fullWidth
            label="Read the analysis boundary"
            onPress={() => router.push(ROUTES.analysis)}
            size="sm"
            variant="ghost"
          />
        </LinearGradient>
      </FadeIn>

      <FadeIn delay={160} style={styles.section}>
        <SectionHeader
          subtitle="Four layers that are never blended."
          title="The boundary"
        />
        {BOUNDARY_STEPS.map((item, index) => (
          <StepItem
            description={item.description}
            key={item.step}
            last={index === BOUNDARY_STEPS.length - 1}
            step={item.step}
            title={item.title}
          />
        ))}
      </FadeIn>

      <FadeIn delay={220} style={styles.section}>
        <Note title="What VYRO will not do" tone="warning">
          VYRO will not produce an attractiveness score, infer genetics, diagnose
          a medical condition, recognize identity, or publish public rankings.
        </Note>
      </FadeIn>

      <FadeIn delay={280} style={styles.section}>
        <SectionHeader
          action={
            <Badge label="Local only" tone="success" />
          }
          subtitle="Preferences and consent live on this device."
          title="Your data"
        />
        <Card padded={false}>
          <ListItem
            description="This build stores preferences and a consent record. No images."
            leftIcon="phone-portrait-outline"
            title="On-device storage"
          />
          <Divider inset />
          <ListItem
            description="Processing, retention, and deletion in plain language."
            leftIcon="shield-checkmark-outline"
            onPress={() => router.push(ROUTES.privacy)}
            showChevron
            title="Privacy principles"
          />
        </Card>
      </FadeIn>

      <FadeIn delay={340} style={styles.section}>
        <SectionHeader
          subtitle="Analyses will appear here once the engine ships."
          title="Recent analyses"
        />
        <Card padded={false}>
          <EmptyState
            action={
              <Button
                label="Open insights"
                onPress={() => router.navigate(ROUTES.insights)}
                size="sm"
                variant="secondary"
              />
            }
            compact
            icon="sparkles-outline"
            message="No accepted scans, measurements, or observations exist yet."
            title="Nothing measured"
          />
        </Card>
      </FadeIn>

      <Text align="center" style={styles.disclaimer} tone="tertiary" variant="caption">
        {RESEARCH_DISCLAIMER}
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: {
    marginTop: theme.spacing.sm,
  },
  hero: {
    borderColor: colors.border,
    borderRadius: theme.radii.xl,
    borderWidth: 1,
    marginTop: theme.spacing.xl,
    overflow: 'hidden',
    padding: theme.spacing.xl,
  },
  heroHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroTitle: {
    marginTop: theme.spacing.xl,
  },
  heroBody: {
    marginTop: theme.spacing.sm,
  },
  heroAction: {
    marginTop: theme.spacing.xl,
  },
  section: {
    marginTop: theme.spacing['3xl'],
  },
  disclaimer: {
    marginTop: theme.spacing['3xl'],
    paddingHorizontal: theme.spacing.lg,
  },
});
