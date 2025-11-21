
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SchoolPulseLogo } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Menu, LogIn, LogOut, LayoutDashboard, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useUser } from "@/firebase/auth/use-user";

const baseNavLinks = [
  { href: "/", label: "Home" },
];

const authenticatedNavLinks = [
    { href: "/students", label: "Directory" },
];


export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading: isUserLoading } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  const navLinks = hasMounted && user ? [...baseNavLinks, ...authenticatedNavLinks] : baseNavLinks;


  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.push("/");
  };

  const AuthButtons = () => {
    if (!hasMounted || isUserLoading) {
      return <div className="h-9 w-24 rounded-md bg-muted animate-pulse hidden md:block" />;
    }

    if (user) {
      return (
        <>
          {user.role === 'teacher' && (
             <Button asChild variant="ghost" size="sm" className="hidden md:flex">
                <Link href="/teacher/dashboard">
                  <Shield />
                  Teacher Zone
                </Link>
              </Button>
          )}
          <Button asChild variant="ghost" size="sm" className="hidden md:flex">
            <Link href="/dashboard">
              <LayoutDashboard />
              Dashboard
            </Link>
          </Button>
          <Button onClick={handleLogout} size="sm" variant="destructive" className="hidden md:flex">
            <LogOut />
            Logout
          </Button>
        </>
      );
    }

    return (
      <Button asChild size="sm" className="hidden md:flex">
        <Link href="/login">
          <LogIn />
          Login
        </Link>
      </Button>
    );
  };
  
  const MobileAuthButtons = () => {
    const closeMenu = () => setIsMobileMenuOpen(false);

    if (!hasMounted || isUserLoading) {
      return (
        <div className="flex flex-col gap-2 mt-auto">
           <div className="h-10 w-full rounded-md bg-muted animate-pulse" />
        </div>
      );
    }

    if (user) {
      return (
        <div className="flex flex-col gap-2 mt-auto">
          {user.role === 'teacher' && (
            <Button asChild variant="outline" size="sm" onClick={closeMenu}>
              <Link href="/teacher/dashboard">
                <Shield />
                Teacher Zone
              </Link>
            </Button>
          )}
          <Button asChild variant="outline" size="sm" onClick={closeMenu}>
            <Link href="/dashboard">
              <LayoutDashboard />
              Dashboard
            </Link>
          </Button>
          <Button onClick={() => { handleLogout(); closeMenu(); }} size="sm" variant="destructive">
            <LogOut />
            Logout
          </Button>
        </div>
      );
    }

    return (
       <Button asChild size="sm" onClick={closeMenu} className="mt-auto">
          <Link href="/login">
            <LogIn />
            Login
          </Link>
      </Button>
    );
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <SchoolPulseLogo className="h-8 w-8 text-primary" />
          <span className="font-headline text-2xl">SchoolPulse</span>
        </Link>
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/50 hover:text-accent-foreground",
                pathname === link.href ? "bg-accent/80 text-accent-foreground" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
            <AuthButtons />
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
               <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4" onClick={() => setIsMobileMenuOpen(false)}>
                  <SchoolPulseLogo className="h-7 w-7 text-primary" />
                  <span className="font-headline">SchoolPulse</span>
                </Link>
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent/50 hover:text-accent-foreground",
                      pathname === link.href ? "bg-accent/80 text-accent-foreground" : "text-muted-foreground"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="flex-1" />
              <MobileAuthButtons />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
