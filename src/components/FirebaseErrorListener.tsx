"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

// This component listens for Firestore permission errors and displays a toast.
// It's intended to be used within your main layout or provider.
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      console.error(error); // Also log the full error to the console for debugging
      toast({
        variant: "destructive",
        title: "Permission Denied",
        description: "You do not have permission to perform this action. Check Firestore rules.",
        duration: 10000,
      });
      // In a dev environment, we might throw the error to show the Next.js overlay
      if (process.env.NODE_ENV === 'development') {
        throw error;
      }
    };

    errorEmitter.on("permission-error", handlePermissionError);

    return () => {
      errorEmitter.off("permission-error", handlePermissionError);
    };
  }, [toast]);

  return null; // This component doesn't render anything
}
