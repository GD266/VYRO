import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { BrandMark, Button, Screen, Text } from '@/components/ui';
import { ROUTES } from '@/constants';
import { theme } from '@/theme';

export default function NotFoundScreen() {
  return (
    <Screen scroll={false}>
      <View style={styles.container}>
        <BrandMark showWordmark size={64} />
        <Text align="center" style={styles.title} variant="heading">
          This screen does not exist.
        </Text>
        <Text align="center" style={styles.body} tone="secondary" variant="bodySmall">
          The link may be outdated, or the route may not be part of this build.
        </Text>
        <Button
          label="Return home"
          onPress={() => router.replace(ROUTES.home)}
          style={styles.action}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: theme.spacing['4xl'],
  },
  title: {
    marginTop: theme.spacing['2xl'],
  },
  body: {
    marginTop: theme.spacing.md,
    maxWidth: 300,
  },
  action: {
    marginTop: theme.spacing['2xl'],
    minWidth: 160,
  },
});
