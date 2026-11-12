import { Redirect } from 'expo-router';

import { ROUTES } from '@/constants';
import { useHasCurrentConsent } from '@/hooks';
import { usePreferencesStore } from '@/store';

export default function IndexRoute() {
  const hydrated = usePreferencesStore((state) => state.hydrated);
  const hasConsent = useHasCurrentConsent();

  if (!hydrated) {
    return null;
  }

  return <Redirect href={hasConsent ? ROUTES.home : ROUTES.welcome} />;
}
