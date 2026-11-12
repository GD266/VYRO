type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
  debug(message: string, context?: Readonly<Record<string, unknown>>): void;
  info(message: string, context?: Readonly<Record<string, unknown>>): void;
  warn(message: string, context?: Readonly<Record<string, unknown>>): void;
  error(message: string, context?: Readonly<Record<string, unknown>>): void;
}

function shouldLog(level: LogLevel): boolean {
  return __DEV__ || level === 'error';
}

function write(
  level: LogLevel,
  scope: string,
  message: string,
  context?: Readonly<Record<string, unknown>>,
): void {
  if (!shouldLog(level)) {
    return;
  }

  const prefix = `[${scope}]`;
  if (context === undefined) {
    console[level](prefix, message);
    return;
  }
  console[level](prefix, message, context);
}

/**
 * Creates a scoped logger. Never pass facial images, raw landmarks, names,
 * email addresses, or other personal data in log context.
 */
export function createLogger(scope: string): Logger {
  return {
    debug: (message, context) => write('debug', scope, message, context),
    info: (message, context) => write('info', scope, message, context),
    warn: (message, context) => write('warn', scope, message, context),
    error: (message, context) => write('error', scope, message, context),
  };
}

export const logger = createLogger('vyro');
