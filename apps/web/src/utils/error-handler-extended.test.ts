import { describe, it, expect } from 'vitest';
import {
  validatePassword,
  validateNumber,
  validateText,
  handleAsyncError,
  formatError,
} from './error-handler';

describe('error-handler extended utilities', () => {
  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('StrongP@ss123');
      expect(result.valid).toBe(true);
      expect(result.strength).toBe('strong');
    });

    it('should validate medium passwords', () => {
      const result = validatePassword('medium123');
      expect(result.valid).toBe(true);
      expect(result.strength).toBe('medium');
    });

    it('should validate weak passwords', () => {
      const result = validatePassword('weak');
      expect(result.valid).toBe(true);
      expect(result.strength).toBe('weak');
    });

    it('should reject passwords shorter than 6 characters', () => {
      const result = validatePassword('short');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least 6 characters');
    });

    it('should reject passwords longer than 128 characters', () => {
      const longPassword = 'a'.repeat(129);
      const result = validatePassword(longPassword);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('too long');
    });

    it('should reject empty passwords', () => {
      const result = validatePassword('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });
  });

  describe('validateNumber', () => {
    it('should validate valid numbers', () => {
      const result = validateNumber('123');
      expect(result.valid).toBe(true);
      expect(result.parsed).toBe(123);
    });

    it('should validate numbers with min/max', () => {
      const result = validateNumber('50', { min: 0, max: 100 });
      expect(result.valid).toBe(true);
      expect(result.parsed).toBe(50);
    });

    it('should reject numbers below minimum', () => {
      const result = validateNumber('10', { min: 20 });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least');
    });

    it('should reject numbers above maximum', () => {
      const result = validateNumber('150', { max: 100 });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at most');
    });

    it('should reject invalid number strings', () => {
      const result = validateNumber('not-a-number');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('valid number');
    });

    it('should handle required fields', () => {
      const result = validateNumber('', { required: true });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should allow empty optional fields', () => {
      const result = validateNumber('');
      expect(result.valid).toBe(true);
    });
  });

  describe('validateText', () => {
    it('should validate text with min/max length', () => {
      const result = validateText('Valid text', { minLength: 5, maxLength: 20 });
      expect(result.valid).toBe(true);
    });

    it('should reject text shorter than minimum', () => {
      const result = validateText('Hi', { minLength: 5 });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at least');
    });

    it('should reject text longer than maximum', () => {
      const longText = 'a'.repeat(101);
      const result = validateText(longText, { maxLength: 100 });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('at most');
    });

    it('should validate against pattern', () => {
      const result = validateText('ABC123', {
        pattern: /^[A-Z0-9]+$/,
      });
      expect(result.valid).toBe(true);
    });

    it('should reject text that does not match pattern', () => {
      const result = validateText('abc123', {
        pattern: /^[A-Z0-9]+$/,
        patternMessage: 'Must be uppercase letters and numbers only',
      });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Must be uppercase letters');
    });

    it('should handle required fields', () => {
      const result = validateText('', { required: true });
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });
  });

  describe('handleAsyncError', () => {
    it('should return success for successful operations', async () => {
      const fn = async () => 'success';
      
      const result = await handleAsyncError(fn);
      
      expect(result.success).toBe(true);
      expect(result.data).toBe('success');
    });

    it('should return error for failed operations', async () => {
      const fn = async () => {
        throw new Error('Operation failed');
      };
      
      const result = await handleAsyncError(fn);
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Operation failed');
    });

    it('should use custom error message', async () => {
      const fn = async () => {
        throw new Error('Some error');
      };
      
      const result = await handleAsyncError(fn, 'Custom error message');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Custom error message');
    });

    it('should handle Firebase auth errors', async () => {
      const fn = async () => {
        const error = new Error();
        error.code = 'auth/user-not-found';
        throw error;
      };
      
      const result = await handleAsyncError(fn);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('No account found');
    });

    it('should handle Firestore errors', async () => {
      const fn = async () => {
        const error = new Error();
        error.code = 'permission-denied';
        throw error;
      };
      
      const result = await handleAsyncError(fn);
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('permission');
    });
  });

  describe('formatError', () => {
    it('should format Error objects', () => {
      const error = new Error('Test error');
      expect(formatError(error)).toBe('Test error');
    });

    it('should format string errors', () => {
      expect(formatError('String error')).toBe('String error');
    });

    it('should format objects with message property', () => {
      const error = { message: 'Object error' };
      expect(formatError(error)).toBe('Object error');
    });

    it('should return default message for unknown error types', () => {
      expect(formatError(null)).toBe('An unexpected error occurred. Please try again.');
      expect(formatError(undefined)).toBe('An unexpected error occurred. Please try again.');
      expect(formatError({})).toBe('An unexpected error occurred. Please try again.');
    });
  });
});

