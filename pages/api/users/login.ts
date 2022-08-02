import { PrismaClient, User } from "@prisma/client";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import cookie from "cookie";

const prisma = new PrismaClient();

export default async function login(req, res) {
  if (req.method !== "POST") {
    await prisma.$disconnect();
    res.status(405).send("Method not allowed");
    return;
  }
  const LowerCaseEmail = req.body.email.toLowerCase();
  const user = (await prisma.user.findUnique({
    where: {
      email: LowerCaseEmail,
    },
  })) as User;
  if (!user) {
    res.status(400).json({ error: "Email or password is incorrect" });
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

  compare(req.body.password, user.passwort, async (err, result) => {
    if (!result) {
      res.status(400).json({ error: "Email or password is incorrect" });
      await prisma.$disconnect();
      return;
    }

    if (!err && result) {
      const token = sign(
        { userId: user.id, email: user.email },
        (process as any).env.JWT_SECRET,
        {
          expiresIn: "5h",
        }
      );
      res.setHeader("Set-Cookie", [
        cookie.serialize("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 3600 * 5,
          path: "/",
        }),
        cookie.serialize("uname", user.name, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 3600 * 5,
          path: "/",
        }),
      ]);
      await prisma.$disconnect();
      res.status(200).json({
        name: user.name,
        loggedIn: true,
      });
    }
  });
  await prisma.$disconnect();
}
