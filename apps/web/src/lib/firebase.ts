import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { env } from "../env";

// Get current environment from validated env var
const currentEnv = env.VITE_ENV;

const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  appId: env.VITE_FIREBASE_APP_ID
};

// Log environment info (only in development)
if (import.meta.env.DEV) {
  console.log(`🔥 Firebase initialized for environment: ${currentEnv}`);
  console.log("Firebase config:", {
    ...config,
    apiKey: config.apiKey ? `${config.apiKey.substring(0, 10)}...` : 'missing',
    projectId: config.projectId || 'missing'
  });
}

const app = initializeApp(config);
export const auth = getAuth(app);
export const db = getFirestore(app);


