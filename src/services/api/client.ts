import { AppError, ConfigurationError, isHttpUrl, normalizeError } from '@/utils';

export interface ApiClientOptions {
  readonly baseUrl: string;
  readonly timeoutMs?: number;
  readonly fetchImpl?: typeof fetch;
}

const DEFAULT_TIMEOUT_MS = 20_000;

export class ApiClient {
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;

  constructor(options: ApiClientOptions) {
    if (!isHttpUrl(options.baseUrl)) {
      throw new ConfigurationError('API client', {
        context: { reason: 'invalid_base_url' },
      });
    }

    this.baseUrl = options.baseUrl.replace(/\/+$/, '');
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  async post<TResponse>(path: string, body: unknown): Promise<TResponse> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      const text = await response.text();

      if (!response.ok) {
        throw new AppError('network', `Request failed with status ${response.status}.`, {
          userMessage: 'The service is unavailable right now. Please try again.',
          context: { status: response.status },
        });
      }

      if (!text) {
        throw new AppError('network', 'The service returned an empty response.');
      }

      try {
        return JSON.parse(text) as TResponse;
      } catch (error) {
        throw new AppError('network', 'The service returned invalid JSON.', {
          originalError: error,
        });
      }
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      if (error instanceof Error && error.name === 'AbortError') {
        throw new AppError('network', 'The request timed out.', {
          userMessage: 'The request took too long. Please try again.',
          originalError: error,
        });
      }

      throw normalizeError(error);
    } finally {
      clearTimeout(timeout);
    }
  }
}
