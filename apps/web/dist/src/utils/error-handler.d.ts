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
export declare function getFirebaseAuthErrorMessage(errorCode: string): string;
/**
 * Parse Firestore errors into user-friendly messages
 */
export declare function getFirestoreErrorMessage(error: any): string;
/**
 * Validate email format
 */
export declare function validateEmail(email: string): {
    valid: boolean;
    error?: string;
};
/**
 * Validate password strength
 */
export declare function validatePassword(password: string): {
    valid: boolean;
    error?: string;
    strength?: 'weak' | 'medium' | 'strong';
};
/**
 * Validate number input
 */
export declare function validateNumber(value: string | number, options?: {
    min?: number;
    max?: number;
    required?: boolean;
    name?: string;
}): {
    valid: boolean;
    error?: string;
    parsed?: number;
};
/**
 * Validate text input
 */
export declare function validateText(value: string, options?: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
    name?: string;
    pattern?: RegExp;
    patternMessage?: string;
}): {
    valid: boolean;
    error?: string;
};
/**
 * Handle async errors gracefully
 */
export declare function handleAsyncError<T>(asyncFn: () => Promise<T>, errorMessage?: string): Promise<{
    success: boolean;
    data?: T;
    error?: string;
}>;
/**
 * Format error for display
 */
export declare function formatError(error: unknown): string;
