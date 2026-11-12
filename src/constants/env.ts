import type { AppEnvironment } from '@/types';

function readPublicValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function readAppEnvironment(value: string | undefined): AppEnvironment {
  if (value === 'preview' || value === 'production') {
    return value;
  }
  return 'development';
}

/**
 * Public, build-time configuration.
 *
 * EXPO_PUBLIC_ values are inlined into the JavaScript bundle. They are not
 * secrets. Provider keys and service-role credentials must live on a backend.
 */
export const env = {
  appEnvironment: readAppEnvironment(process.env.EXPO_PUBLIC_APP_ENV),
  supabaseUrl: readPublicValue(process.env.EXPO_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: readPublicValue(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
  aiProxyUrl: readPublicValue(process.env.EXPO_PUBLIC_AI_PROXY_URL),
} as const;

export const isSupabaseConfigured =
  env.supabaseUrl !== undefined && env.supabaseAnonKey !== undefined;

export const isAIConfigured = env.aiProxyUrl !== undefined;
