"use client";

import {
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuth, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Chrome } from "lucide-react";
import { useState } from "react";

export default function LoginForm() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user && firestore) {
        const studentDocRef = doc(firestore, "students", user.uid);
        const studentDoc = await getDoc(studentDocRef);

        if (!studentDoc.exists()) {
          const [firstName, ...lastNameParts] = user.displayName?.split(" ") || ["", ""];
          const lastName = lastNameParts.join(" ");

          const newStudent = {
            id: user.uid,
            firstName,
            lastName,
            email: user.email,
          };
          
          setDocumentNonBlocking(studentDocRef, newStudent, { merge: true });
        }
        router.push("/dashboard");
      }
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button
        onClick={handleGoogleSignIn}
        className="w-full"
        disabled={isSigningIn}
      >
        <Chrome className="mr-2 h-4 w-4" />
        {isSigningIn ? "Signing In..." : "Sign in with Google"}
      </Button>
    </div>
  );
}
