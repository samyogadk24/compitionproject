"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { initializeFirebase } from "@/firebase/index";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

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

export async function getUserByUsername(username: string): Promise<{email: string} | null> {
    try {
        const { firestore } = initializeFirebase();
        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where("username", "==", username), limit(1));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        const userDoc = querySnapshot.docs[0];
        return { email: userDoc.data().email };
    } catch (error) {
        console.error("Error fetching user by username:", error);
        return null;
    }
}

    