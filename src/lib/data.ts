import type { Announcement, Event, Resource } from "./definitions";
import { initializeFirebaseAdmin } from "@/firebase/server";
import type { OrderByDirection } from "firebase-admin/firestore";

export const getAnnouncements = async (count?: number): Promise<Announcement[]> => {
  return [];
};


export const getEvents = async (count?: number): Promise<Event[]> => {
  return [];
};

export const getResources = async (): Promise<Resource[]> => {
  const { firestore } = await initializeFirebaseAdmin();
  const resourcesRef = firestore.collection("resources");
  const querySnapshot = await resourcesRef.get();
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Resource[];
};
