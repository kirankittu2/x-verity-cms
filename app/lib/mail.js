import nodemailer from "nodemailer";

export async function sendmail(email, otp) {
  const transporter = nodemailer.createTransport({
    host: "mail.qcentrio.com",
    port: 465,
    secure: true,
    auth: {
      user: "qcadmin",
      pass: `Dj"Hi4PaJt9Kt_^`,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: "qcadmin@180.133.167.72.host.secureserver.net",
    to: `${email}`,
    subject: "OTP",
    text: "One Time Password",
    html: `<b>OTP</b> ${otp}`,
  });

  console.log("Message sent: %s", info.messageId);
  return { message: true };
}
