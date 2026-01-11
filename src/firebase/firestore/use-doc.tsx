
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  onSnapshot,
  getDoc,
  type DocumentReference,
  type DocumentData,
} from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { errorEmitter } from "../error-emitter";
import { FirestorePermissionError } from "../errors";


export function useDoc<T = DocumentData>(
  ref: DocumentReference<T> | null
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const firestore = useFirestore();

  const refetch = useCallback(async () => {
    if (!ref || !firestore) return;
    setLoading(true);
    try {
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        setData({ ...snapshot.data(), id: snapshot.id });
      } else {
        setData(null);
      }
      setError(null);
    } catch (err: any) {
        const permissionError = new FirestorePermissionError({
          path: ref.path,
          operation: 'get'
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
    } finally {
        setLoading(false);
    }
  }, [ref, firestore]);

  useEffect(() => {
    if (!ref || !firestore) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        if (snapshot.exists()) {
          setData({ ...snapshot.data(), id: snapshot.id });
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore onSnapshot error:", err);
        const permissionError = new FirestorePermissionError({
          path: ref.path,
          operation: 'get'
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.path]);

  return { data, loading, error, refetch };
}
