import {genkit} from 'genkit';
import {googleAI} from '@genkist-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-1.5-flash',
});
