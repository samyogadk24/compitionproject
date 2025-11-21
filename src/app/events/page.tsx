'use client';

import { useEffect, useState } from 'react';
import { getEvents } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CalendarDays, PartyPopper } from 'lucide-react';
import { initializeFirebase } from '@/firebase';
import type { Event } from '@/lib/definitions';
import { Skeleton } from '@/components/ui/skeleton';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { firestore } = initializeFirebase();
        const fetchedEvents = await getEvents(firestore);
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 bg-background">
        <div className="container mx-auto py-12 px-4 md:px-6">
          <div className="flex items-center gap-4 mb-8">
            <PartyPopper className="w-10 h-10 text-primary" />
            <div>
              <h1 className="text-4xl font-bold font-headline">Upcoming Events</h1>
              <p className="text-muted-foreground">
                Don't miss out on our exciting school events.
              </p>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="flex items-center gap-4 mb-8">
          <PartyPopper className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-4xl font-bold font-headline">Upcoming Events</h1>
            <p className="text-muted-foreground">
              Don't miss out on our exciting school events.
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event.id} className="flex flex-col transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="font-headline">{event.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-sm pt-1">
                  <CalendarDays className="w-4 h-4" />
                  <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</span>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p>{event.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
