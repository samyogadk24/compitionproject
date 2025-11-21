"use client";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  User,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/firebase/auth/use-user";
import Link from "next/link";


export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();

  const PageSkeleton = () => (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
      </div>
       <Card>
            <CardContent className="space-y-4 pt-6">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
            </CardContent>
        </Card>
    </div>
  );

  if (userLoading) {
    return (
      <div className="flex-1 bg-background">
        <PageSkeleton />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
            <User className="w-10 h-10 text-primary" />
            <div>
                <h1 className="text-4xl font-bold font-headline">
                {user?.role === 'teacher' ? 'Teacher' : 'Student'} Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Welcome, {user?.firstName || 'User'}!
                </p>
            </div>
            </div>
            {user?.role === 'teacher' && (
                <Button asChild>
                    <Link href="/teacher/dashboard">
                        <Shield className="w-4 h-4 mr-2" />
                        Go to Teacher Zone
                    </Link>
                </Button>
            )}
        </div>
      </div>
    </div>
  );
}
