import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import {
  Badge,
  Button,
  Card,
  Divider,
  FadeIn,
  ListItem,
  Note,
  Screen,
  ScreenHeader,
  SectionHeader,
  Text,
} from '@/components/ui';
import { RESEARCH_DISCLAIMER, ROUTES, SCAN_ANGLES } from '@/constants';
import { theme } from '@/theme';
import { colors } from '@/theme/colors';

const QUALITY_CHECKS = [
  'Exposure within the supported range',
  'Blur below the rejection threshold',
  'Face coverage and centering',
  'Head pose close to the requested angle',
  'No significant occlusion',
  'Enough landmarks detected',
] as const;

export function ScanCaptureScreen() {
  return (
    <Screen
      footer={
        <View>
          <Button
            fullWidth
            label="Review the analysis pipeline"
            onPress={() => router.push(ROUTES.analysis)}
            size="lg"
          />
          <Button
            fullWidth
            label="Back to preparation"
            onPress={() => router.back()}
            size="sm"
            style={styles.secondaryAction}
            variant="ghost"
          />
        </View>
      }
    >
      <ScreenHeader subtitle="Step 02 of 02" title="Capture" />

      <FadeIn>
        <Badge dot label="Camera unavailable" tone="warning" />
        <Text style={styles.title} variant="title">
          The capture engine is not installed.
        </Text>
        <Text style={styles.lead} tone="secondary" variant="body">
          This build ships the consent, navigation, quality gate, and analysis
          contracts. Camera access and on-device landmark detection arrive in
          the capture phase.
        </Text>
      </FadeIn>

      <FadeIn delay={100} style={styles.viewfinder}>
        <View style={styles.viewfinderHeader}>
          <Badge label="Preview unavailable" tone="outline" />
          <Text tone="tertiary" variant="overline">
            Live frame
          </Text>
        </View>
        <View style={styles.viewfinderBody}>
          <View style={styles.faceGuide} />
          <Text align="center" style={styles.viewfinderLabel} tone="tertiary" variant="caption">
            A guided oval will keep your full face inside the frame.
          </Text>
        </View>
      </FadeIn>

      <FadeIn delay={160} style={styles.section}>
        <SectionHeader
          subtitle="Each angle is captured separately."
          title="Angle slots"
        />
        <Card padded={false}>
          {SCAN_ANGLES.map((angle, index) => (
            <View key={angle.id}>
              {index === 0 ? null : <Divider inset />}
              <ListItem
                description={angle.instruction}
                leftIcon="person-outline"
                right={<Badge label="Pending" tone="outline" />}
                title={angle.label}
              />
            </View>
          ))}
        </Card>
      </FadeIn>

      <FadeIn delay={220} style={styles.section}>
        <SectionHeader
          subtitle="A frame must satisfy every check."
          title="Quality gate"
        />
        <Card>
          {QUALITY_CHECKS.map((check) => (
            <View key={check} style={styles.checkRow}>
              <Ionicons
                color={colors.textTertiary}
                name="ellipse-outline"
                size={12}
              />
              <Text style={styles.checkLabel} tone="secondary" variant="bodySmall">
                {check}
              </Text>
            </View>
          ))}
        </Card>
      </FadeIn>

      <FadeIn delay={280} style={styles.section}>
        <Note icon="lock-closed-outline" title="No permission requested" tone="info">
          VYRO does not ask for camera or photo-library access in this build. When
          capture ships, images will be processed on-device and will not be
          uploaded by default.
        </Note>
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
  viewfinder: {
    aspectRatio: 3 / 4,
    backgroundColor: colors.backgroundElevated,
    borderColor: colors.border,
    borderRadius: theme.radii.xl,
    borderStyle: 'dashed',
    borderWidth: 1,
    marginTop: theme.spacing['2xl'],
    padding: theme.spacing.lg,
  },
  viewfinderHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewfinderBody: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  faceGuide: {
    aspectRatio: 0.72,
    borderColor: 'rgba(214, 208, 195, 0.28)',
    borderRadius: theme.radii.pill,
    borderStyle: 'dashed',
    borderWidth: 1,
    width: '58%',
  },
  viewfinderLabel: {
    marginTop: theme.spacing.xl,
    maxWidth: 260,
  },
  section: {
    marginTop: theme.spacing['3xl'],
  },
  checkRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  checkLabel: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  disclaimer: {
    marginTop: theme.spacing['3xl'],
    paddingHorizontal: theme.spacing.lg,
  },
  secondaryAction: {
    marginTop: theme.spacing.sm,
  },
});
