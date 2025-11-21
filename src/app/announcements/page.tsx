import { getAnnouncements } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CalendarDays, Megaphone } from "lucide-react";
import AddAnnouncementForm from "./_components/add-announcement-form";

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

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

        <div className="grid gap-12 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="space-y-6">
              {announcements.map((announcement) => (
                <Card key={announcement.id} className="transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="font-headline">{announcement.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-sm">
                      <CalendarDays className="w-4 h-4" />
                      <span>{new Date(announcement.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{announcement.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div className="md:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-headline">Admin</CardTitle>
                <CardDescription>
                  Add a new announcement to the list.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible>
                  <AccordionItem value="add-announcement">
                    <AccordionTrigger className="text-base">
                      Add New Announcement
                    </AccordionTrigger>
                    <AccordionContent>
                      <AddAnnouncementForm />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
