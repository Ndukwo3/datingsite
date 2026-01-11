
"use client";

import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  type DocumentData,
  type Query,
} from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { errorEmitter } from "../error-emitter";
import { FirestorePermissionError } from "../errors";

interface UseCollectionOptions {
  // Add any options here if needed in the future
}

export function useCollection<T = DocumentData>(
  query: Query<T> | null,
  options?: UseCollectionOptions
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const firestore = useFirestore();

  useEffect(() => {
    if (!query || !firestore) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      query,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setData(docs);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Firestore onSnapshot error:", err);
        const permissionError = new FirestorePermissionError({
          path: 'collection' in query ? (query as any).path : 'unknown',
          operation: 'list'
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(query)]);

  return { data, loading, error };
}
