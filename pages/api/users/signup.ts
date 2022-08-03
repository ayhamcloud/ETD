import { PrismaClient, User } from "@prisma/client";
import { hash } from "bcrypt";
import { createTransport } from "nodemailer";
import { sign } from "jsonwebtoken";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

declare module "jsonwebtoken" {
  export interface JwtPayload {
    userId: string;
    email: string;
    pending: boolean;
  }
}
const prisma = new PrismaClient();

export default async function signup(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    await prisma.$disconnect();
    return;
  }
  const data = req.body;
  hash(data.password, 13, async (err, hash) => {
    if (err) {
      res.status(500).send(err);
      await prisma.$disconnect();
      return;
    }

    const LowerCaseEmail = data.email.toLowerCase();
    const email = await prisma.user.findFirst({
      where: {
        email: String(LowerCaseEmail),
      },
    });
    if (data.password.length < 8) {
      res
        .status(400)
        .json({ error: "Password must be at least 8 characters long" });
      await prisma.$disconnect();
      return;
    }
    if (email !== null && email.email === LowerCaseEmail) {
      res.status(400).json({ message: "Email already exists" });
      await prisma.$disconnect();
      return;
    }

    const user = (await prisma.user.create({
      data: {
        email: LowerCaseEmail,
        passwort: hash,
        name: data.name,
      },
    })) as User;

    await prisma.$disconnect();
    const token = sign(
      { userId: user.id, pending: true },
      process.env.JWT_SECRET || "",
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
        maxAge: 3600 * 5,
        path: "/",
      })
    );
    send_email(token, user, req);
    res.status(200).json({
      user: { name: user.name, email: user.email, createdAt: user.createdAt },
      created: true,
    });
  });
}

async function send_email(token: string, user: User, req: NextApiRequest) {
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
    subject: "Verify your email ⏰",
    html: `Hello ${user.name},<br><br>Please verify your email by clicking on the link: <br><a href="http://${req.headers.host}/verification/check-email?token=${token}">Verfication Link</a><br><br>`,
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
