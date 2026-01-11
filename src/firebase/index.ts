
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

// --- Firebase App Initialization ---

let firebaseApp: FirebaseApp;

// Initialize Firebase app if it hasn't been already
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

// --- Lazy-loaded Service Getters ---

let auth: Auth | null = null;
let firestore: Firestore | null = null;

/**
 * Lazily gets the Firebase Auth instance.
 * @returns The Firebase Auth instance.
 */
export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(firebaseApp);
  }
  return auth;
}

/**
 * Lazily gets the Firestore instance.
 * @returns The Firestore instance.
 */
export function getFirebaseFirestore(): Firestore {
  if (!firestore) {
    firestore = getFirestore(firebaseApp);
  }
  return firestore;
}

/**
 * Returns the initialized Firebase App instance.
 * @returns The FirebaseApp instance.
 */
export function getFirebaseAppInstance(): FirebaseApp {
    return firebaseApp;
}


// --- Exports from other files ---

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export { firebaseConfig };
