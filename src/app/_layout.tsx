import { Stack, type ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { BrandMark, Button, Text } from '@/components/ui';
import { usePreferencesStore } from '@/store';
import { theme } from '@/theme';
import { getUserMessage, logger } from '@/utils';

void SplashScreen.preventAutoHideAsync().catch(() => {
  // The splash screen may already be hidden during a fast refresh.
});

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    logger.error('Unhandled route error.', { message: error.message });
  }, [error]);

  return (
    <View style={styles.errorRoot}>
      <BrandMark showWordmark size={64} />
      <Text align="center" style={styles.errorTitle} variant="heading">
        Something interrupted VYRO.
      </Text>
      <Text align="center" style={styles.errorBody} tone="secondary" variant="bodySmall">
        {getUserMessage(error)}
      </Text>
      <Button
        label="Try again"
        onPress={() => {
          void retry();
        }}
        style={styles.errorAction}
      />
    </View>
  );
}

export default function RootLayout() {
  const hydrated = usePreferencesStore((state) => state.hydrated);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    void SplashScreen.hideAsync().catch(() => {
      // Hiding is best-effort. A missing splash must not block the app.
    });
  }, [hydrated]);

  if (!hydrated) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          animation: 'fade',
          contentStyle: { backgroundColor: theme.colors.background },
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'none' }} />
        <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
        <Stack.Screen name="consent" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen
          name="scan/preparation"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="scan/capture"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="analysis"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="recommendations"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="progress"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="privacy"
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen name="+not-found" options={{ animation: 'fade' }} />
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  errorRoot: {
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing['2xl'],
  },
  errorTitle: {
    marginTop: theme.spacing['2xl'],
  },
  errorBody: {
    marginTop: theme.spacing.md,
    maxWidth: 340,
  },
  errorAction: {
    marginTop: theme.spacing['2xl'],
    minWidth: 160,
  },
});
