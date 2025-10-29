/**
 * Centralized error handling utilities
 */

export interface AppError {
  code?: string;
  message: string;
  details?: any;
  severity?: 'error' | 'warning' | 'info';
}

/**
 * Parse Firebase Auth errors into user-friendly messages
 */
export function getFirebaseAuthErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password is too weak. Please choose a stronger password (at least 6 characters).',
    'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
    'auth/user-not-found': 'No account found with this email address.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/user-disabled': 'This account has been disabled. Please contact support.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/invalid-credential': 'Invalid email or password. Please try again.',
    'auth/requires-recent-login': 'Please log out and log in again to complete this action.',
    'auth/email-already-exists': 'This email is already registered.',
    'auth/invalid-phone-number': 'Invalid phone number format.',
    'auth/phone-number-already-exists': 'This phone number is already registered.',
    'auth/credential-already-in-use': 'This credential is already associated with another account.',
    // Password reset specific errors
    'auth/missing-email': 'Email address is required to reset password.',
    'auth/invalid-continue-uri': 'The continue URL is invalid. Please try again.',
    'auth/unauthorized-continue-uri': 'The continue URL is not authorized. Please contact support.',
  };

  return errorMessages[errorCode] || 'An error occurred. Please try again.';
}

/**
 * Parse Firestore errors into user-friendly messages
 */
export function getFirestoreErrorMessage(error: any): string {
  if (!error) return 'An unknown error occurred.';

  const errorCode = error.code || '';
  
  const firestoreErrorMessages: Record<string, string> = {
    'permission-denied': 'You do not have permission to perform this action.',
    'not-found': 'The requested data was not found.',
    'already-exists': 'This data already exists.',
    'unauthenticated': 'You must be logged in to perform this action.',
    'failed-precondition': 'The operation failed because of a precondition.',
    'aborted': 'The operation was aborted. Please try again.',
    'out-of-range': 'The value provided is out of range.',
    'unimplemented': 'This feature is not yet implemented.',
    'internal': 'An internal error occurred. Please try again later.',
    'unavailable': 'The service is temporarily unavailable. Please try again later.',
    'deadline-exceeded': 'The operation timed out. Please try again.',
    'resource-exhausted': 'Resources exhausted. Please try again later.',
    'cancelled': 'The operation was cancelled.',
    'data-loss': 'Data loss occurred. Please try again.',
    'unknown': 'An unknown error occurred. Please try again.',
  };

  if (firestoreErrorMessages[errorCode]) {
    return firestoreErrorMessages[errorCode];
  }

  // Check for network errors
  if (error.message?.includes('network') || error.message?.includes('connection')) {
    return 'Network error. Please check your internet connection.';
  }

  return error.message || 'An error occurred. Please try again.';
}

/**
 * Validate email format
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: 'Email is required.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Please enter a valid email address.' };
  }

  if (email.length > 254) {
    return { valid: false, error: 'Email address is too long.' };
  }

  return { valid: true };
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { valid: boolean; error?: string; strength?: 'weak' | 'medium' | 'strong' } {
  if (!password || password.length === 0) {
    return { valid: false, error: 'Password is required.' };
  }

  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters long.' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password is too long (maximum 128 characters).' };
  }

  // Determine strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password)) {
    strength = 'strong';
  } else if (password.length >= 6 && (/\d/.test(password) || /[A-Za-z]/.test(password))) {
    strength = 'medium';
  }

  return { valid: true, strength };
}

/**
 * Validate number input
 */
export function validateNumber(
  value: string | number,
  options: {
    min?: number;
    max?: number;
    required?: boolean;
    name?: string;
  } = {}
): { valid: boolean; error?: string; parsed?: number } {
  const { min, max, required = false, name = 'Value' } = options;

  if (required && (value === '' || value === null || value === undefined)) {
    return { valid: false, error: `${name} is required.` };
  }

  if (value === '' || value === null || value === undefined) {
    return { valid: true }; // Optional field is empty, which is valid
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return { valid: false, error: `${name} must be a valid number.` };
  }

  if (min !== undefined && num < min) {
    return { valid: false, error: `${name} must be at least ${min}.` };
  }

  if (max !== undefined && num > max) {
    return { valid: false, error: `${name} must be at most ${max}.` };
  }

  return { valid: true, parsed: num };
}

/**
 * Validate text input
 */
export function validateText(
  value: string,
  options: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
    name?: string;
    pattern?: RegExp;
    patternMessage?: string;
  } = {}
): { valid: boolean; error?: string } {
  const { minLength, maxLength, required = false, name = 'Text', pattern, patternMessage } = options;

  if (required && (!value || value.trim().length === 0)) {
    return { valid: false, error: `${name} is required.` };
  }

  if (!value || value.trim().length === 0) {
    return { valid: true }; // Optional field is empty, which is valid
  }

  const trimmedValue = value.trim();

  if (minLength !== undefined && trimmedValue.length < minLength) {
    return { valid: false, error: `${name} must be at least ${minLength} characters long.` };
  }

  if (maxLength !== undefined && trimmedValue.length > maxLength) {
    return { valid: false, error: `${name} must be at most ${maxLength} characters long.` };
  }

  if (pattern && !pattern.test(trimmedValue)) {
    return { valid: false, error: patternMessage || `${name} format is invalid.` };
  }

  return { valid: true };
}

/**
 * Handle async errors gracefully
 */
export async function handleAsyncError<T>(
  asyncFn: () => Promise<T>,
  errorMessage = 'An error occurred. Please try again.'
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const data = await asyncFn();
    return { success: true, data };
  } catch (error: any) {
    console.error('Async error:', error);
    
    let errorMsg = errorMessage;
    
    if (error?.code) {
      // Firebase error
      if (error.code.startsWith('auth/')) {
        errorMsg = getFirebaseAuthErrorMessage(error.code);
      } else if (error.code.startsWith('permission-denied') || error.code.startsWith('unauthenticated')) {
        errorMsg = getFirestoreErrorMessage(error);
      }
    } else if (error?.message) {
      errorMsg = error.message;
    }

    return { success: false, error: errorMsg };
  }
}

/**
 * Format error for display
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message);
  }
  
  return 'An unexpected error occurred. Please try again.';
}

