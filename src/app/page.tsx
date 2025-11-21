import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, Library, Megaphone } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const featureCards = [
  {
    title: "Announcements",
    description: "Latest news and updates.",
    href: "/announcements",
    icon: <Megaphone className="w-8 h-8 text-primary" />,
  },
  {
    title: "Events",
    description: "Upcoming school events.",
    href: "/events",
    icon: <CalendarDays className="w-8 h-8 text-primary" />,
  },
  {
    title: "Student Resources",
    description: "Access documents and links.",
    href: "/dashboard",
    icon: <Library className="w-8 h-8 text-primary" />,
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === "hero-school");

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
            SchoolPulse
          </h1>
          <p className="mt-4 text-xl text-muted-foreground">
            Stay Connected. Stay Updated.
          </p>
        </div>
      </section>

      <section className="flex-1 w-full max-w-6xl mx-auto py-12 px-4 md:px-6">
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
                  <div className="mt-4 text-sm font-semibold text-primary flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn More <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
