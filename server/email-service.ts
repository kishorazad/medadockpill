
import axios from "axios";


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

export async function sendPasswordResetConfirmation(
  email: string
): Promise<boolean> {
  return sendEmail(
    email,
    "Password Reset Successful",
    "Your password has been changed successfully.",
    `
      <h2>Password Reset Successful</h2>
      <p>Your password has been changed successfully.</p>
    `
  );
}

export async function sendPasswordResetToken(
  email: string,
  token: string
): Promise<boolean> {
  return sendEmail(
    email,
    "Password Reset Link",
    `Reset Token: ${token}`,
    `
      <h2>Password Reset</h2>
      <p>Your reset token is:</p>
      <h3>${token}</h3>
    `
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
export async function sendAppointmentConfirmation(
  email: string,
  appointmentData: any
): Promise<boolean> {
  return sendEmail(
    email,
    "Appointment Confirmed",
    "Your appointment has been confirmed",
    `<h2>Appointment Confirmed</h2>`
  );
}

export async function sendOrderConfirmation(
  email: string,
  orderData: any
): Promise<boolean> {
  return sendEmail(
    email,
    "Order Confirmation",
    "Your order has been placed successfully",
    `<h2>Order Confirmation</h2>`
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
    to: [{ email: to }],
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

console.log("✅ BREVO EMAIL SENT", response.data);

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