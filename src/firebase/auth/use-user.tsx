"use client";

import { useEffect, useState } from "react";
import type { User as FirebaseUser } from "firebase/auth";
import { Student } from "@/lib/definitions";

export function useUser() {
  const [user, setUser] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  
  return { user, loading };
}
