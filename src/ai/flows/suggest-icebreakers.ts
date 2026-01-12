'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting icebreaker messages based on two user profiles.
 *
 * The flow takes profile information for two users as input and returns three suggested icebreaker messages.
 * - suggestIcebreakers - A function that suggests icebreakers.
 * - SuggestIcebreakersInput - The input type for the suggestIcebreakers function.
 * - SuggestIcebreakersOutput - The return type for the suggestIcebreakers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UserProfileSchema = z.object({
  name: z.string().describe('The name of the user.'),
  bio: z.string().describe('A short biography of the user.'),
  interests: z.array(z.string()).describe("A list of the user's interests."),
  job: z.string().optional().describe("The user's job."),
});

const SuggestIcebreakersInputSchema = z.object({
  currentUser: UserProfileSchema.describe("The profile of the user who will be sending the message."),
  matchedUser: UserProfileSchema.describe("The profile of the user who will be receiving the message."),
});
export type SuggestIcebreakersInput = z.infer<typeof SuggestIcebreakersInputSchema>;

const SuggestIcebreakersOutputSchema = z.object({
  icebreakers: z.array(z.string()).length(3).describe('A list of exactly three suggested icebreaker messages.'),
});
export type SuggestIcebreakersOutput = z.infer<typeof SuggestIcebreakersOutputSchema>;

export async function suggestIcebreakers(input: SuggestIcebreakersInput): Promise<SuggestIcebreakersOutput> {
  return suggestIcebreakersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestIcebreakersPrompt',
  input: {schema: SuggestIcebreakersInputSchema},
  output: {schema: SuggestIcebreakersOutputSchema},
  prompt: `You are an AI assistant for a dating app called LinkUp9ja. Your task is to generate three creative, engaging, and personalized icebreaker messages for a user to send to their new match.

Analyze the profiles of both the current user and their match. The icebreakers should be based on shared interests, unique details in their bios, their jobs, or anything that could spark a fun and meaningful conversation. Avoid generic questions.

Current User's Profile:
- Name: {{{currentUser.name}}}
- Bio: "{{{currentUser.bio}}}"
- Interests: {{#each currentUser.interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Job: {{{currentUser.job}}}

Matched User's Profile:
- Name: {{{matchedUser.name}}}
- Bio: "{{{matchedUser.bio}}}"
- Interests: {{#each matchedUser.interests}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Job: {{{matchedUser.job}}}

Generate three distinct icebreaker messages for {{{currentUser.name}}} to send to {{{matchedUser.name}}}. The tone should be friendly, confident, and slightly playful. Frame them as if the current user is speaking.
`,
});

const suggestIcebreakersFlow = ai.defineFlow(
  {
    name: 'suggestIcebreakersFlow',
    inputSchema: SuggestIcebreakersInputSchema,
    outputSchema: SuggestIcebreakersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
