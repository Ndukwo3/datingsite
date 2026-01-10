'use server';

/**
 * @fileOverview Detects harassing messages using AI.
 *
 * - detectHarassment - A function that detects harassing messages.
 * - HarassmentDetectionInput - The input type for the detectHarassment function.
 * - HarassmentDetectionOutput - The return type for the detectHarassment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const HarassmentDetectionInputSchema = z.object({
  message: z.string().describe('The message to check for harassment.'),
});
export type HarassmentDetectionInput = z.infer<typeof HarassmentDetectionInputSchema>;

const HarassmentDetectionOutputSchema = z.object({
  isHarassment: z.boolean().describe('Whether the message is harassing or not.'),
  reason: z.string().optional().describe('The reason why the message is considered harassing, if any.'),
});
export type HarassmentDetectionOutput = z.infer<typeof HarassmentDetectionOutputSchema>;

export async function detectHarassment(input: HarassmentDetectionInput): Promise<HarassmentDetectionOutput> {
  return detectHarassmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'harassmentDetectionPrompt',
  input: {schema: HarassmentDetectionInputSchema},
  output: {schema: HarassmentDetectionOutputSchema},
  prompt: `You are a tool that helps to identify harassment in messages.

You will be given a message and you will determine if it is harassing or not.

Message: {{{message}}}

Output a JSON object with an "isHarassment" boolean field and a "reason" string field. The reason should only be populated if isHarassment is true.
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const detectHarassmentFlow = ai.defineFlow(
  {
    name: 'detectHarassmentFlow',
    inputSchema: HarassmentDetectionInputSchema,
    outputSchema: HarassmentDetectionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
