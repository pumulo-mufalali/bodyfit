import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import admin from 'firebase-admin';
import type { Request } from 'firebase-functions/v2/https';

export interface Context {
  req: Request;
  res: any; // Response type from firebase-functions v2
  userId?: string;
  auth: ReturnType<typeof getAuth>;
  db: ReturnType<typeof getFirestore>;
}

/**
 * Create tRPC context with Firebase Admin
 */
export async function createContext(req: Request, res: any): Promise<Context> {
  // Initialize Firebase Admin if not already initialized
  if (!admin.apps.length) {
    admin.initializeApp();
  }

  const auth = getAuth();
  const db = getFirestore();

  // Extract user ID from Authorization header
  let userId: string | undefined;

  try {
    const authHeader = req.headers.authorization;
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      if (token) {
        const decodedToken = await auth.verifyIdToken(token);
        userId = decodedToken.uid;
      }
    }
  } catch (error) {
    // User not authenticated or invalid token
    console.warn('Failed to verify token:', error);
  }

  return {
    req,
    res,
    userId,
    auth,
    db,
  };
}
