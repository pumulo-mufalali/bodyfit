import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import admin from 'firebase-admin';
/**
 * Create tRPC context with Firebase Admin
 */
export async function createContext(req, res) {
    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
        admin.initializeApp();
    }
    const auth = getAuth();
    const db = getFirestore();
    // Extract user ID from Authorization header
    let userId;
    try {
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.split('Bearer ')[1];
            const decodedToken = await auth.verifyIdToken(token);
            userId = decodedToken.uid;
        }
    }
    catch (error) {
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
