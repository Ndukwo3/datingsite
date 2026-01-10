
import { z } from 'genkit';

/**
 * @fileOverview Schemas and types for the send-otp-flow.
 *
 * - SendOtpInput - The input type for the sendOtp function.
 * - SendOtpOutput - The return type for the sendOtp function.
 */

export const SendOtpInputSchema = z.object({
  identifier: z.string().describe('The email or phone number to send the OTP to.'),
  otp: z.string().length(4).describe('The 4-digit one-time password.'),
});
export type SendOtpInput = z.infer<typeof SendOtpInputSchema>;

export const SendOtpOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
export type SendOtpOutput = z.infer<typeof SendOtpOutputSchema>;

    