import { PrismaClient, User } from "@prisma/client";
import { hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

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

    const user = await prisma.user.create({
      data: {
        email: LowerCaseEmail,
        passwort: hash,
        name: data.name,
      },
    }) as User;

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
  });
}
