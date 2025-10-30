/**
 * Environment variable validation using T3 Env pattern
 * 
 * This file ensures type-safe access to environment variables
 * and validates required values at build time and runtime.
 * 
 * Following the T3 Env pattern for type-safe environment variables.
 */

import { z } from 'zod';

/**
 * Environment variable schema
 */
const envSchema = z.object({
  // Firebase Configuration
  VITE_FIREBASE_API_KEY: z.string().min(1, 'Firebase API key is required'),
  VITE_FIREBASE_AUTH_DOMAIN: z
    .string()
    .min(1, 'Firebase auth domain is required')
    .refine(
      (val) => {
        // Trim whitespace
        const trimmed = (val || '').trim();
        if (!trimmed) return false;
        
        // Firebase auth domains can be:
        // - Domain format: "project-name.firebaseapp.com"
        // - Full URL: "https://project-name.firebaseapp.com"
        // - Custom domains: "auth.yourdomain.com"
        
        // First check if it's a valid URL (has protocol)
        try {
          new URL(trimmed);
          return true; // Valid URL
        } catch {
          // Not a URL, check if it's a valid domain format
          // Very permissive pattern: must have at least one dot and valid characters
          // Allows: project.firebaseapp.com, auth.example.com, etc.
          const hasDot = trimmed.includes('.');
          const hasValidChars = /^[a-zA-Z0-9.-]+$/.test(trimmed);
          const notEmpty = trimmed.length > 0;
          
          return hasDot && hasValidChars && notEmpty;
        }
      },
      { message: 'Firebase auth domain must be a valid domain (e.g., project.firebaseapp.com) or URL' }
    ),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase project ID is required'),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().optional(),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().optional(),
  VITE_FIREBASE_APP_ID: z.string().min(1, 'Firebase app ID is required'),
  VITE_TRPC_ENDPOINT: z.string().url('tRPC endpoint must be a valid URL').optional(),
  VITE_ENV: z.enum(['dev', 'staging', 'prod']).default('dev'),
});

/**
 * Validate and parse environment variables
 */
const parseEnv = () => {
  const env = {
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY || '',
    VITE_FIREBASE_AUTH_DOMAIN: (import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '').trim(),
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID || '',
    VITE_TRPC_ENDPOINT: import.meta.env.VITE_TRPC_ENDPOINT || '',
    VITE_ENV: (import.meta.env.VITE_ENV || (import.meta.env.DEV ? 'dev' : 'prod')) as 'dev' | 'staging' | 'prod',
  };

  // Skip validation in test environment or if SKIP_ENV_VALIDATION is set
  if (import.meta.env.MODE === 'test' || import.meta.env.VITE_SKIP_ENV_VALIDATION === 'true') {
    return env as z.infer<typeof envSchema>;
  }

  // In development, log validation errors but allow the app to continue
  if (import.meta.env.DEV) {
    const result = envSchema.safeParse(env);
    if (!result.success) {
      console.warn('⚠️ Environment variable validation failed:', result.error.flatten());
      console.warn('⚠️ App will continue but some features may not work correctly.');
      console.warn('⚠️ Please check your .env file and ensure all required variables are set.');
      // Return the env anyway in development (non-blocking)
      return env as z.infer<typeof envSchema>;
    }
    return result.data;
  }

  // In production, strict validation (will throw on error)
  return envSchema.parse(env);
};

/**
 * Validated environment variables
 * 
 * This will throw an error at build/runtime if required env vars are missing
 */
export const env = parseEnv();

