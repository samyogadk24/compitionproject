"use client";

import { useMemo } from "react";
import { useDoc } from "../firestore/use-doc";
import { useUser as useAuthUser } from "../provider";
import { doc, DocumentReference } from "firebase/firestore";
import { useFirestore } from "../provider";
import type { UserProfile } from "@/lib/definitions";

export function useUser() {
  const { user: authUser, isUserLoading: isAuthUserLoading } = useAuthUser();
  const firestore = useFirestore();

  const userDocRef = useMemo(() => {
    if (!firestore || !authUser) return null;
    return doc(firestore, "users", authUser.uid);
  }, [firestore, authUser]);
  
  const { data: userProfile, isLoading: isStudentLoading, error: studentError } = useDoc<UserProfile>(userDocRef as DocumentReference<UserProfile> | null);

  const loading = isAuthUserLoading || (authUser && isStudentLoading);

  return { user: userProfile, loading, error: studentError };
}
