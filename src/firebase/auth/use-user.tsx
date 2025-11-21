"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth, useFirestore } from "@/firebase";
import { Student } from "@/lib/definitions";
import { useRouter, usePathname } from 'next/navigation';

export function useUser() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [user, setUser] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth || !firestore) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userRef = doc(firestore, "students", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        let userData: Student;

        if (userSnap.exists()) {
          userData = userSnap.data() as Student;
        } else {
          // If user doesn't exist, create them in Firestore
          const newStudentData: Student = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            createdAt: new Date().toISOString(),
          };
          await setDoc(userRef, newStudentData);
          userData = newStudentData;
        }
        setUser(userData);
        if(pathname === '/login') {
          router.replace('/dashboard');
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore, pathname, router]);

  return { user, loading };
}
