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
  Text,
  type IconName,
} from '@/components/ui';
import { ROUTES } from '@/constants';
import { theme } from '@/theme';
import { colors } from '@/theme/colors';

interface ProgressCapability {
  readonly icon: IconName;
  readonly title: string;
  readonly description: string;
}

const CAPABILITIES: readonly ProgressCapability[] = [
  {
    icon: 'analytics-outline',
    title: 'Measurement deltas',
    description: 'Change between sessions, with confidence attached.',
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Capture quality per session',
    description: 'A result is only comparable when the input passed the gate.',
  },
  {
    icon: 'git-compare-outline',
    title: 'Like-for-like angles',
    description: 'Front is compared with front, profile with profile.',
  },
  {
    icon: 'alert-circle-outline',
    title: 'Explicit gaps',
    description: 'Missing data is shown as missing, never interpolated away.',
  },
];

export function ProgressScreen() {
  return (
    <Screen
      footer={
        <View>
          <Button
            fullWidth
            label="Review the scan flow"
            onPress={() => router.navigate(ROUTES.scan)}
            size="lg"
          />
          <Button
            fullWidth
            label="Back to insights"
            onPress={() => router.navigate(ROUTES.insights)}
            size="sm"
            style={styles.secondaryAction}
            variant="ghost"
          />
        </View>
      }
    >
      <ScreenHeader title="Progress" />

      <FadeIn>
        <Text tone="tertiary" variant="overline">
          Longitudinal view
        </Text>
        <Text style={styles.title} variant="title">
          Track change, not a score.
        </Text>
        <Text style={styles.lead} tone="secondary" variant="body">
          Progress will compare accepted captures over time. It is a record of
          measurement movement and data quality, not a ranking against other
          people or an ideal face.
        </Text>
      </FadeIn>

      <FadeIn delay={90} style={styles.chartSection}>
        <Card>
          <View style={styles.chartHeader}>
            <Text variant="label" tone="secondary">
              Measurement trend
            </Text>
            <Badge label="No data" tone="outline" />
          </View>

          <View style={styles.chart}>
            <View pointerEvents="none" style={styles.grid}>
              {[0, 1, 2, 3, 4].map((line) => (
                <View key={line} style={styles.gridLine} />
              ))}
            </View>
            <View style={styles.chartEmpty}>
              <Ionicons
                color={colors.textTertiary}
                name="pulse-outline"
                size={24}
              />
              <Text style={styles.chartTitle} variant="bodySmall" tone="secondary">
                No sessions recorded
              </Text>
              <Text align="center" variant="caption" tone="tertiary">
                Accepted sessions will appear here once capture and analysis
                are available.
              </Text>
            </View>
          </View>
        </Card>
        <Text style={styles.chartCaption} tone="tertiary" variant="caption">
          This is an empty state, not a sample chart. No synthetic data is used.
        </Text>
      </FadeIn>

      <FadeIn delay={150} style={styles.section}>
        <SectionHeader
          subtitle="What the view is designed to answer."
          title="What progress will show"
        />
        <Card>
          {CAPABILITIES.map((capability) => (
            <View key={capability.title} style={styles.capabilityRow}>
              <View style={styles.capabilityIcon}>
                <Ionicons
                  color={colors.accent}
                  name={capability.icon}
                  size={16}
                />
              </View>
              <View style={styles.capabilityCopy}>
                <Text variant="body" tone="primary">
                  {capability.title}
                </Text>
                <Text variant="caption" tone="tertiary">
                  {capability.description}
                </Text>
              </View>
            </View>
          ))}
        </Card>
      </FadeIn>

      <FadeIn delay={210} style={styles.section}>
        <Note title="No leaderboards" tone="warning">
          VYRO does not rank faces, publish percentiles, or compare you with
          other users. Progress is personal and private.
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
  chartSection: {
    marginTop: theme.spacing['2xl'],
  },
  chartHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chart: {
    height: 190,
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
    position: 'relative',
  },
  grid: {
    bottom: 0,
    justifyContent: 'space-between',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  gridLine: {
    backgroundColor: colors.hairline,
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
  chartEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  chartTitle: {
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  chartCaption: {
    marginTop: theme.spacing.sm,
  },
  section: {
    marginTop: theme.spacing['3xl'],
  },
  capabilityRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  capabilityIcon: {
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.borderSubtle,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    width: 30,
  },
  capabilityCopy: {
    flex: 1,
  },
  secondaryAction: {
    marginTop: theme.spacing.sm,
  },
});
