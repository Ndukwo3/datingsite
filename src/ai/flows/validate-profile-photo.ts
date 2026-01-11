'use server';
/**
 * @fileOverview A flow to validate a user's profile photo.
 *
 * - validateProfilePhoto - A function that checks if a photo is a valid profile picture.
 * - ValidateProfilePhotoInput - The input type for the validateProfilePhoto function.
 * - ValidateProfilePhotoOutput - The return type for the validateProfilePhoto function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateProfilePhotoInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ValidateProfilePhotoInput = z.infer<typeof ValidateProfilePhotoInputSchema>;

const ValidateProfilePhotoOutputSchema = z.object({
    isValid: z.boolean().describe('Whether the photo is a valid profile picture.'),
    reason: z.string().optional().describe('The reason the photo is not valid. Provided only if isValid is false.'),
});
export type ValidateProfilePhotoOutput = z.infer<typeof ValidateProfilePhotoOutputSchema>;

export async function validateProfilePhoto(input: ValidateProfilePhotoInput): Promise<ValidateProfilePhotoOutput> {
  return validateProfilePhotoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateProfilePhotoPrompt',
  input: {schema: ValidateProfilePhotoInputSchema},
  output: {schema: ValidateProfilePhotoOutputSchema},
  prompt: `You are an AI assistant for a dating app. Your task is to validate a user's profile picture based on the following strict criteria:
1. The photo MUST contain a human.
2. The photo MUST contain ONLY ONE person.

Analyze the provided image and determine if it meets these criteria.

If the photo is invalid, provide a brief, user-friendly reason.
- If no person is detected, the reason should be "No person was detected in the photo."
- If more than one person is detected, the reason should be "More than one person was detected in the photo."

Image: {{media url=photoDataUri}}

Return a JSON object with "isValid" (boolean) and "reason" (string, if applicable).`,
});

const validateProfilePhotoFlow = ai.defineFlow(
  {
    name: 'validateProfilePhotoFlow',
    inputSchema: ValidateProfilePhotoInputSchema,
    outputSchema: ValidateProfilePhotoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
