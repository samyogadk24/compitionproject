import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import type { Announcement, Event, Resource } from "./definitions";
import { getSdks } from "@/firebase";

// This file is now primarily for type definitions and fallback data.
// The main data fetching logic has been moved to the components
// that use it to leverage real-time updates from Firestore.

export const getAnnouncements = async (firestore: any): Promise<Announcement[]> => {
  const announcementsRef = collection(firestore, "announcements");
  const q = query(announcementsRef, orderBy("date", "desc"), limit(5));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Announcement[];
};


export const getEvents = async (firestore: any): Promise<Event[]> => {
  const eventsRef = collection(firestore, "events");
   const q = query(eventsRef, orderBy("date", "desc"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Event[];
};

export const getResources = async (firestore: any): Promise<Resource[]> => {
  const resourcesRef = collection(firestore, "resources");
  const querySnapshot = await getDocs(resourcesRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Resource[];
};
