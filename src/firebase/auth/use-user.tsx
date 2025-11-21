"use client";

import { useEffect, useMemo, useState } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import { Student } from "@/lib/definitions";
import { useDoc } from "../firestore/use-doc";
import { useUser as useAuthUser } from "../provider";
import { doc, DocumentReference } from "firebase/firestore";
import { useFirestore } from "../provider";

export function useUser() {
  const { user: authUser, isUserLoading: isAuthUserLoading } = useAuthUser();
  const firestore = useFirestore();

  const studentDocRef = useMemo(() => {
    if (!firestore || !authUser) return null;
    return doc(firestore, "students", authUser.uid);
  }, [firestore, authUser]);
  
  const { data: student, isLoading: isStudentLoading, error: studentError } = useDoc<Student>(studentDocRef as DocumentReference<Student> | null);

  const loading = isAuthUserLoading || (authUser && isStudentLoading);

  return { user: student, loading, error: studentError };
}
