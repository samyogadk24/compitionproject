'use server';
/**
 * @fileOverview A flow for generating school announcements.
 *
 * - generateAnnouncements - A function that generates a list of school announcements.
 * - AnnouncementSchema - The Zod schema for a single announcement.
 * - AnnouncementsSchema - The Zod schema for a list of announcements.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnnouncementSchema = z.object({
  title: z.string().describe('The title of the announcement.'),
  date: z.string().describe('The date of the announcement in YYYY-MM-DD format.'),
  shortDescription: z.string().describe('A short, one-sentence summary of the announcement.'),
});

const AnnouncementsSchema = z.array(AnnouncementSchema);

export type Announcement = z.infer<typeof AnnouncementSchema>;

export async function generateAnnouncements(): Promise<Announcement[]> {
  return generateAnnouncementsFlow();
}

const prompt = ai.definePrompt({
  name: 'generateAnnouncementsPrompt',
  output: { schema: AnnouncementsSchema },
  prompt: `You are a school administrator responsible for keeping the school community informed. Generate a list of 5 recent and realistic school announcements.

The announcements should be diverse and cover a range of topics relevant to a school environment, such as:
- Upcoming school events (e.g., sports day, science fair, parent-teacher meetings).
- Important academic deadlines (e.g., project submissions, exam schedules).
- General school news (e.g., new facilities, policy changes, holiday schedules).
- Student achievements or club activities.

Ensure the dates are recent and plausible for the current time of year. Format the dates as YYYY-MM-DD.
The short description should be a single, concise sentence that summarizes the announcement.
`,
});

const generateAnnouncementsFlow = ai.defineFlow(
  {
    name: 'generateAnnouncementsFlow',
    outputSchema: AnnouncementsSchema,
  },
  async () => {
    const { output } = await prompt();
    return output || [];
  }
);
