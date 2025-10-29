import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import type { Request, Response } from 'firebase-functions/v2/https';
export interface Context {
    req: Request;
    res: Response;
    userId?: string;
    auth: ReturnType<typeof getAuth>;
    db: ReturnType<typeof getFirestore>;
}
/**
 * Create tRPC context with Firebase Admin
 */
export declare function createContext(req: Request, res: Response): Promise<Context>;
