"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { useFirestore } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Please enter a valid email."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type FormData = z.infer<typeof ContactSchema>;
type FormErrors = { [key in keyof FormData]?: string[] };

export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const firestore = useFirestore();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const validatedFields = ContactSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      toast({
        title: "Error",
        description: "Please check the form for errors.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!firestore) {
      toast({
        title: "Error",
        description: "Database not available. Please try again later.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const messagesCollection = collection(firestore, 'contactMessages');
      await addDoc(messagesCollection, {
        ...validatedFields.data,
        sentDate: serverTimestamp(),
      });

      toast({
        title: "Success!",
        description: "Your message has been sent successfully!",
      });
      formRef.current?.reset();
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Uh oh! Something went wrong.",
        description: "Could not send your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="John Doe" required />
          {errors.name && (
            <p className="text-sm font-medium text-destructive">
              {errors.name[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
          />
          {errors.email && (
            <p className="text-sm font-medium text-destructive">
              {errors.email[0]}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Your message..."
          className="min-h-[120px]"
          required
        />
        {errors.message && (
          <p className="text-sm font-medium text-destructive">
            {errors.message[0]}
          </p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
