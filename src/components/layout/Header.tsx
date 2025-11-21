"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SchoolPulseLogo } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Menu, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useUser } from "@/firebase/auth/use-user";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/announcements", label: "Announcements" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  const AuthButtons = () => {
    if (isUserLoading) {
      return null;
    }

    if (user) {
      return (
        <>
          <Button asChild variant="outline" size="sm" className="hidden md:flex">
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button onClick={handleLogout} size="sm" className="hidden md:flex">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </>
      );
    }

    return (
      <Button asChild size="sm" className="hidden md:flex">
        <Link href="/login">
          <LogIn className="mr-2 h-4 w-4" />
          Student Login
        </Link>
      </Button>
    );
  };
  
  const MobileAuthButtons = () => {
    if (isUserLoading) {
      return null;
    }

    if (user) {
      return (
        <>
          <Button asChild size="sm" onClick={() => setIsMobileMenuOpen(false)}>
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </>
      );
    }

    return (
       <Button asChild size="sm" onClick={() => setIsMobileMenuOpen(false)}>
          <Link href="/login">
          <LogIn className="mr-2 h-4 w-4" />
          Student Login
          </Link>
      </Button>
    );
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <SchoolPulseLogo className="h-7 w-7 text-primary" />
          <span className="font-headline">SchoolPulse</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === link.href ? "text-primary" : "text-muted-foreground"
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
            <SheetContent side="right">
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                  <SchoolPulseLogo className="h-7 w-7 text-primary" />
                  <span className="font-headline">SchoolPulse</span>
                </Link>
                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        pathname === link.href ? "text-primary" : "text-muted-foreground"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                 <MobileAuthButtons />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
