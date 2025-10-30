/**
 * Circuit Breaker pattern implementation
 * Prevents cascading failures by stopping requests when a service is failing
 */

export type CircuitState = 'closed' | 'open' | 'half-open';

export interface CircuitBreakerOptions {
  /** Failure threshold before opening circuit (default: 5) */
  failureThreshold?: number;
  /** Time in ms to wait before attempting to close circuit (default: 60000) */
  resetTimeoutMs?: number;
  /** Success threshold to close circuit from half-open (default: 2) */
  successThreshold?: number;
  /** Optional callback when circuit opens */
  onOpen?: (error: any) => void;
  /** Optional callback when circuit closes */
  onClose?: () => void;
  /** Optional callback when circuit goes to half-open */
  onHalfOpen?: () => void;
}

export interface CircuitBreakerStats {
  failures: number;
  successes: number;
  state: CircuitState;
  lastFailureTime?: number;
  lastSuccessTime?: number;
}

/**
 * Circuit Breaker class
 */
export class CircuitBreaker {
  private failures = 0;
  private successes = 0;
  private state: CircuitState = 'closed';
  private lastFailureTime?: number;
  private lastSuccessTime?: number;
  
  private readonly failureThreshold: number;
  private readonly resetTimeoutMs: number;
  private readonly successThreshold: number;
  private readonly onOpen?: (error: any) => void;
  private readonly onClose?: () => void;
  private readonly onHalfOpen?: () => void;
  
  constructor(options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold ?? 5;
    this.resetTimeoutMs = options.resetTimeoutMs ?? 60000;
    this.successThreshold = options.successThreshold ?? 2;
    this.onOpen = options.onOpen;
    this.onClose = options.onClose;
    this.onHalfOpen = options.onHalfOpen;
  }

  /**
   * Check if circuit is open and should reject request
   */
  private checkState(): void {
    if (this.state === 'open') {
      // Check if reset timeout has passed
      if (this.lastFailureTime && Date.now() - this.lastFailureTime >= this.resetTimeoutMs) {
        this.state = 'half-open';
        this.successes = 0;
        if (this.onHalfOpen) {
          this.onHalfOpen();
        }
      } else {
        throw new CircuitBreakerOpenError('Circuit breaker is open. Service unavailable.');
      }
    }
  }

  /**
   * Record a successful operation
   */
  private recordSuccess(): void {
    this.lastSuccessTime = Date.now();
    
    if (this.state === 'half-open') {
      this.successes++;
      if (this.successes >= this.successThreshold) {
        this.state = 'closed';
        this.failures = 0;
        this.successes = 0;
        if (this.onClose) {
          this.onClose();
        }
      }
    } else if (this.state === 'closed') {
      // Reset failure count on success
      this.failures = 0;
    }
  }

  /**
   * Record a failed operation
   */
  private recordFailure(error: any): void {
    this.lastFailureTime = Date.now();
    this.failures++;
    
    if (this.state === 'half-open') {
      // Any failure in half-open state opens the circuit
      this.state = 'open';
      this.successes = 0;
      if (this.onOpen) {
        this.onOpen(error);
      }
    } else if (this.state === 'closed' && this.failures >= this.failureThreshold) {
      this.state = 'open';
      if (this.onOpen) {
        this.onOpen(error);
      }
    }
  }

  /**
   * Execute a function through the circuit breaker
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    this.checkState();
    
    try {
      const result = await fn();
      this.recordSuccess();
      return result;
    } catch (error: any) {
      this.recordFailure(error);
      throw error;
    }
  }

  /**
   * Get current circuit breaker statistics
   */
  getStats(): CircuitBreakerStats {
    return {
      failures: this.failures,
      successes: this.successes,
      state: this.state,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime
    };
  }

  /**
   * Reset circuit breaker to closed state
   */
  reset(): void {
    this.state = 'closed';
    this.failures = 0;
    this.successes = 0;
    this.lastFailureTime = undefined;
    this.lastSuccessTime = undefined;
  }

  /**
   * Manually open the circuit
   */
  open(): void {
    this.state = 'open';
    this.lastFailureTime = Date.now();
    if (this.onOpen) {
      this.onOpen(new Error('Circuit manually opened'));
    }
  }
}

/**
 * Custom error for circuit breaker open state
 */
export class CircuitBreakerOpenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CircuitBreakerOpenError';
  }
}

/**
 * Create a circuit breaker instance
 */
export function createCircuitBreaker(options?: CircuitBreakerOptions): CircuitBreaker {
  return new CircuitBreaker(options);
}

/**
 * Circuit breaker manager for managing multiple services
 */
export class CircuitBreakerManager {
  private breakers = new Map<string, CircuitBreaker>();

  /**
   * Get or create a circuit breaker for a service
   */
  getBreaker(serviceName: string, options?: CircuitBreakerOptions): CircuitBreaker {
    if (!this.breakers.has(serviceName)) {
      this.breakers.set(serviceName, new CircuitBreaker(options));
    }
    return this.breakers.get(serviceName)!;
  }

  /**
   * Reset all circuit breakers
   */
  resetAll(): void {
    this.breakers.forEach(breaker => breaker.reset());
  }

  /**
   * Get stats for all circuit breakers
   */
  getAllStats(): Record<string, CircuitBreakerStats> {
    const stats: Record<string, CircuitBreakerStats> = {};
    this.breakers.forEach((breaker, name) => {
      stats[name] = breaker.getStats();
    });
    return stats;
  }
}

// Global circuit breaker manager instance
export const circuitBreakerManager = new CircuitBreakerManager();

