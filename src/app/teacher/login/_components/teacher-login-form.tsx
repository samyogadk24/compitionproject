"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/firebase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TeacherLoginForm() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!auth) {
      setError("Firebase is not initialized correctly.");
      return;
    }
    setIsSigningIn(true);
    setError(null);
    
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/teacher/dashboard");
    } catch (error: any) {
      console.error("Teacher Sign-In Error:", error);
      let errorMessage = "An unexpected error occurred.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password. Please check your credentials."
      } else {
        errorMessage = error.message;
      }
      setError(errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="email-signin">Email</Label>
        <Input
          id="email-signin"
          name="email"
          type="email"
          placeholder="teacher@example.com"
          required
        />
      </div>
      <div className="space-y-2 relative">
        <Label htmlFor="password-signin">Password</Label>
        <Input
          id="password-signin"
          name="password"
          type={showPassword ? "text" : "password"}
          required
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute bottom-1 right-1 h-7 w-7"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>
      </div>
      <Button type="submit" className="w-full" disabled={isSigningIn}>
        {isSigningIn ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}
