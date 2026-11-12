import { ApiClient } from '@/services';
import { AppError } from '@/utils';

import { buildExplanationPrompt } from '../prompts';
import { validateAIExplanation } from '../validation';
import {
  AI_EXPLANATION_SCHEMA_VERSION,
  type AIExplanation,
  type AIExplanationRequest,
  type AIProvider,
} from '../types';

export interface RemoteAIProviderOptions {
  readonly endpoint: string;
  readonly timeoutMs?: number;
  readonly fetchImpl?: typeof fetch;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Calls a backend proxy. The proxy owns provider credentials, request logging
 * policy, and provider-specific schema translation. The mobile app sends only
 * derived measurements, never images or raw landmarks.
 */
export class RemoteAIProvider implements AIProvider {
  readonly id = 'remote-proxy';
  readonly model = 'configured-by-proxy';

  private readonly client: ApiClient;

  constructor(options: RemoteAIProviderOptions) {
    this.client = new ApiClient({
      baseUrl: options.endpoint,
      timeoutMs: options.timeoutMs,
      fetchImpl: options.fetchImpl,
    });
  }

  async explain(request: AIExplanationRequest): Promise<AIExplanation> {
    const prompt = buildExplanationPrompt(request.report);

    const response = await this.client.post<unknown>('', {
      schemaVersion: AI_EXPLANATION_SCHEMA_VERSION,
      system: prompt.system,
      user: prompt.user,
    });

    const candidate =
      isRecord(response) && 'explanation' in response ? response.explanation : response;

    const validation = validateAIExplanation(candidate, request.report);
    if (!validation.valid) {
      throw new AppError('ai', 'The AI explanation failed validation.', {
        userMessage: 'The explanation could not be verified. No result was shown.',
        context: {
          issueCodes: validation.issues.map((issue) => issue.code),
        },
      });
    }

    return candidate as AIExplanation;
  }
}
