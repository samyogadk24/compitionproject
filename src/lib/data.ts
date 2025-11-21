import type { Announcement, Event, Resource } from "./definitions";
import { initializeFirebaseAdmin } from "@/firebase/server";
import type { OrderByDirection } from "firebase-admin/firestore";

export const getAnnouncements = async (count?: number): Promise<Announcement[]> => {
  // This function is being cleared to prevent server-side execution errors.
  // Public pages will use AI-generated content, and authenticated pages will use client-side fetching.
  return [];
};

export const getEvents = async (count?: number): Promise<Event[]> => {
  // This function is being cleared to prevent server-side execution errors.
  // Public pages will use AI-generated content, and authenticated pages will use client-side fetching.
  return [];
};

export const getResources = async (): Promise<Resource[]> => {
  const { firestore } = await initializeFirebaseAdmin();
  const resourcesRef = firestore.collection("resources");
  const querySnapshot = await resourcesRef.get();
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Resource[];
};
