
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Mail, MapPin, Phone, Clock, Building } from "lucide-react";
import ContactForm from "./_components/contact-form";

export default function ContactPage() {
  const mapImage = PlaceHolderImages.find((img) => img.id === "contact-map");

  return (
    <div className="flex-1 bg-background">
      <div className="container mx-auto py-12 px-4 md:px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-headline">Contact Us</h1>
          <p className="text-muted-foreground mt-2">
            We're here to help. Reach out to us with any questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
                <CardDescription>
                  Our team will get back to you within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-muted-foreground">
                      123 Education Lane,
                      <br />
                      Knowledge City, 12345
                    </p>
                  </div>
                </div>
                 <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Office Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 8:00 AM - 4:00 PM
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-muted-foreground">(123) 456-7890</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                   <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">contact@schoolpulse.edu</p>
                  </div>
                </div>
                 <div className="flex items-start gap-4">
                  <Building className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                   <div>
                    <h3 className="font-semibold">Departments</h3>
                    <ul className="text-muted-foreground text-sm list-disc pl-5">
                        <li>Admissions: admissions@schoolpulse.edu</li>
                        <li>General Inquiry: info@schoolpulse.edu</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
            {mapImage && (
              <div className="rounded-lg overflow-hidden shadow-md">
                <Image
                  src={mapImage.imageUrl}
                  alt={mapImage.description}
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                  data-ai-hint={mapImage.imageHint}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
