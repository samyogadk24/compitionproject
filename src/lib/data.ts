import type { Announcement, Event, Resource } from "./definitions";

const announcements: Announcement[] = [
  {
    id: "1",
    title: "Welcome Back to School!",
    date: "2023-09-01",
    description: "We are excited to welcome all students back for the new academic year. Please check the updated schedules.",
  },
  {
    id: "2",
    title: "Parent-Teacher Conferences",
    date: "2023-10-15",
    description: "Sign-ups for parent-teacher conferences are now open. Meetings will be held in the main hall.",
  },
  {
    id: "3",
    title: "School Library Renovation",
    date: "2023-11-05",
    description: "The school library will be closed for renovation from November 10th to December 1st. Online resources remain available.",
  },
];

const events: Event[] = [
  {
    id: "1",
    title: "Annual Science Fair",
    date: "2023-09-20",
    description: "Join us for the annual science fair where students showcase their innovative projects. Open to all families.",
  },
  {
    id: "2",
    title: "School Play: A Midsummer Night's Dream",
    date: "2023-11-18",
    description: "The drama club presents its fall production. Tickets are available in the school office.",
  },
  {
    id: "3",
    title: "Winter Holiday Concert",
    date: "2023-12-15",
    description: "Celebrate the season with performances from our talented school band and choir.",
  },
];

const resources: Resource[] = [
  {
    id: "1",
    title: "Student Handbook 2023-2024",
    description: "The official guide to school policies, rules, and student conduct.",
    fileUrl: "#",
  },
  {
    id: "2",
    title: "Academic Calendar",
    description: "Key dates for the academic year, including holidays and exam periods.",
    fileUrl: "#",
  },
  {
    id: "3",
    title: "Library Resource Guide",
    description: "A guide on how to use the online library and access digital resources.",
    fileUrl: "#",
  },
];

export const getAnnouncements = async (): Promise<Announcement[]> => {
  // In a real app, you'd fetch this from Firestore
  return new Promise(resolve => setTimeout(() => resolve(announcements), 500));
};

export const getEvents = async (): Promise<Event[]> => {
  // In a real app, you'd fetch this from Firestore
  return new Promise(resolve => setTimeout(() => resolve(events), 500));
};

export const getResources = async (): Promise<Resource[]> => {
  // In a real app, you'd fetch this from Firestore/Storage
  return new Promise(resolve => setTimeout(() => resolve(resources), 500));
};
