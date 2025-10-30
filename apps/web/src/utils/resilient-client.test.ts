import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { withResilience, createResilientClient } from './resilient-client';
import { CircuitBreakerOpenError } from './circuit-breaker';

describe('resilient-client', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('withResilience', () => {
    it('should execute function successfully', async () => {
      const fn = vi.fn().mockResolvedValue('success');
      
      const result = await withResilience(fn, {
        serviceName: 'test-service',
      });
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue('success');
      
      const promise = withResilience(fn, {
        serviceName: 'test-service',
        retry: {
          maxAttempts: 2,
        },
      });
      
      await vi.runAllTimersAsync();
      
      const result = await promise;
      
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should not retry CircuitBreakerOpenError', async () => {
      const error = new CircuitBreakerOpenError('Circuit is open');
      const fn = vi.fn().mockRejectedValue(error);
      
      const promise = withResilience(fn, {
        serviceName: 'test-service',
        retry: {
          maxAttempts: 3,
        },
      });
      
      await expect(promise).rejects.toThrow(CircuitBreakerOpenError);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should use custom retry logic', async () => {
      const error = new Error('Custom error');
      const fn = vi.fn().mockRejectedValue(error);
      const shouldRetry = vi.fn().mockReturnValue(false);
      
      const promise = withResilience(fn, {
        serviceName: 'test-service',
        retry: {
          maxAttempts: 3,
          shouldRetry,
        },
      });
      
      await expect(promise).rejects.toThrow('Custom error');
      expect(shouldRetry).toHaveBeenCalled();
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('createResilientClient', () => {
    it('should create resilient wrapper', async () => {
      const originalFn = vi.fn().mockResolvedValue('success');
      
      const resilientFn = createResilientClient(originalFn, {
        serviceName: 'test-service',
      });
      
      const result = await resilientFn('arg1', 'arg2');
      
      expect(result).toBe('success');
      expect(originalFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should preserve function arguments', async () => {
      const originalFn = vi.fn().mockResolvedValue('success');
      
      const resilientFn = createResilientClient(originalFn, {
        serviceName: 'test-service',
      });
      
      await resilientFn(1, 2, 3);
      
      expect(originalFn).toHaveBeenCalledWith(1, 2, 3);
    });
  });
});

