"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Schemas
const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

const AnnouncementSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
});

const ContactSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Please enter a valid email."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export type State = {
  errors?: {
    [key: string]: string[] | undefined;
  };
  message?: string | null;
};

// Actions
export async function login(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = LoginSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid fields. Failed to login.",
    };
  }

  // In a real app, you'd authenticate with Firebase Auth
  console.log("Logging in with:", validatedFields.data);
  // Simulate successful login
  redirect("/dashboard");
}

export async function addAnnouncement(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = AnnouncementSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid fields. Failed to add announcement.",
    };
  }

  // In a real app, you'd save this to Firestore
  console.log("Adding announcement:", validatedFields.data);

  revalidatePath("/announcements");
  revalidatePath("/dashboard");

  return { message: "Announcement added successfully!" };
}

export async function submitContactForm(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = ContactSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid fields. Failed to send message.",
    };
  }
  
  // In a real app, you'd save this to Firestore
  console.log("Submitting contact form:", validatedFields.data);

  revalidatePath("/contact");
  return { message: "Your message has been sent successfully!" };
}
