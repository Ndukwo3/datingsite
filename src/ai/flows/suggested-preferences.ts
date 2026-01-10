'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting user preferences based on profile information.
 *
 * The flow takes user profile information as input and returns a list of suggested preferences.
 * - suggestPreferences - A function that suggests preferences based on profile information.
 * - SuggestedPreferencesInput - The input type for the suggestPreferences function.
 * - SuggestedPreferencesOutput - The return type for the suggestPreferences function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestedPreferencesInputSchema = z.object({
  bio: z.string().describe('A short biography of the user.'),
  interests: z.string().describe('A comma-separated list of the user\'s interests.'),
  location: z.string().describe('The user\'s current location.'),
  age: z.number().describe('The age of the user.')
});
export type SuggestedPreferencesInput = z.infer<typeof SuggestedPreferencesInputSchema>;

const SuggestedPreferencesOutputSchema = z.object({
  suggestedPreferences: z.array(
    z.string().describe('A suggested preference for the user.')
  ).describe('A list of suggested preferences based on the user\'s profile information.')
});
export type SuggestedPreferencesOutput = z.infer<typeof SuggestedPreferencesOutputSchema>;

export async function suggestPreferences(input: SuggestedPreferencesInput): Promise<SuggestedPreferencesOutput> {
  return suggestedPreferencesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPreferencesPrompt',
  input: {schema: SuggestedPreferencesInputSchema},
  output: {schema: SuggestedPreferencesOutputSchema},
  prompt: `You are an AI assistant designed to suggest user preferences for a dating app.

  Given the following information about a new user, suggest a list of preferences that they might have.
  The preferences should be related to hobbies, interests, and activities.
  Format the preferences as a list of strings.

  User Bio: {{{bio}}}
  User Interests: {{{interests}}}
  User Location: {{{location}}}
  User Age: {{{age}}}

  Suggested Preferences:`, 
});

const suggestedPreferencesFlow = ai.defineFlow(
  {
    name: 'suggestedPreferencesFlow',
    inputSchema: SuggestedPreferencesInputSchema,
    outputSchema: SuggestedPreferencesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
