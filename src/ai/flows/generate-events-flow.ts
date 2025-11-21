'use server';
/**
 * @fileOverview A flow for generating school events.
 *
 * - generateEvents - A function that generates a list of school events.
 * - EventSchema - The Zod schema for a single event.
 * - EventsSchema - The Zod schema for a list of events.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EventSchema = z.object({
  title: z.string().describe('The title of the event.'),
  date: z.string().describe('The date of the event in YYYY-MM-DD format.'),
  description: z.string().describe('A detailed description of the event, including time, location, and what to expect. Should be 2-3 sentences long.'),
});

const EventsSchema = z.array(EventSchema);

export type Event = z.infer<typeof EventSchema>;

export async function generateEvents(): Promise<Event[]> {
  return generateEventsFlow();
}

const prompt = ai.definePrompt({
  name: 'generateEventsPrompt',
  output: { schema: EventsSchema },
  prompt: `You are a school event coordinator. Generate a list of 5 upcoming and realistic school events.

The events should be diverse and cover a range of activities relevant to a school environment, such as:
- Sports competitions (e.g., Annual Sports Day, Inter-House Basketball Tournament).
- Academic events (e.g., Science Fair, Math Olympiad, Guest Lecture).
- Arts and culture (e.g., School Play, Art Exhibition, Music Concert).
- Community and social events (e.g., Parent-Teacher Meeting, Charity Bake Sale, School Carnival).

Ensure the dates are recent and plausible for the current time of year. Format the dates as YYYY-MM-DD.
The description should be detailed, including a time, location, and what to expect. It should be 2-3 sentences long.
`,
});

const generateEventsFlow = ai.defineFlow(
  {
    name: 'generateEventsFlow',
    outputSchema: EventsSchema,
  },
  async () => {
    const { output } = await prompt();
    return output || [];
  }
);
