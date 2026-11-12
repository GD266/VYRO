import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  Button,
  Card,
  FadeIn,
  Note,
  Screen,
  ScreenHeader,
  Text,
} from '@/components/ui';
import { RESEARCH_DISCLAIMER, ROUTES } from '@/constants';
import { theme } from '@/theme';
import { colors } from '@/theme/colors';

interface PrivacySectionProps {
  readonly title: string;
  readonly children: ReactNode;
}

function PrivacySection({ title, children }: PrivacySectionProps) {
  return (
    <View style={styles.section}>
      <Text variant="subheading">{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

interface BulletListProps {
  readonly items: readonly string[];
  readonly tone?: 'check' | 'deny';
}

function BulletList({ items, tone = 'check' }: BulletListProps) {
  const icon = tone === 'check' ? 'checkmark-circle-outline' : 'close-circle-outline';
  const color = tone === 'check' ? colors.success : colors.danger;

  return (
    <View>
      {items.map((item) => (
        <View key={item} style={styles.bulletRow}>
          <Ionicons color={color} name={icon} size={16} />
          <Text style={styles.bulletLabel} tone="secondary" variant="bodySmall">
            {item}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function PrivacyScreen() {
  return (
    <Screen
      footer={
        <Button
          fullWidth
          label="Open profile settings"
          onPress={() => router.navigate(ROUTES.profile)}
          size="lg"
        />
      }
    >
      <ScreenHeader title="Privacy" />

      <FadeIn>
        <Text tone="tertiary" variant="overline">
          Privacy and security
        </Text>
        <Text style={styles.title} variant="title">
          Privacy, in plain language.
        </Text>
        <Text style={styles.lead} tone="secondary" variant="body">
          A face is sensitive data. VYRO is designed around minimization:
          process locally, retain only what is necessary, and never turn a face
          into an identity or a public score.
        </Text>
      </FadeIn>

      <FadeIn delay={90}>
        <Note style={styles.topNote} title="This build collects no images" tone="info">
          VYRO does not request camera or photo-library access, does not upload
          facial data, and does not create a remote profile.
        </Note>
      </FadeIn>

      <FadeIn delay={150}>
        <PrivacySection title="What this build does">
          <BulletList
            items={[
              'Stores a consent record and app preferences on this device.',
              'Keeps the app fully usable without a cloud account.',
              'Ships typed contracts for quality, measurement, and AI validation.',
              'Requests no camera, photo, location, or contact permission.',
            ]}
          />
        </PrivacySection>

        <PrivacySection title="Designed processing boundary">
          <Text tone="secondary" variant="bodySmall">
            When capture ships, images and landmarks are intended to stay
            on-device. If AI explanations are enabled later, only derived
            measurements will be sent to a backend proxy. Provider credentials
            stay on the server and are never embedded in the app.
          </Text>
        </PrivacySection>

        <PrivacySection title="What VYRO will not do">
          <BulletList
            items={[
              'Recognize or verify identity.',
              'Publish attractiveness scores or public leaderboards.',
              'Infer genetics, ethnicity, age, health, or medical conditions.',
              'Sell, rent, or trade facial data.',
            ]}
            tone="deny"
          />
        </PrivacySection>

        <PrivacySection title="Retention and deletion">
          <Text style={styles.paragraph} tone="secondary" variant="bodySmall">
            Captured images are designed to be ephemeral by default. A future
            feature may let you explicitly save a scan; that choice must be
            opt-in and reversible. Deleting local data removes your consent
            record, onboarding state, and preferences immediately.
          </Text>
          <Text style={styles.paragraph} tone="secondary" variant="bodySmall">
            This build has no cloud sync. If sync is added, retention rules and
            a deletion path will be documented before it is enabled.
          </Text>
        </PrivacySection>

        <PrivacySection title="Consent and withdrawal">
          <Text tone="secondary" variant="bodySmall">
            Processing requires explicit consent before the first capture. You
            can withdraw by deleting your local data in Profile. Withdrawal
            resets the agreement and stops any future processing on this device.
          </Text>
        </PrivacySection>

        <PrivacySection title="Adults only">
          <Text tone="secondary" variant="bodySmall">
            VYRO is designed for adults 18 and older. It is not intended for
            minors, schools, or any setting where consent cannot be freely given.
          </Text>
        </PrivacySection>

        <PrivacySection title="Contact">
          <Text tone="secondary" variant="bodySmall">
            A privacy contact will be published before any public release. Until
            then, do not submit facial images to VYRO.
          </Text>
        </PrivacySection>
      </FadeIn>

      <Card style={styles.summary} tone="muted">
        <Text variant="label" tone="secondary">
          Current posture
        </Text>
        <View style={styles.summaryRow}>
          <BadgeLine label="On-device by design" />
          <BadgeLine label="No identity recognition" />
          <BadgeLine label="No public rankings" />
          <BadgeLine label="Deletion available now" />
        </View>
      </Card>

      <Text align="center" style={styles.disclaimer} tone="tertiary" variant="caption">
        {RESEARCH_DISCLAIMER}
      </Text>
    </Screen>
  );
}

function BadgeLine({ label }: { readonly label: string }) {
  return (
    <View style={styles.summaryLine}>
      <Ionicons color={colors.success} name="checkmark" size={14} />
      <Text style={styles.summaryLabel} tone="secondary" variant="caption">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginTop: theme.spacing.md,
  },
  lead: {
    marginTop: theme.spacing.md,
  },
  topNote: {
    marginTop: theme.spacing['2xl'],
  },
  section: {
    marginTop: theme.spacing['3xl'],
  },
  sectionBody: {
    marginTop: theme.spacing.md,
  },
  bulletRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  bulletLabel: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  paragraph: {
    marginBottom: theme.spacing.md,
  },
  summary: {
    marginTop: theme.spacing['3xl'],
  },
  summaryRow: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  summaryLine: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  summaryLabel: {
    marginLeft: theme.spacing.sm,
  },
  disclaimer: {
    marginTop: theme.spacing['3xl'],
    paddingHorizontal: theme.spacing.lg,
  },
});
