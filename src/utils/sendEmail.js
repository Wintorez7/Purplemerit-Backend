const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev", // Default sender
      to,
      subject,
      text,
    });
    console.log("Email sent successfully!");
  } catch (err) {
    console.log("Email sending failed:", err);
    throw err;
  }
};

module.exports = sendEmail;
