/**
 * Retry utility with exponential backoff
 */

export interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxAttempts?: number;
  /** Initial delay in milliseconds (default: 1000) */
  initialDelayMs?: number;
  /** Maximum delay in milliseconds (default: 30000) */
  maxDelayMs?: number;
  /** Exponential backoff multiplier (default: 2) */
  backoffMultiplier?: number;
  /** Jitter factor (0-1) to add randomness to delays (default: 0.1) */
  jitter?: number;
  /** Function to determine if an error should be retried (default: retries all errors) */
  shouldRetry?: (error: any, attempt: number) => boolean;
  /** Function called before each retry attempt */
  onRetry?: (error: any, attempt: number, delayMs: number) => void;
}

export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: any;
  attempts: number;
}

/**
 * Sleep for specified milliseconds
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate delay with exponential backoff and jitter
 */
function calculateDelay(attempt: number, options: Required<Pick<RetryOptions, 'initialDelayMs' | 'maxDelayMs' | 'backoffMultiplier' | 'jitter'>>): number {
  const exponentialDelay = options.initialDelayMs * Math.pow(options.backoffMultiplier, attempt);
  const clampedDelay = Math.min(exponentialDelay, options.maxDelayMs);
  
  // Add jitter to prevent thundering herd problem
  const jitterAmount = clampedDelay * options.jitter * Math.random();
  const finalDelay = clampedDelay + jitterAmount;
  
  return Math.round(finalDelay);
}

/**
 * Determine if an error is retryable by default
 */
function isRetryableError(error: any): boolean {
  if (!error) return false;
  
  // Network errors are retryable
  if (error.code === 'network-request-failed' || 
      error.code === 'unavailable' ||
      error.code === 'deadline-exceeded' ||
      error.code === 'aborted') {
    return true;
  }
  
  // 5xx server errors are retryable
  if (error.status >= 500 && error.status < 600) {
    return true;
  }
  
  // Connection errors
  if (error.message?.toLowerCase().includes('network') ||
      error.message?.toLowerCase().includes('connection') ||
      error.message?.toLowerCase().includes('timeout')) {
    return true;
  }
  
  // Firestore unavailable errors
  if (error.code === 'unavailable' || error.code === 'internal') {
    return true;
  }
  
  // Don't retry authentication errors or client errors (4xx except 429)
  if (error.code?.startsWith('auth/') && error.code !== 'auth/network-request-failed') {
    return false;
  }
  
  if (error.status >= 400 && error.status < 500 && error.status !== 429) {
    return false;
  }
  
  // Retry rate limiting (429)
  if (error.status === 429 || error.code === 'resource-exhausted') {
    return true;
  }
  
  return false;
}

/**
 * Retry a function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<RetryResult<T>> {
  const {
    maxAttempts = 3,
    initialDelayMs = 1000,
    maxDelayMs = 30000,
    backoffMultiplier = 2,
    jitter = 0.1,
    shouldRetry = isRetryableError,
    onRetry
  } = options;

  let lastError: any;
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;
    
    try {
      const result = await fn();
      return {
        success: true,
        data: result,
        attempts
      };
    } catch (error: any) {
      lastError = error;
      
      // Don't retry if we've reached max attempts
      if (attempts >= maxAttempts) {
        break;
      }
      
      // Check if error should be retried
      if (!shouldRetry(error, attempts)) {
        break;
      }
      
      // Calculate delay and wait before retrying
      const delay = calculateDelay(attempts - 1, {
        initialDelayMs,
        maxDelayMs,
        backoffMultiplier,
        jitter
      });
      
      if (onRetry) {
        onRetry(error, attempts, delay);
      }
      
      await sleep(delay);
    }
  }

  return {
    success: false,
    error: lastError,
    attempts
  };
}

/**
 * Retry decorator for async functions
 */
export function retryable<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options?: RetryOptions
): T {
  return ((...args: any[]) => {
    return withRetry(() => fn(...args), options);
  }) as T;
}

