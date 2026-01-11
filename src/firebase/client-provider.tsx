
"use client";

import { FirebaseProvider } from "@/firebase/provider";
import { FirebaseErrorListener } from "@/components/FirebaseErrorListener";

// This provider now simply wraps the FirebaseProvider and the error listener.
// The actual initialization is handled lazily by the service getter functions.
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseProvider>
      {children}
      <FirebaseErrorListener />
    </FirebaseProvider>
  );
}
