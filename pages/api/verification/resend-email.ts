import { PrismaClient, User } from "@prisma/client";
import { createTransport } from "nodemailer";
import { decode, JwtPayload } from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function resendEmail(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    await prisma.$disconnect();
    return;
  }
  const { token } = req.cookies;
  if (!token) {
    await prisma.$disconnect();
    res.status(400).json({ error: "cookie verkackt" });
    return;
  }

  const decoded = decode(token) as JwtPayload;
  if (!decoded) {
    await prisma.$disconnect();
    res.status(400).json({ error: "cookie verkackt" });
    return;
  }
  const uid = decoded.userId;
  const user = await prisma.user.findUnique({
    where: {
      id: uid,
    },
    select: {
      id: true,
      email: true,
      name: true,
      pending: true,
    },
  });
  if (user === null || user.pending === false) {
    res.status(400).json({ message: "Error" });
    await prisma.$disconnect();
    return;
  }
  if (user) {
    send_email(token, user, req);
  }
  res.status(200).json({ message: "Email sent" });
}

async function send_email(token, user, req) {
  const transporter = createTransport({
    host: process.env.MAIL_URL,
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: "ETD - Easy ETD Documentation <etd@ayhamcloud.de>",
    to: user.email,
    subject: "Verify your email ⏰",
    html: `Hello ${user.name},<br><br>Please verify your email by clicking on the link: <br><a href="http://${req.headers.host}/verification/check-email?token=${token}">Verfication Link</a><br><br>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return;
    } else {
      return;
    }
  });
}
