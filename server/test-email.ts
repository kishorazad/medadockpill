import { sendEmail } from "./email-service";

async function testEmail() {
  try {
    console.log("📧 Starting email test...");

    const result = await sendEmail(
      "brizkishor.azad@gmail.com",
      "Zoho SMTP Test",
      `
      <h2>PillNow Email Test</h2>
      <p>If you received this email, Zoho SMTP is working correctly.</p>
      <p>Sent from 1tab.in</p>
      `
    );

    console.log("Result:", result);

    if (result) {
      console.log("✅ Email sent successfully");
    } else {
      console.log("❌ Email send failed");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Test error:", error);
    process.exit(1);
  }
}

testEmail();