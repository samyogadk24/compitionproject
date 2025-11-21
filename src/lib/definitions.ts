export type Announcement = {
  id: string;
  title: string;
  date: string;
  description: string;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  description: string;
};

export type Resource = {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
};

export type Student = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string;
};
