import { describe, it, expect } from 'vitest';
import {
  getFirebaseAuthErrorMessage,
  getFirestoreErrorMessage,
  validateEmail,
} from './error-handler';

describe('error-handler utilities', () => {
  describe('getFirebaseAuthErrorMessage', () => {
    it('should return user-friendly message for user-not-found', () => {
      expect(getFirebaseAuthErrorMessage('auth/user-not-found')).toBe(
        'No account found with this email address.'
      );
    });

    it('should return user-friendly message for wrong-password', () => {
      expect(getFirebaseAuthErrorMessage('auth/wrong-password')).toBe(
        'Incorrect password. Please try again.'
      );
    });

    it('should return default message for unknown error codes', () => {
      expect(getFirebaseAuthErrorMessage('auth/unknown-error')).toBe(
        'An authentication error occurred. Please try again.'
      );
    });
  });

  describe('getFirestoreErrorMessage', () => {
    it('should return message for permission-denied', () => {
      const error = { code: 'permission-denied' };
      expect(getFirestoreErrorMessage(error)).toBe(
        'You do not have permission to perform this action.'
      );
    });

    it('should return message for not-found', () => {
      const error = { code: 'not-found' };
      expect(getFirestoreErrorMessage(error)).toBe(
        'The requested data was not found.'
      );
    });

    it('should return default message for unknown error', () => {
      expect(getFirestoreErrorMessage(null)).toBe(
        'An unknown error occurred.'
      );
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toEqual({ valid: true });
      expect(validateEmail('user.name+tag@domain.co.uk')).toEqual({ valid: true });
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toEqual({
        valid: false,
        error: 'Please enter a valid email address.',
      });
      expect(validateEmail('test@')).toEqual({
        valid: false,
        error: 'Please enter a valid email address.',
      });
      expect(validateEmail('@example.com')).toEqual({
        valid: false,
        error: 'Please enter a valid email address.',
      });
    });

    it('should reject empty strings', () => {
      expect(validateEmail('')).toEqual({
        valid: false,
        error: 'Email is required.',
      });
    });
  });
});

