import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

import { env, isSupabaseConfigured } from '@/constants';
import { ConfigurationError, logger } from '@/utils';

let client: SupabaseClient | null = null;
let appStateListenerRegistered = false;

/**
 * Lazily creates the Supabase client. The app must launch and remain usable
 * without Supabase credentials; callers are expected to check
 * `isSupabaseConfigured` or handle the ConfigurationError.
 */
export function getSupabaseClient(): SupabaseClient {
  if (!isSupabaseConfigured || env.supabaseUrl === undefined || env.supabaseAnonKey === undefined) {
    throw new ConfigurationError('Supabase');
  }

  if (client !== null) {
    return client;
  }

  client = createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });

  if (!appStateListenerRegistered) {
    AppState.addEventListener('change', (state) => {
      if (client === null) {
        return;
      }
      if (state === 'active') {
        void client.auth.startAutoRefresh();
      } else {
        client.auth.stopAutoRefresh();
      }
    });
    appStateListenerRegistered = true;
  }

  logger.info('Supabase client initialized.');
  return client;
}

export function hasSupabaseClient(): boolean {
  return client !== null;
}
