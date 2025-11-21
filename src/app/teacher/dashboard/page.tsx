"use client";

import { useUser } from "@/firebase/auth/use-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Shield } from "lucide-react";
import AnnouncementsManager from "./_components/announcements-manager";
import EventsManager from "./_components/events-manager";

export default function TeacherDashboardPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.role !== 'teacher') {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (user?.role !== 'teacher') {
    return null;
  }

  return (
    <div className="flex-1 bg-background">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="flex items-center gap-4 mb-8">
          <Shield className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-4xl font-bold font-headline">Teacher Zone</h1>
            <p className="text-muted-foreground">
              Manage school content and resources.
            </p>
          </div>
        </div>
        <div className="grid gap-8">
            <AnnouncementsManager />
            <EventsManager />
        </div>
      </div>
    </div>
  );
}
