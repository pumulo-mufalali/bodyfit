import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

console.log("Firebase config:", config);

if (import.meta.env.DEV) {
  const missing = Object.entries(config).filter(([, v]) => !v);
  if (missing.length) {
    // eslint-disable-next-line no-console
    console.warn("Missing Firebase env vars:", missing.map(([k]) => k).join(", "));
  }
}

const app = initializeApp(config);
export const auth = getAuth(app);
export const db = getFirestore(app);


