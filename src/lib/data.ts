import { collection, getDocs, limit, orderBy, query } from "firebase-admin/firestore";
import type { Announcement, Event, Resource } from "./definitions";
import { initializeFirebaseAdmin } from "@/firebase/server";

export const getAnnouncements = async (count?: number): Promise<Announcement[]> => {
  const { firestore } = await initializeFirebaseAdmin();
  const announcementsRef = collection(firestore, "announcements");
  const constraints = [orderBy("date", "desc")];
  if (count) {
    constraints.push(limit(count));
  }
  const q = query(announcementsRef, ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Announcement[];
};


export const getEvents = async (count?: number): Promise<Event[]> => {
  const { firestore } = await initializeFirebaseAdmin();
  const eventsRef = collection(firestore, "events");
  const constraints = [orderBy("date", "desc")];
  if (count) {
    constraints.push(limit(count));
  }
   const q = query(eventsRef, ...constraints);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Event[];
};

export const getResources = async (): Promise<Resource[]> => {
  const { firestore } = await initializeFirebaseAdmin();
  const resourcesRef = collection(firestore, "resources");
  const querySnapshot = await getDocs(resourcesRef);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Resource[];
};
