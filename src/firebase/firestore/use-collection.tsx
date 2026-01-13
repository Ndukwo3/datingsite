
"use client";

import { useState, useEffect } from "react";
import {
  onSnapshot,
  type DocumentData,
  type Query,
} from "firebase/firestore";
import { useFirestore } from "@/firebase";
import { errorEmitter } from "../error-emitter";
import { FirestorePermissionError } from "../errors";

interface UseCollectionOptions {
  // Add any options here if needed in the future
}

// A helper to get the path from a Firestore query object.
// This is a bit of a hack, but it's necessary because the v9 SDK
// doesn't expose a public `path` property on queries.
function getPathFromQuery(q: Query): string {
    try {
        // This accesses a private property, which is not ideal but is the
        // most reliable way to get the path from a query for debugging.
        const internalQuery = q as any;
        if (internalQuery._query) {
            return internalQuery._query.path.toString();
        }
        // Fallback for collection group queries or other types
        if (internalQuery.converter) {
            return '(collection group)';
        }
    } catch (e) {
        // Fallback in case internal API changes
    }
    return 'unknown_collection_path';
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
        const permissionError = new FirestorePermissionError({
          path: getPathFromQuery(query),
          operation: 'list'
        });
        errorEmitter.emit('permission-error', permissionError);
        setError(permissionError);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(query)]);

  return { data, loading, error };
}
