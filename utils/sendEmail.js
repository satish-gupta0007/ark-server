import nodeMailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: process.env.SMTP_HOST,       // use for custom SMTP
      port: process.env.SMTP_PORT,
      secure: false,                     // true if using port 465
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    tls: {
    rejectUnauthorized: false, // avoid "self signed cert" issues
  },
    });

    await transporter.verify();
console.log('transporter.verify();',transporter.verify())
    const options = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject,
      html: message,
    };

    await transporter.sendMail(options);
  } catch (error) {
    console.error("Email send error:", error);
  }
};
