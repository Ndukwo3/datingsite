'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/harassment-detection.ts';
import '@/ai/flows/suggested-preferences.ts';
import '@/ai/flows/validate-profile-photo.ts';
