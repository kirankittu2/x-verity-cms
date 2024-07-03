import nodemailer from "nodemailer";

export async function sendmail(email, otp) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "kirankittu3760@gmail.com",
      pass: "tewt kjsl xeto xppk",
    },
  });

  const info = await transporter.sendMail({
    from: "kirankittu3760@gmail.com",
    to: `${email}`,
    subject: "OTP",
    text: "One Time Password",
    html: `<b>OTP</b> ${otp}`,
  });

  console.log("Message sent: %s", info.messageId);
  return { message: true };
}
