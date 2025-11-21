import { FirebaseApp } from "firebase/app";
import { Auth } from "firebase/auth";
import { Firestore } from "firebase/firestore";

// These are now stubs since Firebase functionality is removed.
let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;

function initializeFirebase() {
  // No-op
  return { firebaseApp, auth, firestore };
}

// Export stubs
const FirebaseProvider = ({ children }: { children: React.ReactNode }) => children;
const FirebaseClientProvider = ({ children }: { children: React.ReactNode }) => children;
const useUser = () => ({ user: null, loading: false });
const useFirebaseApp = () => null;
const useAuth = () => null;
const useFirestore = () => null;


export {
  initializeFirebase,
  FirebaseProvider,
  FirebaseClientProvider,
  useUser,
  useFirebaseApp,
  useAuth,
  useFirestore,
};
