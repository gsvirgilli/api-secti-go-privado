/**
 * Tipo utilitário para garantir type safety em tratamento de erros
 * Nunca use `any` ou `unknown` sem este tipo
 */

export function assertError(value: unknown): asserts value is Error {
  if (!(value instanceof Error)) {
    throw new TypeError(`Expected an Error, got ${typeof value}`);
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as any).message);
  }
  return 'An unknown error occurred';
}

export function getErrorCode(error: unknown): string | undefined {
  if (error instanceof Error && 'code' in error) {
    return (error as any).code;
  }
  return undefined;
}

export function getErrorStack(error: unknown): string | undefined {
  if (error instanceof Error) {
    return error.stack;
  }
  return undefined;
}

/**
 * Tipo seguro para parsing de JSON
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Tipo seguro para acesso a properties dinamicamente
 */
export function getProperty<T, K extends PropertyKey>(
  obj: T,
  key: K,
  fallback?: unknown
): unknown {
  if (obj && typeof obj === 'object' && key in obj) {
    return (obj as Record<K, unknown>)[key];
  }
  return fallback;
}
