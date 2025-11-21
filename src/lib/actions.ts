"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

// Schemas
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
