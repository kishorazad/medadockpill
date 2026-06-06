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

        console.log(
          "✅ BREVO EMAIL SENT",
          response.data
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
          "noreply@medadock.com"
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