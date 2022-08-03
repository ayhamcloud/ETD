import { createTransport } from "nodemailer";
import { server } from "../config";

export async function sendEmail(email) {
  const transporter = createTransport({
    host: process.env.MAIL_URL,
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
      type: "login",
    },
  });

  const mailOptions = {
    from: "ETD - Easy Trainings Documentation <etd@ayhamcloud.de>",
    to: email,
    subject: "Verification Successful ✅",
    text: "Your email has been verified",
    html: `<p>Your email has been verified</p><br/><p>You can now login</p><a href="${server}/login">Login</a>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      console.log("Email not sent");
      return;
    } else {
      console.log("Email sent: " + info.response);
      return;
    }
  });
}
