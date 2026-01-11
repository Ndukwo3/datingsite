"use client";

import { useEffect, useState } from "react";
import { initializeFirebase } from "@/firebase";
import { FirebaseProvider } from "@/firebase/provider";
import { FirebaseErrorListener } from "@/components/FirebaseErrorListener";
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

type FirebaseInstances = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [firebase, setFirebase] = useState<FirebaseInstances | null>(null);

  useEffect(() => {
    const instances = initializeFirebase();
    setFirebase(instances);
  }, []);

  if (!firebase) {
    // You can render a loader here if needed
    return null;
  }

  return (
    <FirebaseProvider
      app={firebase.app}
      auth={firebase.auth}
      firestore={firebase.firestore}
    >
      {children}
      <FirebaseErrorListener />
    </FirebaseProvider>
  );
}
