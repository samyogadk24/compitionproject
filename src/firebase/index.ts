import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { firebaseConfig } from "./config";

import {
  FirebaseProvider,
  useFirebaseApp,
  useAuth,
  useFirestore,
} from "./provider";
import { FirebaseClientProvider } from "./client-provider";
import { useUser } from "./auth/use-user";

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

function initializeFirebase() {
  if (getApps().length === 0) {
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    firestore = getFirestore(firebaseApp);
  }
  return { firebaseApp, auth, firestore };
}

export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useUser,
  useFirebaseApp,
  useAuth,
  useFirestore,
};
