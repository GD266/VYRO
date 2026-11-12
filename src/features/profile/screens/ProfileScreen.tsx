import { router } from 'expo-router';
import { Alert, StyleSheet, Switch, View } from 'react-native';

import {
  Badge,
  BrandMark,
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
import {
  APP,
  RESEARCH_DISCLAIMER,
  ROUTES,
  isAIConfigured,
  isSupabaseConfigured,
} from '@/constants';
import { usePreferencesStore } from '@/store';
import { theme } from '@/theme';
import { colors } from '@/theme/colors';
import { formatShortDate } from '@/utils';

export function ProfileScreen() {
  const consent = usePreferencesStore((state) => state.consent);
  const hapticsEnabled = usePreferencesStore((state) => state.hapticsEnabled);
  const setHapticsEnabled = usePreferencesStore((state) => state.setHapticsEnabled);
  const resetLocalData = usePreferencesStore((state) => state.resetLocalData);

  const confirmDelete = () => {
    Alert.alert(
      'Delete local data?',
      'This removes your consent, onboarding state, and preferences from this device. It cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            resetLocalData();
            router.replace(ROUTES.welcome);
          },
        },
      ],
    );
  };

  return (
    <Screen>
      <ScreenHeader onBack={null} title="Profile" />

      <FadeIn>
        <Card style={styles.identityCard} tone="muted">
          <View style={styles.identityRow}>
            <BrandMark size={54} />
            <View style={styles.identityCopy}>
              <Text variant="subheading">Local profile</Text>
              <Text style={styles.identityBody} tone="tertiary" variant="caption">
                No account, no email, and no cloud profile. Your preferences and
                consent live on this device.
              </Text>
            </View>
          </View>
          <View style={styles.badges}>
            <Badge label="No account required" tone="outline" />
            <Badge label="Local only" tone="success" />
          </View>
        </Card>
      </FadeIn>

      <FadeIn delay={90} style={styles.section}>
        <SectionHeader title="Preferences" />
        <Card padded={false}>
          <ListItem
            description="Subtle feedback on buttons and checklist items."
            leftIcon="pulse-outline"
            right={
              <Switch
                accessibilityLabel="Haptics"
                ios_backgroundColor={colors.surfacePressed}
                onValueChange={setHapticsEnabled}
                thumbColor={hapticsEnabled ? colors.accent : colors.textTertiary}
                trackColor={{
                  false: colors.surfacePressed,
                  true: 'rgba(214, 208, 195, 0.32)',
                }}
                value={hapticsEnabled}
              />
            }
            title="Haptics"
          />
          <Divider inset />
          <ListItem
            description="The full processing, retention, and deletion model."
            leftIcon="shield-checkmark-outline"
            onPress={() => router.push(ROUTES.privacy)}
            showChevron
            title="Privacy principles"
          />
          <Divider inset />
          <ListItem
            description={
              consent === null
                ? 'No agreement recorded on this device.'
                : `Version ${consent.version} · accepted ${formatShortDate(consent.acceptedAt)}`
            }
            leftIcon="document-text-outline"
            onPress={() => router.push(ROUTES.privacy)}
            showChevron
            title="Consent agreement"
          />
        </Card>
      </FadeIn>

      <FadeIn delay={150} style={styles.section}>
        <SectionHeader
          subtitle="Deletion is immediate and local."
          title="Data"
        />
        <Card padded={false}>
          <ListItem
            description="Resets consent, onboarding, and preferences on this device."
            leftIcon="trash-outline"
            onPress={confirmDelete}
            title="Delete local data"
            tone="danger"
          />
        </Card>
      </FadeIn>

      <FadeIn delay={210} style={styles.section}>
        <SectionHeader title="About" />
        <Card padded={false}>
          <ListItem
            description={APP.tagline}
            leftIcon="information-circle-outline"
            right={<Badge label="Research preview" tone="outline" />}
            title={`VYRO ${APP.version}`}
          />
          <Divider inset />
          <ListItem
            description="Not installed in this build."
            leftIcon="scan-outline"
            right={<Badge label="Off" tone="outline" />}
            title="Analysis engine"
          />
          <Divider inset />
          <ListItem
            description={
              isAIConfigured
                ? 'A backend proxy URL is configured.'
                : 'No backend proxy is configured.'
            }
            leftIcon="sparkles-outline"
            right={
              <Badge
                label={isAIConfigured ? 'Configured' : 'Off'}
                tone={isAIConfigured ? 'success' : 'outline'}
              />
            }
            title="AI explanations"
          />
          <Divider inset />
          <ListItem
            description={
              isSupabaseConfigured
                ? 'A Supabase client is available for future features.'
                : 'Local only. No cloud sync is configured.'
            }
            leftIcon="cloud-offline-outline"
            right={
              <Badge
                label={isSupabaseConfigured ? 'Configured' : 'Off'}
                tone={isSupabaseConfigured ? 'success' : 'outline'}
              />
            }
            title="Cloud sync"
          />
        </Card>
      </FadeIn>

      <FadeIn delay={270} style={styles.section}>
        <Note title="Research preview" tone="warning">
          {RESEARCH_DISCLAIMER}
        </Note>
      </FadeIn>

      <Text align="center" style={styles.disclaimer} tone="tertiary" variant="caption">
        Built for adults 18+. Not a medical device.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  identityCard: {
    padding: theme.spacing.lg,
  },
  identityRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  identityCopy: {
    flex: 1,
    marginLeft: theme.spacing.lg,
  },
  identityBody: {
    marginTop: theme.spacing.xs,
  },
  badges: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  section: {
    marginTop: theme.spacing['3xl'],
  },
  disclaimer: {
    marginTop: theme.spacing['3xl'],
    paddingHorizontal: theme.spacing.lg,
  },
});
