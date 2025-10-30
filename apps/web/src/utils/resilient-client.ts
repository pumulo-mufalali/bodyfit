/**
 * Resilient client utilities combining retry and circuit breaker patterns
 */

import { withRetry, RetryOptions } from './retry';
import { CircuitBreaker, CircuitBreakerOptions, circuitBreakerManager } from './circuit-breaker';

export interface ResilientClientOptions {
  /** Service name for circuit breaker identification */
  serviceName: string;
  /** Retry options */
  retry?: RetryOptions;
  /** Circuit breaker options */
  circuitBreaker?: CircuitBreakerOptions;
}

/**
 * Execute a function with both retry and circuit breaker protection
 */
export async function withResilience<T>(
  fn: () => Promise<T>,
  options: ResilientClientOptions
): Promise<T> {
  const { serviceName, retry = {}, circuitBreaker = {} } = options;
  
  // Get or create circuit breaker for this service
  const breaker = circuitBreakerManager.getBreaker(serviceName, circuitBreaker);
  
  // Combine retry with circuit breaker
  const retryOptions: RetryOptions = {
    ...retry,
    shouldRetry: (error, attempt) => {
      // Don't retry if circuit breaker is open
      if (error instanceof Error && error.name === 'CircuitBreakerOpenError') {
        return false;
      }
      // Use custom retry logic if provided, otherwise use default
      return retry.shouldRetry ? retry.shouldRetry(error, attempt) : true;
    }
  };
  
  // Execute through circuit breaker first, then apply retry
  return withRetry(
    () => breaker.execute(fn),
    retryOptions
  ).then(result => {
    if (!result.success) {
      throw result.error;
    }
    return result.data!;
  });
}

/**
 * Create a resilient wrapper for async functions
 */
export function createResilientClient<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: ResilientClientOptions
): T {
  return ((...args: any[]) => {
    return withResilience(() => fn(...args), options);
  }) as T;
}

