
"use client";

import { createContext, useContext, useMemo } from "react";
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import { getFirebaseAppInstance, getFirebaseAuth, getFirebaseFirestore } from "@/firebase";

interface FirebaseContextValue {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export function FirebaseProvider({
  children
}: { children: React.ReactNode }) {
  const instances = useMemo(() => {
    const app = getFirebaseAppInstance();
    const auth = getFirebaseAuth();
    const firestore = getFirebaseFirestore();
    return { app, auth, firestore };
  }, []);

  return (
    <FirebaseContext.Provider value={instances}>
      {children}
    </FirebaseContext.Provider>
  );
}

// --- Hooks to access Firebase services ---

export function useFirebase() {
  const context = useContext(FirebaseContext);
  if (context === null) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
}

export function useFirebaseApp() {
  return useFirebase().app;
}

export function useAuth() {
  return useFirebase().auth;
}

export function useFirestore() {
  return useFirebase().firestore;
}
