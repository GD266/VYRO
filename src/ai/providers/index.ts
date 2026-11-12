import { env } from '@/constants';

import type { AIProvider } from '../types';
import { RemoteAIProvider } from './remote';

export { RemoteAIProvider } from './remote';
export type { RemoteAIProviderOptions } from './remote';

/**
 * Returns null until a backend proxy URL is configured. There is no bundled
 * provider key and no silent fallback to a fake explanation.
 */
export function createAIProvider(): AIProvider | null {
  if (env.aiProxyUrl === undefined) {
    return null;
  }
  return new RemoteAIProvider({ endpoint: env.aiProxyUrl });
}
