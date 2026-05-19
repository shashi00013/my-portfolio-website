import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

export const googleProvider = new GoogleAuthProvider();

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

let initPromise: Promise<{ app: FirebaseApp | null, auth: Auth | null, db: Firestore | null }> | null = null;

export const getFirebase = async () => {
  if (app) return { app, auth, db };
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      // Dynamic import to avoid top-level await issues and allow build to pass if handled
      // @ts-ignore
      // @ts-ignore
      const configModule = await import("../../firebase-applet-config.json");
      const config = configModule.default || configModule;
      
      // Check if config is actually populated
      if (!config.apiKey) {
        console.warn("Firebase config is empty. Please complete Firebase setup in the AI Studio panel.");
        return { app: null, auth: null, db: null };
      }

      if (!getApps().length) {
        app = initializeApp(config);
      } else {
        app = getApp();
      }
      
      auth = getAuth(app);
      db = getFirestore(app);
      
      return { app, auth, db };
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      return { app: null, auth: null, db: null };
    }
  })();

  return initPromise;
};

// Also export raw instances for initial module load (they will be null until getFirebase is called)
export { auth, db };
