export type Announcement = {
  id: string;
  title: string;
  date: string;
  shortDescription: string;
  content?: string;
  authorId: string;
};

export type Event = {
  id: string;
  title: string;
  date: string;
  description: string;
  authorId: string;
};

export type Resource = {
  id: string;
  name: string;
  description: string;
  fileUrl: string;
};

export type UserProfile = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string | null;
  role: 'student' | 'teacher';
};

    