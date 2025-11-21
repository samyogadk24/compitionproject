import { getApps, getApp, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseConfig } from './config';

// This is a server-side only function.
export async function initializeFirebaseAdmin() {
  // If the admin app is already initialized, return the existing services.
  if (getApps().some(app => app.name === 'admin')) {
    const adminApp = getApp('admin');
    return {
      firestore: getFirestore(adminApp),
    };
  }
  
  // When no credential is provided, the Admin SDK attempts to authenticate using
  // Google Application Default Credentials, which is the desired behavior in this environment.
  const adminApp = initializeApp(
    {
      projectId: firebaseConfig.projectId,
    },
    'admin'
  );

  return {
    firestore: getFirestore(adminApp),
  };
}
