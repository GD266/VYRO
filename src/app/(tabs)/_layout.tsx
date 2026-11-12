import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ROUTES } from '@/constants';
import { useHasCurrentConsent } from '@/hooks';
import { usePreferencesStore } from '@/store';
import { colors } from '@/theme/colors';

export default function TabsLayout() {
  const hydrated = usePreferencesStore((state) => state.hydrated);
  const hasConsent = useHasCurrentConsent();

  if (!hydrated) {
    return null;
  }

  if (!hasConsent) {
    return <Redirect href={ROUTES.welcome} />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.accent,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              color={typeof color === 'string' ? color : colors.textTertiary}
              name={focused ? 'home' : 'home-outline'}
              size={size}
            />
          ),
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              color={typeof color === 'string' ? color : colors.textTertiary}
              name={focused ? 'scan' : 'scan-outline'}
              size={size}
            />
          ),
          title: 'Scan',
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              color={typeof color === 'string' ? color : colors.textTertiary}
              name={focused ? 'analytics' : 'analytics-outline'}
              size={size}
            />
          ),
          title: 'Insights',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused, size }) => (
            <Ionicons
              color={typeof color === 'string' ? color : colors.textTertiary}
              name={focused ? 'person' : 'person-outline'}
              size={size}
            />
          ),
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.backgroundElevated,
    borderTopColor: colors.hairline,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.4,
  },
});
