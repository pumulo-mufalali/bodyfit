import { onRequest } from 'firebase-functions/v2/https';
import { appRouter } from './routers';
import { createContext } from './context';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * tRPC Cloud Function endpoint
 */
export const trpc = onRequest(
  {
    cors: true,
    region: 'us-central1',
  },
  async (req, res) => {
    try {
      const ctx = await createContext(req, res);

      const handler = fetchRequestHandler({
        endpoint: '/trpc',
        req: req as any,
        router: appRouter,
        createContext: () => ctx,
        onError: ({ error, path }) => {
          console.error(`tRPC Error on path "${path}":`, error);
        },
      });

      return handler(req as any, res);
    } catch (error) {
      console.error('Error in tRPC handler:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

