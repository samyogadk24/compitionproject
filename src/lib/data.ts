import type { Announcement, Event, Resource } from "./definitions";
import { initializeFirebaseAdmin } from "@/firebase/server";
import type { OrderByDirection } from "firebase-admin/firestore";

export const getAnnouncements = async (count?: number): Promise<Announcement[]> => {
  const { firestore } = await initializeFirebaseAdmin();
  let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = firestore.collection("announcements").orderBy("date", "desc" as OrderByDirection);

  if (count) {
    query = query.limit(count);
  }

  const querySnapshot = await query.get();
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Announcement[];
};


export const getEvents = async (count?: number): Promise<Event[]> => {
  const { firestore } = await initializeFirebaseAdmin();
  let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = firestore.collection("events").orderBy("date", "desc" as OrderByDirection);
  
  if (count) {
    query = query.limit(count);
  }

  const querySnapshot = await query.get();
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Event[];
};

export const getResources = async (): Promise<Resource[]> => {
  const { firestore } = await initializeFirebaseAdmin();
  const resourcesRef = firestore.collection("resources");
  const querySnapshot = await resourcesRef.get();
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Resource[];
};
