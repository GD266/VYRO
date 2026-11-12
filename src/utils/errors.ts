export type AppErrorCode =
  | 'configuration'
  | 'network'
  | 'validation'
  | 'permission'
  | 'storage'
  | 'vision'
  | 'analysis'
  | 'ai'
  | 'unknown';

const USER_MESSAGES: Record<AppErrorCode, string> = {
  configuration: 'VYRO is not configured for this feature yet.',
  network: 'The connection was interrupted. Please try again.',
  validation: 'Some of the information provided is not valid.',
  permission: 'Permission is required to continue.',
  storage: 'VYRO could not access local storage.',
  vision: 'The image could not be prepared for analysis.',
  analysis: 'The analysis could not be completed.',
  ai: 'The explanation service is unavailable right now.',
  unknown: 'Something went wrong. Please try again.',
};

interface AppErrorOptions {
  readonly userMessage?: string;
  readonly originalError?: unknown;
  readonly context?: Readonly<Record<string, unknown>>;
}

/**
 * A typed application error. `context` must never contain facial images,
 * landmark payloads, names, email addresses, or other personal data.
 */
export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly userMessage: string;
  readonly originalError?: unknown;
  readonly context?: Readonly<Record<string, unknown>>;

  constructor(code: AppErrorCode, message: string, options: AppErrorOptions = {}) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.userMessage = options.userMessage ?? USER_MESSAGES[code];
    this.originalError = options.originalError;
    this.context = options.context;
  }
}

export class ConfigurationError extends AppError {
  constructor(feature: string, options: AppErrorOptions = {}) {
    super('configuration', `${feature} is not configured.`, options);
    this.name = 'ConfigurationError';
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function normalizeError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError('unknown', error.message, { originalError: error });
  }

  return new AppError('unknown', 'An unexpected error occurred.', {
    originalError: error,
  });
}

export function getUserMessage(error: unknown): string {
  return normalizeError(error).userMessage;
}
