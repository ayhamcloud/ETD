import { PrismaClient, User } from "@prisma/client";
import { sign, verify, JwtPayload } from "jsonwebtoken";
import { hash } from "bcrypt";
import cookie from "cookie";
import { createTransport } from "nodemailer";
import { NextApiResponse, NextApiRequest } from "next";

const prisma = new PrismaClient();

export default async function login(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    await prisma.$disconnect();
    res.status(405).send("Method not allowed");
    return;
  }

  if (!req.body.password) {
    const user = (await prisma.user.findUnique({
      where: {
        email: req.body.email.toLowerCase(),
      },
    })) as User;
    if (!user) {
      res.status(400).json({ error: "Email is incorrect" });
      await prisma.$disconnect();
      return;
    }

    if (user.pending === true) {
      res.status(403).json({
        error: "Your Account is not verified - Please check your inbox",
      });
      await prisma.$disconnect();
      return;
    }
    const token = sign(
      { userId: user.id, resetpw: true },
      process.env.JWT_SECRET,
      {
        expiresIn: "30m",
      }
    );
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 60,
        path: "/",
      })
    );
    send_email(token, user, req);
    res.status(200).json({
      user: { name: user.name, email: user.email },
    });
    console.log("Email sent");
    await prisma.$disconnect();
    return;
  } else {
    const token = req.headers.token;
    console.log(token);
    const decoded = verify((token as any), process.env.JWT_SECRET) as JwtPayload;
    const user = (await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    })) as User;
    if (user.updatedAt > new Date((decoded as any).iat * 1000)) {
      res.status(400).json({ error: "Token expired" });
      await prisma.$disconnect();
      return;
    }
    const password_hash = await hash(req.body.password, 13);
    console.log(password_hash, req.body.password);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwort: password_hash,
      },
    });
    res.status(200).json({
      user: { name: user.name, email: user.email },
      updated: true,
    });
  }

  await prisma.$disconnect();
  return;
}

async function send_email(token, user, req) {
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
    to: user.email,
    subject: "Reset your password 🛠️",
    html: `Hello ${user.name},<br><br>To reset your password click on the link: <br><a href="http://${req.headers.host}/reset-password?token=${token}">Reset Link</a><br><br>`,
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
