"use client";

import { createContext, useContext } from "react";
import { FirebaseApp } from "firebase/app";
import { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";

interface FirebaseContextValue {
  firebaseApp: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

const FirebaseContext = createContext<FirebaseContextValue>({
  firebaseApp: null,
  auth: null,
  firestore: null,
});

export const FirebaseProvider = ({
  children,
  ...props
}: {
  children: React.ReactNode;
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}) => {
  return (
    <FirebaseContext.Provider value={props}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebaseApp = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebaseApp must be used within a FirebaseProvider");
  }
  return context.firebaseApp;
};

export const useAuth = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a FirebaseProvider");
  }
  return context.auth;
};

export const useFirestore = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirestore must be used within a FirebaseProvider");
  }
  return context.firestore;
};
