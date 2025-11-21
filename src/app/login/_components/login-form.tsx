"use client";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuth, useFirestore } from "@/firebase";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UserProfile } from "@/lib/definitions";
import { getUserByUsername } from "@/lib/actions";

function SignInForm() {
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
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
      const userResult = await getUserByUsername(username);

      if (!userResult?.email) {
        throw new Error("Invalid username or password. Please try again or register a new account.");
      }

      await signInWithEmailAndPassword(auth, userResult.email, password);
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Username Sign-In Error:", error);
      let errorMessage = "An unexpected error occurred.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Invalid username or password. Please try again or register a new account."
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
        <Label htmlFor="username-signin">Username</Label>
        <Input
          id="username-signin"
          name="username"
          type="text"
          placeholder="your_username"
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

function RegisterForm() {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!auth || !firestore) {
      setError("Firebase is not initialized correctly.");
      return;
    }
    setIsRegistering(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsRegistering(false);
      return;
    }

    try {
      // Note: In a real app, you'd want to check if the username is already taken here.
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        const userDocRef = doc(firestore, "users", user.uid);
        const newUser: UserProfile = {
          id: user.uid,
          username,
          firstName,
          lastName,
          email: user.email,
          role: 'student', // Default role
        };
        await setDoc(userDocRef, newUser);
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Registration Error:", error);
      setError(error.message);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" placeholder="John" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" placeholder="Doe" required />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="username-register">Username</Label>
        <Input
          id="username-register"
          name="username"
          type="text"
          placeholder="your_username"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-register">Email</Label>
        <Input
          id="email-register"
          name="email"
          type="email"
          placeholder="user@example.com"
          required
        />
      </div>
      <div className="space-y-2 relative">
        <Label htmlFor="password-register">Password</Label>
        <Input
          id="password-register"
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
      <Button type="submit" className="w-full" disabled={isRegistering}>
        {isRegistering ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}

export default function LoginForm() {
  return (
    <Tabs defaultValue="signin" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="signin" className="mt-4">
        <SignInForm />
      </TabsContent>
      <TabsContent value="register" className="mt-4">
        <RegisterForm />
      </TabsContent>
    </Tabs>
  );
}

    