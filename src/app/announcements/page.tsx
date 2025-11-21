import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarDays, Megaphone } from "lucide-react";
import { generateAnnouncements } from "@/ai/flows/generate-announcements-flow";

export default async function AnnouncementsPage() {
  const announcements = await generateAnnouncements();

  return (
    <div className="flex-1 bg-background">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="flex items-center gap-4 mb-8">
          <Megaphone className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-4xl font-bold font-headline">Announcements</h1>
            <p className="text-muted-foreground">
              Stay up-to-date with the latest school news.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {announcements.map((announcement, index) => (
            <Card key={index} className="transition-shadow hover:shadow-md">
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
      </div>
    </div>
  );
}
