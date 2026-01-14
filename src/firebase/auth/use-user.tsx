
"use client";

import { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";
import { useAuth, useFirestore, useDoc } from "@/firebase";
import { doc, updateDoc } from "firebase/firestore";
import type { User } from "@/lib/types";
import { useProfileCompletion } from "@/hooks/use-profile-completion";

export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const userDocRef = user ? doc(firestore, "users", user.uid) : null;
  const { data: userData, loading: userDataLoading, refetch } = useDoc<User>(userDocRef);

  const { completionPercentage, nextStep } = useProfileCompletion(userData);

  useEffect(() => {
    // When profile is 100% complete, automatically verify the user
    if (userDocRef && completionPercentage === 100 && userData && !userData.isVerified) {
      updateDoc(userDocRef, { isVerified: true });
    }
  }, [completionPercentage, userData, userDocRef]);


  const refreshUserData = useCallback(() => {
    if (refetch) {
      refetch();
    }
  }, [refetch]);

  return {
    user,
    userData,
    loading: loading || userDataLoading,
    refreshUserData,
    completionPercentage,
    nextStep
  };
}

    