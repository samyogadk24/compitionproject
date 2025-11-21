"use client";

import { initializeFirebase, FirebaseProvider } from "@/firebase";
import { useMemo } from "react";

export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { firebaseApp, auth, firestore } = useMemo(() => {
    return initializeFirebase();
  }, []);

  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      auth={auth}
      firestore={firestore}
    >
      {children}
    </FirebaseProvider>
  );
}
