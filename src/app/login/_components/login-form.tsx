"use client";

import {
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuth, useFirestore } from "@/firebase";
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
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (!auth || !firestore) {
      setError("Firebase is not initialized. Please try again later.");
      return;
    }
    setLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore, if not create a new document
      const userRef = doc(firestore, "students", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date().toISOString(),
        });
      }

      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.displayName}!`,
      });
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      let message = "An unexpected error occurred during sign-in.";
      if (err.code === "auth/popup-closed-by-user") {
        message = "Sign-in cancelled. Please try again.";
      } else if (err.code === "auth/network-request-failed") {
        message = "Network error. Please check your internet connection.";
      }
      setError(message);
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={loading}
      >
        {loading ? (
          "Signing in..."
        ) : (
          <>
            <Chrome className="mr-2 h-4 w-4" /> Sign in with Google
          </>
        )}
      </Button>
    </div>
  );
}
