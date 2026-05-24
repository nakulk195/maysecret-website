export const DEFAULT_REQUEST_TIMEOUT_MS = 10000;

export const getErrorMessage = (error: unknown, fallback = 'Something went wrong. Please try again.') => {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string' && error.trim()) return error;
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) return message;
  }
  return fallback;
};

export const withTimeout = async <T>(
  promise: PromiseLike<T>,
  timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS,
  timeoutMessage = 'Request is taking too long. Please try again.'
): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
  });

  try {
    return await Promise.race([Promise.resolve(promise), timeoutPromise]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
};
