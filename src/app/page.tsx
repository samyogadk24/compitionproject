
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, Library, Megaphone, PartyPopper } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { generateAnnouncements } from "@/ai/flows/generate-announcements-flow";
import { generateEvents } from "@/ai/flows/generate-events-flow";

const featureCards = [
  {
    title: "Student Portal",
    description: "Access your dashboard.",
    href: "/dashboard",
    icon: <Library className="w-8 h-8 text-primary" />,
  },
  {
    title: "School Directory",
    description: "Connect with others.",
    href: "/dashboard/students",
    icon: <Megaphone className="w-8 h-8 text-primary" />,
  },
  {
    title: "Teacher Zone",
    description: "Manage school content.",
    href: "/teacher/login",
    icon: <CalendarDays className="w-8 h-8 text-primary" />,
  },
];

export const dynamic = 'force-dynamic';

export default async function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-school");
  const latestAnnouncements = await generateAnnouncements();
  const upcomingEvents = await generateEvents();


  return (
    <div className="flex flex-col flex-1">
      <section className="relative w-full h-96 flex items-center justify-center text-center bg-card shadow-md">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover opacity-20"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="relative z-10 p-4">
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-foreground">
            Welcome to SchoolPulse
          </h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
            Your central hub for the latest announcements, upcoming events, and essential resources.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="flex-1 w-full max-w-7xl mx-auto py-16 px-4 md:px-6">
        {/* Latest Announcements Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <Megaphone className="w-8 h-8 text-primary" />
            <h2 className="text-3xl font-bold font-headline">Latest Announcements</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestAnnouncements.slice(0, 3).map((announcement, index) => (
              <Card key={index} className="transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">{announcement.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-sm pt-1">
                    <CalendarDays className="w-4 h-4" />
                    <span>{new Date(announcement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{announcement.shortDescription}</p>
                </CardContent>
              </Card>
            ))}
          </div>
           <div className="text-center mt-8">
              <Button asChild variant="outline">
                  <Link href="/announcements">View All Announcements <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="mb-16">
          <div className="flex items-center gap-4 mb-8">
            <PartyPopper className="w-8 h-8 text-accent" />
            <h2 className="text-3xl font-bold font-headline">Upcoming Events</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.slice(0, 3).map((event, index) => (
              <Card key={index} className="flex flex-col transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="font-headline text-xl">{event.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-sm pt-1">
                    <CalendarDays className="w-4 h-4" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
           <div className="text-center mt-8">
              <Button asChild variant="outline">
                  <Link href="/events">View All Events <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
          </div>
        </section>

        {/* Quick Links Section */}
        <section>
          <h2 className="text-3xl font-bold font-headline text-center mb-8">Quick Links</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {featureCards.map((card) => (
              <Link href={card.href} key={card.title} className="group">
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
                  <CardHeader className="flex flex-col items-center text-center">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                      {card.icon}
                    </div>
                    <CardTitle className="font-headline">{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
