"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { initializeFirebaseAdmin } from "@/firebase/server";
import { collection, query, where, getDocs, limit } from "firebase/firestore";

export async function getUserByUsername(username: string): Promise<{email: string} | null> {
    try {
        const { firestore } = await initializeFirebaseAdmin();
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
