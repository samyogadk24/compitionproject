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
import { useState, useActionState, useEffect } from "react";

const login = async (previousState: any, formData: FormData) => {
  return { message: null, errors: {} };
};

export default function LoginForm() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useActionState(login, initialState);
  const { toast } = useToast();

   useEffect(() => {
    if (state.message) {
      toast({
        title: state.errors ? "Error" : "Success",
        description: state.message,
        variant: state.errors ? "destructive" : "default",
      });
    }
  }, [state, toast]);


  return (
    <div className="space-y-4">
       <p className="text-center text-sm text-muted-foreground">Login has been disabled.</p>
    </div>
  );
}
