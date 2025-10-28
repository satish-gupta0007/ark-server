import nodeMailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
  try {
  //   const transporter = nodeMailer.createTransport({
  //     host: process.env.SMTP_HOST,       // use for custom SMTP
  //     port: process.env.SMTP_PORT,
  //     secure: false,                     // true if using port 465
  //     auth: {
  //       user: process.env.SMTP_MAIL,
  //       pass: process.env.SMTP_PASSWORD,
  //     },
  //   tls: {
  //   rejectUnauthorized: false, // avoid "self signed cert" issues
  // },
  //   });
   const transporter = nodeMailer.createTransport({
      host:'smtp.zoho.in',       // use for custom SMTP
      port: 465,
      secure: true,                     // true if using port 465
      auth: {
        user: '91-9898031481_239@zohomail.in',
        pass: 'GpgMdvzRgxQ6',
      }
    });

    await transporter.verify();
console.log('transporter.verify();',await transporter.verify())
    const options = {
      from: '91-9898031481_239@zohomail.in',
      to: email,
      subject,
      html: message,
    };

    await transporter.sendMail(options);
  } catch (error) {
    console.error("Email send error:", error);
  }
};
