import { PrismaClient } from "@prisma/client";
import { decode, JwtPayload } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
    await prisma.$disconnect();
    return;
  }

  // get token and decode it
  const token = req.cookies.token;
  const decoded_token = decode(token!) as JwtPayload;
  const uid = decoded_token?.userId;
  console.log(uid);
  // check if user exists
  const user = await prisma.user.findUnique({
    where: {
      id: uid,
    },
    select: {
      id: true,
      name: true,
      email: true,
      passwort: false,
      pending: true,
      sessions: {
        select: {
          id: true,
          exercises: true,
        },
      },
    },
  });

  if (!user) {
    res.status(404).json({
      error: "User not found",
    });
    await prisma.$disconnect();
    return;
  }

  await prisma.$disconnect();
  res.status(200).json(user);
}
