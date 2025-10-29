import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { auth } from './firebase';

/**
 * Get Firebase Auth token for authenticated requests
 */
async function getAuthToken(): Promise<string | null> {
  try {
    const user = auth.currentUser;
    if (!user) return null;
    return await user.getIdToken();
  } catch (error) {
    console.error('Failed to get auth token:', error);
    return null;
  }
}

// Get the tRPC endpoint URL from environment or use default
const TRPC_ENDPOINT = import.meta.env.VITE_TRPC_ENDPOINT || 'https://us-central1-your-project-id.cloudfunctions.net/trpc';

/**
 * tRPC client configured for Firebase Cloud Functions
 * Note: Using 'any' type temporarily - proper types will be available after functions package is built
 */
export const trpc = createTRPCProxyClient<any>({
  links: [
    httpBatchLink({
      url: TRPC_ENDPOINT,
      async headers() {
        const token = await getAuthToken();
        return {
          authorization: token ? `Bearer ${token}` : '',
        };
      },
    }),
  ],
});

// Legacy API wrapper for backward compatibility
// This can be gradually migrated to direct trpc calls
export const api = {
  user: {
    getProfile: async () => {
      return await (trpc as any).user.getProfile.query();
    },
    updateProfile: async (input: any) => {
      return await (trpc as any).user.updateProfile.mutate(input);
    },
  },
};


