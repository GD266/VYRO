import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';

import { usePreferencesStore } from '@/store';

export type HapticStyle = 'light' | 'medium' | 'success';

export function useHaptics(): (style?: HapticStyle) => void {
  const enabled = usePreferencesStore((state) => state.hapticsEnabled);

  return useCallback(
    (style: HapticStyle = 'light') => {
      if (!enabled) {
        return;
      }

      const action =
        style === 'success'
          ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
          : Haptics.impactAsync(
              style === 'medium'
                ? Haptics.ImpactFeedbackStyle.Medium
                : Haptics.ImpactFeedbackStyle.Light,
            );

      void action.catch(() => {
        // Haptics are decorative. A device without a taptic engine is fine.
      });
    },
    [enabled],
  );
}
