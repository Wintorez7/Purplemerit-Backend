const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text) => {
  await resend.emails.send({
    from: "liordx76@gmail.com", // Resend default
    to,
    subject,
    text,
  });
};

module.exports = sendEmail;