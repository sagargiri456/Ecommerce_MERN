const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_FORM_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

module.exports = sendEmail;

const message = {
  from: `${process.env.SMTP_FROM_NAME}<${process.env.SMTP_FORM_EMAIL}>`,
  to: options.subject,
  text: options.message,
};

await transporter.sendEmail(message);
