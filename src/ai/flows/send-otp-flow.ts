
'use server';
/**
 * @fileOverview A flow for sending a one-time password (OTP) to a user's email or WhatsApp.
 *
 * - sendOtp - A function that handles sending the OTP.
 */

import { ai } from '@/ai/genkit';
import { SendOtpInputSchema, SendOtpOutputSchema, type SendOtpInput, type SendOtpOutput } from './send-otp-schema';


export async function sendOtp(input: SendOtpInput): Promise<SendOtpOutput> {
  return sendOtpFlow(input);
}

const sendOtpFlow = ai.defineFlow(
  {
    name: 'sendOtpFlow',
    inputSchema: SendOtpInputSchema,
    outputSchema: SendOtpOutputSchema,
  },
  async ({ identifier, otp }) => {
    const isEmail = identifier.includes('@');
    const service = isEmail ? 'email' : 'WhatsApp';

    console.log(`Simulating OTP send to ${service} at ${identifier}. Code: ${otp}`);

    // !! IMPORTANT !!
    // In a real application, you would integrate an email or SMS/WhatsApp service here.
    //
    // For WhatsApp, using a service like Twilio:
    //
    // 1. Install the Twilio helper library: `npm install twilio`
    // 2. Make sure you have your Account SID, Auth Token, and a Twilio phone number.
    //
    // Example with Twilio for WhatsApp:
    //
    // import twilio from 'twilio';
    //
    // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    //
    // try {
    //   if (!isEmail) {
    //      await client.messages.create({
    //        body: `Your LinkUp9ja verification code is ${otp}`,
    //        from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
    //        to: `whatsapp:${identifier}` // Make sure identifier is a full phone number with country code
    //      });
    //   } else {
    //      // Add your email sending logic here (e.g., SendGrid, AWS SES)
    //   }
    //   return { success: true, message: `OTP has been sent to your ${service}.` };
    // } catch (error) {
    //   console.error(`Failed to send OTP via ${service}:`, error);
    //   return { success: false, message: `Failed to send OTP via ${service}.` };
    // }

    return { success: true, message: `OTP has been sent to your ${service}.` };
  }
);
