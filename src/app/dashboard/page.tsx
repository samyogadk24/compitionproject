"use client";

import { useEffect, useState } from "react";
import { getAnnouncements, getEvents, getResources } from "@/lib/data";
import type { Announcement, Event, Resource } from "@/lib/definitions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  CalendarDays,
  Download,
  FileText,
  Library,
  Megaphone,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/firebase/auth/use-user";

export default function DashboardPage() {
  const { user: student, loading: userLoading } = useUser();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoadingData(true);
        const [
          announcementsData,
          eventsData,
          resourcesData,
        ] = await Promise.all([
          getAnnouncements(),
          getEvents(),
          getResources(),
        ]);
        setAnnouncements(announcementsData);
        setEvents(eventsData);
        setResources(resourcesData);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, []);

  const PageSkeleton = () => (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
      </div>
      <Tabs defaultValue="announcements" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="announcements">
            <Megaphone className="w-4 h-4 mr-2" />
            Announcements
          </TabsTrigger>
          <TabsTrigger value="events">
            <CalendarDays className="w-4 h-4 mr-2" />
            Events
          </TabsTrigger>
          <TabsTrigger value="resources">
            <Library className="w-4 h-4 mr-2" />
            Resources
          </TabsTrigger>
        </TabsList>
        <TabsContent value="announcements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
              <CardDescription>
                The latest news and updates from the school.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-4 border rounded-lg space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  if (userLoading || loadingData) {
    return (
      <div className="flex-1 bg-background">
        <PageSkeleton />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="flex items-center gap-4 mb-8">
          <User className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-4xl font-bold font-headline">
              Student Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome, {student?.firstName || 'Student'}!
            </p>
          </div>
        </div>

        <Tabs defaultValue="announcements" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="announcements">
              <Megaphone className="w-4 h-4 mr-2" />
              Announcements
            </TabsTrigger>
            <TabsTrigger value="events">
              <CalendarDays className="w-4 h-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="resources">
              <Library className="w-4 h-4 mr-2" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="announcements" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Announcements</CardTitle>
                <CardDescription>
                  The latest news and updates from the school.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {announcements.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>
                  Mark your calendar for these exciting events.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {events.slice(0, 3).map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                      <CalendarDays className="w-4 h-4" />
                      <span>
                        {new Date(item.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Downloadable Resources</CardTitle>
                <CardDescription>
                  Important documents and materials for you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-primary" />
                      <div>
                        <h4 className="font-medium">{resource.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {resource.description}
                        </p>
                      </div>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <a href={resource.fileUrl} download>
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </a>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
