import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import {
  Badge,
  Button,
  Card,
  Divider,
  FadeIn,
  Note,
  ProgressBar,
  Screen,
  ScreenHeader,
  SectionHeader,
  Text,
} from '@/components/ui';
import { PREPARATION_ITEMS, ROUTES } from '@/constants';
import { useHaptics } from '@/hooks';
import { theme } from '@/theme';
import { colors } from '@/theme/colors';

interface ChecklistRowProps {
  readonly title: string;
  readonly description: string;
  readonly checked: boolean;
  readonly onToggle: () => void;
}

function ChecklistRow({
  title,
  description,
  checked,
  onToggle,
}: ChecklistRowProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={onToggle}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? (
          <Ionicons color={colors.accentContrast} name="checkmark" size={15} />
        ) : null}
      </View>
      <View style={styles.rowCopy}>
        <Text tone="primary" variant="body">
          {title}
        </Text>
        <Text style={styles.rowDescription} tone="tertiary" variant="caption">
          {description}
        </Text>
      </View>
    </Pressable>
  );
}

export function ScanPreparationScreen() {
  const [checkedItems, setCheckedItems] = useState<ReadonlySet<string>>(
    () => new Set<string>(),
  );
  const triggerHaptic = useHaptics();

  const total = PREPARATION_ITEMS.length;
  const completed = checkedItems.size;
  const isReady = completed === total;

  const toggleItem = (id: string) => {
    triggerHaptic('light');
    setCheckedItems((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <Screen
      footer={
        <View>
          <Button
            disabled={!isReady}
            fullWidth
            label="Continue to capture"
            onPress={() => router.push(ROUTES.scanCapture)}
            size="lg"
          />
          <Text align="center" style={styles.footerNote} tone="tertiary" variant="caption">
            {isReady
              ? 'Checklist complete. Capture is still a preview in this build.'
              : 'Complete every item to continue.'}
          </Text>
        </View>
      }
    >
      <ScreenHeader subtitle="Step 01 of 02" title="Preparation" />

      <FadeIn>
        <Text tone="tertiary" variant="overline">
          Set up your capture
        </Text>
        <Text style={styles.title} variant="title">
          Remove avoidable noise.
        </Text>
        <Text style={styles.lead} tone="secondary" variant="body">
          A controlled capture is the difference between a measurement and a
          guess. Work through the checklist before the camera opens.
        </Text>
      </FadeIn>

      <FadeIn delay={90} style={styles.progress}>
        <ProgressBar
          caption={`${completed} of ${total}`}
          label="Checklist"
          value={total === 0 ? 0 : completed / total}
        />
      </FadeIn>

      <FadeIn delay={150} style={styles.section}>
        <SectionHeader
          action={<Badge label={isReady ? 'Ready' : 'Required'} tone={isReady ? 'success' : 'outline'} />}
          subtitle="Tap each item when it is true."
          title="Before you start"
        />
        <Card padded={false}>
          {PREPARATION_ITEMS.map((item, index) => (
            <View key={item.id}>
              {index === 0 ? null : <Divider inset />}
              <ChecklistRow
                checked={checkedItems.has(item.id)}
                description={item.description}
                onToggle={() => toggleItem(item.id)}
                title={item.title}
              />
            </View>
          ))}
        </Card>
      </FadeIn>

      <FadeIn delay={210} style={styles.section}>
        <Note icon="camera-outline" title="Walkthrough only" tone="info">
          This build does not request camera access or store images. The
          checklist exists so the capture flow and its quality contract can be
          reviewed end to end.
        </Note>
      </FadeIn>

      {completed > 0 ? (
        <Button
          label="Reset checklist"
          onPress={() => setCheckedItems(new Set<string>())}
          size="sm"
          style={styles.reset}
          variant="ghost"
        />
      ) : null}
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
  progress: {
    marginTop: theme.spacing['2xl'],
  },
  section: {
    marginTop: theme.spacing['3xl'],
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    padding: theme.spacing.lg,
  },
  rowPressed: {
    backgroundColor: colors.surfacePressed,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: theme.radii.xs,
    borderWidth: 1,
    height: 22,
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    marginTop: 1,
    width: 22,
  },
  checkboxChecked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  rowCopy: {
    flex: 1,
  },
  rowDescription: {
    marginTop: 2,
  },
  reset: {
    alignSelf: 'center',
    marginTop: theme.spacing.xl,
  },
  footerNote: {
    marginTop: theme.spacing.md,
  },
});
