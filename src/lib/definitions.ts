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
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
};
