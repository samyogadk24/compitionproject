import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-card">
      <div className="container mx-auto py-6 px-4 md:px-6 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SchoolPulse. All rights reserved.</p>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mt-4 md:mt-0">
          <p>123 Education Lane, Knowledge City, 12345</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
