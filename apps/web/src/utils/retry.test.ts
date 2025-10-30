import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { withRetry, isRetryableError } from './retry';

describe('retry utility', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('withRetry', () => {
    it('should succeed on first attempt', async () => {
      const fn = vi.fn().mockResolvedValue('success');
      
      const result = await withRetry(fn);
      
      expect(result.success).toBe(true);
      expect(result.data).toBe('success');
      expect(result.attempts).toBe(1);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and eventually succeed', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue('success');
      
      const promise = withRetry(fn, { maxAttempts: 3 });
      
      // Fast-forward through delays
      await vi.runAllTimersAsync();
      
      const result = await promise;
      
      expect(result.success).toBe(true);
      expect(result.data).toBe('success');
      expect(result.attempts).toBe(3);
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should fail after max attempts', async () => {
      const error = new Error('Network error');
      const fn = vi.fn().mockRejectedValue(error);
      
      const promise = withRetry(fn, { maxAttempts: 3 });
      
      await vi.runAllTimersAsync();
      
      const result = await promise;
      
      expect(result.success).toBe(false);
      expect(result.error).toBe(error);
      expect(result.attempts).toBe(3);
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it('should not retry if shouldRetry returns false', async () => {
      const error = new Error('Permission denied');
      error.code = 'permission-denied';
      const fn = vi.fn().mockRejectedValue(error);
      
      const result = await withRetry(fn, {
        maxAttempts: 3,
        shouldRetry: () => false,
      });
      
      expect(result.success).toBe(false);
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should call onRetry callback', async () => {
      const error = new Error('Network error');
      const fn = vi.fn().mockRejectedValueOnce(error).mockResolvedValue('success');
      const onRetry = vi.fn();
      
      const promise = withRetry(fn, { maxAttempts: 2, onRetry });
      
      await vi.runAllTimersAsync();
      
      const result = await promise;
      
      expect(result.success).toBe(true);
      expect(onRetry).toHaveBeenCalledTimes(1);
      expect(onRetry).toHaveBeenCalledWith(error, 2, expect.any(Number));
    });

    it('should use exponential backoff', async () => {
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValue('success');
      
      const onRetry = vi.fn();
      const promise = withRetry(fn, {
        maxAttempts: 3,
        initialDelayMs: 100,
        backoffMultiplier: 2,
        onRetry,
      });
      
      // First retry should happen after initialDelayMs
      await vi.advanceTimersByTimeAsync(100);
      expect(onRetry).toHaveBeenCalledTimes(1);
      
      // Second retry should happen after initialDelayMs * 2
      await vi.advanceTimersByTimeAsync(200);
      expect(onRetry).toHaveBeenCalledTimes(2);
      
      await vi.runAllTimersAsync();
      const result = await promise;
      
      expect(result.success).toBe(true);
    });
  });

  describe('isRetryableError', () => {
    it('should return true for network errors', () => {
      const error = { code: 'network-request-failed' };
      expect(isRetryableError(error)).toBe(true);
    });

    it('should return true for unavailable errors', () => {
      const error = { code: 'unavailable' };
      expect(isRetryableError(error)).toBe(true);
    });

    it('should return true for timeout errors', () => {
      const error = { code: 'deadline-exceeded' };
      expect(isRetryableError(error)).toBe(true);
    });

    it('should return true for 5xx server errors', () => {
      const error = { status: 500 };
      expect(isRetryableError(error)).toBe(true);
    });

    it('should return false for auth errors', () => {
      const error = { code: 'auth/user-not-found' };
      expect(isRetryableError(error)).toBe(false);
    });

    it('should return false for permission errors', () => {
      const error = { code: 'permission-denied' };
      expect(isRetryableError(error)).toBe(false);
    });

    it('should return false for 4xx client errors', () => {
      const error = { status: 400 };
      expect(isRetryableError(error)).toBe(false);
    });

    it('should return true for rate limiting', () => {
      const error = { status: 429 };
      expect(isRetryableError(error)).toBe(true);
    });

    it('should return true for network-related messages', () => {
      const error = { message: 'Network connection failed' };
      expect(isRetryableError(error)).toBe(true);
    });
  });
});

