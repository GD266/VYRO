import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Button,
  Card,
  FadeIn,
  Note,
  Screen,
  ScreenHeader,
  Text,
} from '@/components/ui';
import { APP, ROUTES } from '@/constants';
import { useHaptics, useHasCurrentConsent } from '@/hooks';
import { usePreferencesStore } from '@/store';
import { theme } from '@/theme';
import { colors } from '@/theme/colors';

interface ConsentCheckboxProps {
  readonly checked: boolean;
  readonly title: string;
  readonly description: string;
  readonly onToggle: () => void;
}

function ConsentCheckbox({
  checked,
  title,
  description,
  onToggle,
}: ConsentCheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onToggle}
      style={({ pressed }) => [
        styles.checkboxRow,
        pressed && styles.checkboxRowPressed,
      ]}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? (
          <Ionicons color={colors.accentContrast} name="checkmark" size={16} />
        ) : null}
      </View>
      <View style={styles.checkboxCopy}>
        <Text variant="body" tone="primary">
          {title}
        </Text>
        <Text variant="caption" tone="tertiary" style={styles.checkboxDescription}>
          {description}
        </Text>
      </View>
    </Pressable>
  );
}

export function ConsentScreen() {
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const hasConsent = useHasCurrentConsent();
  const completeOnboarding = usePreferencesStore((state) => state.completeOnboarding);
  const triggerHaptic = useHaptics();

  const canContinue = ageConfirmed && privacyAccepted;

  if (hasConsent) {
    return <Redirect href={ROUTES.home} />;
  }

  const handleAccept = () => {
    if (!canContinue) {
      return;
    }

    completeOnboarding({
      acceptedAt: new Date().toISOString(),
      ageConfirmed: true,
      version: APP.consentVersion,
    });
    triggerHaptic('success');
    router.replace(ROUTES.home);
  };

  return (
    <Screen
      footer={
        <View>
          <Button
            disabled={!canContinue}
            fullWidth
            label="Agree and continue"
            onPress={handleAccept}
            size="lg"
          />
          <Button
            fullWidth
            label="Not now"
            onPress={() => router.back()}
            size="sm"
            style={styles.decline}
            variant="ghost"
          />
        </View>
      }
    >
      <ScreenHeader title="Consent" />

      <FadeIn>
        <Text tone="tertiary" variant="overline">
          Before you begin
        </Text>
        <Text style={styles.title} variant="title">
          A clear agreement.
        </Text>
        <Text style={styles.lead} tone="secondary" variant="body">
          VYRO needs your explicit consent before it can process any facial
          image. Nothing is captured in this build; the agreement describes how
          the product is designed to work.
        </Text>
      </FadeIn>

      <FadeIn delay={100} style={styles.checkboxes}>
        <ConsentCheckbox
          checked={ageConfirmed}
          description="VYRO is designed for adults and is not intended for minors."
          onToggle={() => setAgeConfirmed((value) => !value)}
          title="I am 18 or older."
        />
        <ConsentCheckbox
          checked={privacyAccepted}
          description="When capture becomes available, images will be processed on-device to detect landmarks and compute geometric measurements."
          onToggle={() => setPrivacyAccepted((value) => !value)}
          title="I consent to facial image processing for measurement."
        />
      </FadeIn>

      <FadeIn delay={180} style={styles.notes}>
        <Note icon="cloud-offline-outline" title="What leaves your device" tone="info">
          Nothing in this build. If AI explanations are enabled later, only
          derived measurements will be sent to a backend proxy — never images
          or raw landmarks. Provider keys stay on the server.
        </Note>

        <Note title="Withdrawal and deletion" tone="neutral">
          You can withdraw consent at any time by deleting your local data in
          Profile. Deleting data resets this agreement. VYRO does not create a
          shadow profile.
        </Note>
      </FadeIn>

      <Card style={styles.summary} tone="muted">
        <Text variant="label" tone="secondary">
          Agreement version
        </Text>
        <Text style={styles.version} variant="body">
          {APP.consentVersion}
        </Text>
        <Text tone="tertiary" variant="caption">
          A record of this agreement is stored only on this device. It contains
          no facial data.
        </Text>
      </Card>
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
  checkboxes: {
    gap: theme.spacing.md,
    marginTop: theme.spacing['2xl'],
  },
  checkboxRow: {
    backgroundColor: colors.surface,
    borderColor: colors.borderSubtle,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    flexDirection: 'row',
    padding: theme.spacing.lg,
  },
  checkboxRowPressed: {
    backgroundColor: colors.surfacePressed,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: 1,
    height: 24,
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    marginTop: 1,
    width: 24,
  },
  checkboxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  checkboxCopy: {
    flex: 1,
  },
  checkboxDescription: {
    marginTop: theme.spacing.xs,
  },
  notes: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  summary: {
    marginTop: theme.spacing.xl,
  },
  version: {
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  decline: {
    marginTop: theme.spacing.sm,
  },
});
