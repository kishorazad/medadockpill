
import axios from "axios";

import type { Transporter } from 'nodemailer';

export async function sendPasswordResetOTP(
  email: string,
  otp: string
): Promise<boolean> {
  return sendEmail(
    email,
    "Password Reset OTP",
    `Your OTP is ${otp}`,
    `<h2>Your OTP is ${otp}</h2>`
  );
}

export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<boolean> {
  return sendEmail(
    email,
    "Welcome to MedaDock",
    `Welcome ${name}`,
    `<h1>Welcome ${name}</h1>`
  );
}

export async function sendLoginOTP(
  email: string,
  otp: string
): Promise<boolean> {
  return sendEmail(
    email,
    "Login OTP",
    `Your OTP is ${otp}`,
    `<h2>Your OTP is ${otp}</h2>`
  );
}

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<boolean> {
  try {
    const timestamp = new Date().toISOString();

    console.log(
      `📧 [${timestamp}] EMAIL REQUEST: ${to} | ${subject}`
    );

    // ==========================
    // BREVO PRIMARY
    // ==========================
    if (process.env.BREVO_API_KEY) {
      try {
        console.log(
          `📧 [${timestamp}] BREVO: Sending email`
        );

        const response = await axios.post(
          "https://api.brevo.com/v3/smtp/email",
          {
            sender: {
              name: "MedaDock",
              email: process.env.SENDER_EMAIL,
            },
            to: [
              {
                email: to,
              },
            ],
            subject,
            htmlContent: html || text,
          },
          {
            headers: {
              accept: "application/json",
              "api-key": process.env.BREVO_API_KEY,
              "content-type": "application/json",
            },
          }
        );

        console.error(
  "❌ BREVO ERROR",
  error.response?.data || error.message
);

        return true;
      } catch (error: any) {
        console.error(
          "❌ BREVO ERROR",
          error.response?.data || error.message
        );
      }
    }

    // ==========================
    // ZOHO FALLBACK
    // ==========================
    if (
      process.env.ZOHOMAIL_USERNAME &&
      zohoTransporter
    ) {
      console.log(
        `📧 [${timestamp}] FALLBACK TO ZOHO`
      );

      return await sendWithZohoMail(
        to,
        subject,
        text,
        html,
        process.env.ZOHOMAIL_USERNAME
      );
    }

    // ==========================
    // SENDGRID FALLBACK
    // ==========================
    if (
      process.env.SENDGRID_API_KEY &&
      sendgridInitialized
    ) {
      console.log(
        `📧 [${timestamp}] FALLBACK TO SENDGRID`
      );

      return await sendWithSendGrid(
        to,
        subject,
        text,
        html,
        process.env.EMAIL_FROM ||
          process.env.SENDER_EMAIL ||
          "info@1tab.in"
      );
    }

    console.error(
      "❌ NO EMAIL PROVIDER AVAILABLE"
    );

    return false;
  } catch (error) {
    console.error(
      "❌ EMAIL SERVICE ERROR",
      error
    );

    return false;
  }
}

export function generateOTP(length: number = 6): string {
  const digits = "0123456789";
  let otp = "";

  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  return otp;
}