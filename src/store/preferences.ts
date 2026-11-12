import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { APP, STORAGE_KEYS } from '@/constants';
import type { ConsentRecord } from '@/types';
import { hasCurrentConsent, logger } from '@/utils';

interface PreferencesState {
  /** True once persisted preferences have been read or hydration failed. */
  readonly hydrated: boolean;
  readonly hasCompletedOnboarding: boolean;
  readonly consent: ConsentRecord | null;
  readonly hapticsEnabled: boolean;
  completeOnboarding: (consent: ConsentRecord) => void;
  setHapticsEnabled: (enabled: boolean) => void;
  resetLocalData: () => void;
  setHydrated: (hydrated: boolean) => void;
}

const INITIAL_STATE = {
  hydrated: false,
  hasCompletedOnboarding: false,
  consent: null,
  hapticsEnabled: true,
} as const;

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      completeOnboarding: (consent) => {
        set({ hasCompletedOnboarding: true, consent });
      },
      setHapticsEnabled: (hapticsEnabled) => {
        set({ hapticsEnabled });
      },
      resetLocalData: () => {
        set({ ...INITIAL_STATE, hydrated: true });
        void usePreferencesStore.persist.clearStorage();
      },
      setHydrated: (hydrated) => {
        set({ hydrated });
      },
    }),
    {
      name: STORAGE_KEYS.preferences,
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        consent: state.consent,
        hapticsEnabled: state.hapticsEnabled,
      }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          logger.warn('Could not restore local preferences.', {
            reason: error instanceof Error ? error.message : 'unknown',
          });
        }
        usePreferencesStore.setState({ hydrated: true });
      },
    },
  ),
);

export function selectHasCurrentConsent(state: PreferencesState): boolean {
  return (
    state.hasCompletedOnboarding &&
    hasCurrentConsent(state.consent, APP.consentVersion)
  );
}
