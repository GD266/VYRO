import { selectHasCurrentConsent, usePreferencesStore } from '@/store';

export function useHasCurrentConsent(): boolean {
  return usePreferencesStore(selectHasCurrentConsent);
}
