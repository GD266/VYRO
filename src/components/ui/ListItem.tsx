import Ionicons from '@expo/vector-icons/Ionicons';
import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { useHaptics } from '@/hooks';
import { theme } from '@/theme';
import { colors } from '@/theme/colors';

import type { IconName } from './IconButton';
import { Text } from './Text';

export type ListItemTone = 'default' | 'danger';

export interface ListItemProps {
  readonly title: string;
  readonly description?: string;
  readonly leftIcon?: IconName;
  readonly right?: ReactNode;
  readonly onPress?: () => void;
  readonly tone?: ListItemTone;
  readonly showChevron?: boolean;
  readonly accessibilityHint?: string;
  readonly style?: StyleProp<ViewStyle>;
  readonly testID?: string;
}

export function ListItem({
  title,
  description,
  leftIcon,
  right,
  onPress,
  tone = 'default',
  showChevron = false,
  accessibilityHint,
  style,
  testID,
}: ListItemProps) {
  const triggerHaptic = useHaptics();
  const isDanger = tone === 'danger';
  const content = (
    <>
      {leftIcon === undefined ? null : (
        <View style={[styles.icon, isDanger && styles.iconDanger]}>
          <Ionicons
            color={isDanger ? colors.danger : colors.textSecondary}
            name={leftIcon}
            size={18}
          />
        </View>
      )}

      <View style={styles.copy}>
        <Text variant="body" tone={isDanger ? 'danger' : 'primary'}>
          {title}
        </Text>
        {description === undefined ? null : (
          <Text variant="caption" tone="tertiary" style={styles.description}>
            {description}
          </Text>
        )}
      </View>

      {right === undefined ? null : <View style={styles.right}>{right}</View>}

      {showChevron ? (
        <Ionicons
          color={colors.textTertiary}
          name="chevron-forward"
          size={16}
          style={styles.chevron}
        />
      ) : null}
    </>
  );

  if (onPress === undefined) {
    return (
      <View style={[styles.container, style]} testID={testID}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={title}
      accessibilityRole="button"
      onPress={() => {
        triggerHaptic('light');
        onPress();
      }}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
        style,
      ]}
      testID={testID}
    >
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: theme.layout.minTouchTarget + theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  pressed: {
    backgroundColor: colors.surfacePressed,
  },
  icon: {
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.borderSubtle,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    height: 34,
    justifyContent: 'center',
    marginRight: theme.spacing.md,
    width: 34,
  },
  iconDanger: {
    backgroundColor: colors.dangerSurface,
    borderColor: 'rgba(212, 122, 114, 0.24)',
  },
  copy: {
    flex: 1,
  },
  description: {
    marginTop: 2,
  },
  right: {
    marginLeft: theme.spacing.md,
  },
  chevron: {
    marginLeft: theme.spacing.sm,
  },
});
