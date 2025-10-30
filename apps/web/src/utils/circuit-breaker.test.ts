import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CircuitBreaker, CircuitBreakerOpenError, circuitBreakerManager } from './circuit-breaker';

describe('CircuitBreaker', () => {
  let breaker: CircuitBreaker;

  beforeEach(() => {
    vi.useFakeTimers();
    breaker = new CircuitBreaker({
      failureThreshold: 3,
      resetTimeoutMs: 1000,
      successThreshold: 2,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('execute', () => {
    it('should execute successful function', async () => {
      const fn = vi.fn().mockResolvedValue('success');
      
      const result = await breaker.execute(fn);
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
      expect(breaker.getStats().state).toBe('closed');
    });

    it('should record failures and open circuit after threshold', async () => {
      const error = new Error('Service unavailable');
      const fn = vi.fn().mockRejectedValue(error);
      
      // Trigger failures up to threshold
      for (let i = 0; i < 3; i++) {
        try {
          await breaker.execute(fn);
        } catch (e) {
          // Expected
        }
      }
      
      const stats = breaker.getStats();
      expect(stats.failures).toBe(3);
      expect(stats.state).toBe('open');
      
      // Next call should immediately fail with CircuitBreakerOpenError
      await expect(breaker.execute(fn)).rejects.toThrow(CircuitBreakerOpenError);
    });

    it('should transition to half-open after reset timeout', async () => {
      const error = new Error('Service unavailable');
      const fn = vi.fn().mockRejectedValue(error);
      
      // Open circuit
      for (let i = 0; i < 3; i++) {
        try {
          await breaker.execute(fn);
        } catch (e) {
          // Expected
        }
      }
      
      expect(breaker.getStats().state).toBe('open');
      
      // Fast-forward past reset timeout
      vi.advanceTimersByTime(1000);
      
      // Try to execute - should be in half-open state
      const halfOpenFn = vi.fn().mockResolvedValue('success');
      const result = await breaker.execute(halfOpenFn);
      
      expect(result).toBe('success');
      expect(breaker.getStats().state).toBe('half-open');
    });

    it('should close circuit from half-open after success threshold', async () => {
      const error = new Error('Service unavailable');
      const fn = vi.fn().mockRejectedValue(error);
      
      // Open circuit
      for (let i = 0; i < 3; i++) {
        try {
          await breaker.execute(fn);
        } catch (e) {
          // Expected
        }
      }
      
      // Fast-forward past reset timeout
      vi.advanceTimersByTime(1000);
      
      // Successfully execute twice (successThreshold)
      const successFn = vi.fn().mockResolvedValue('success');
      await breaker.execute(successFn);
      await breaker.execute(successFn);
      
      expect(breaker.getStats().state).toBe('closed');
      expect(breaker.getStats().failures).toBe(0);
    });

    it('should open circuit from half-open on failure', async () => {
      const error = new Error('Service unavailable');
      const fn = vi.fn().mockRejectedValue(error);
      
      // Open circuit
      for (let i = 0; i < 3; i++) {
        try {
          await breaker.execute(fn);
        } catch (e) {
          // Expected
        }
      }
      
      // Fast-forward past reset timeout
      vi.advanceTimersByTime(1000);
      
      // Fail in half-open state
      try {
        await breaker.execute(fn);
      } catch (e) {
        // Expected
      }
      
      expect(breaker.getStats().state).toBe('open');
    });

    it('should call callbacks on state changes', async () => {
      const onOpen = vi.fn();
      const onClose = vi.fn();
      const onHalfOpen = vi.fn();
      
      const testBreaker = new CircuitBreaker({
        failureThreshold: 2,
        resetTimeoutMs: 1000,
        onOpen,
        onClose,
        onHalfOpen,
      });
      
      const error = new Error('Service unavailable');
      const fn = vi.fn().mockRejectedValue(error);
      
      // Open circuit
      for (let i = 0; i < 2; i++) {
        try {
          await testBreaker.execute(fn);
        } catch (e) {
          // Expected
        }
      }
      
      expect(onOpen).toHaveBeenCalledTimes(1);
      
      // Fast-forward to half-open
      vi.advanceTimersByTime(1000);
      
      const successFn = vi.fn().mockResolvedValue('success');
      await testBreaker.execute(successFn);
      
      expect(onHalfOpen).toHaveBeenCalledTimes(1);
      
      // Close circuit
      await testBreaker.execute(successFn);
      
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('should reset circuit breaker', () => {
      breaker['failures'] = 5;
      breaker['state'] = 'open';
      
      breaker.reset();
      
      const stats = breaker.getStats();
      expect(stats.state).toBe('closed');
      expect(stats.failures).toBe(0);
      expect(stats.successes).toBe(0);
    });

    it('should manually open circuit', () => {
      breaker.open();
      
      const stats = breaker.getStats();
      expect(stats.state).toBe('open');
    });
  });

  describe('CircuitBreakerManager', () => {
    it('should create and reuse circuit breakers', () => {
      const breaker1 = circuitBreakerManager.getBreaker('service1');
      const breaker2 = circuitBreakerManager.getBreaker('service1');
      
      expect(breaker1).toBe(breaker2);
    });

    it('should create separate breakers for different services', () => {
      const breaker1 = circuitBreakerManager.getBreaker('service1');
      const breaker2 = circuitBreakerManager.getBreaker('service2');
      
      expect(breaker1).not.toBe(breaker2);
    });

    it('should get all stats', () => {
      circuitBreakerManager.getBreaker('service1');
      circuitBreakerManager.getBreaker('service2');
      
      const stats = circuitBreakerManager.getAllStats();
      
      expect(stats).toHaveProperty('service1');
      expect(stats).toHaveProperty('service2');
    });

    it('should reset all breakers', () => {
      const breaker1 = circuitBreakerManager.getBreaker('service1');
      breaker1['failures'] = 5;
      breaker1['state'] = 'open';
      
      circuitBreakerManager.resetAll();
      
      expect(breaker1.getStats().state).toBe('closed');
      expect(breaker1.getStats().failures).toBe(0);
    });
  });
});

