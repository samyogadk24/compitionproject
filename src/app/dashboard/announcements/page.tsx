
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, Megaphone } from "lucide-react";
import { useCollection } from "@/firebase/firestore/use-collection";
import { useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, Query } from "firebase/firestore";
import type { Announcement } from "@/lib/definitions";
import { Skeleton } from "@/components/ui/skeleton";


function PageSkeleton() {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

export default function AnnouncementsPage() {
    const firestore = useFirestore();

    const announcementsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return query(
            collection(firestore, "announcements"), 
            orderBy("date", "desc")
        ) as Query<Announcement>;
    }, [firestore]);
    
    const { data: announcements, isLoading } = useCollection<Announcement>(announcementsQuery);


  return (
    <div className="flex-1 bg-background">
      <div className="py-12 px-4 md:px-6">
        <div className="flex items-center gap-4 mb-8">
          <Megaphone className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-4xl font-bold font-headline">Announcements</h1>
            <p className="text-muted-foreground">
              Stay up-to-date with the latest school news.
            </p>
          </div>
        </div>

        {isLoading ? <PageSkeleton /> : (
            <div className="space-y-6">
            {announcements?.map((announcement) => (
                <Card key={announcement.id} className="transition-shadow hover:shadow-md">
                <CardHeader>
                    <CardTitle className="font-headline">{announcement.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-sm pt-1">
                    <CalendarDays className="w-4 h-4" />
                    <span>{new Date(announcement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{announcement.shortDescription}</p>
                </CardContent>
                </Card>
            ))}
            </div>
        )}
      </div>
    </div>
  );
}
