import { PrismaClient } from "@prisma/client";
import { authenticated } from "../../../middlewares/auth";
import { decode, JwtPayload } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default authenticated(async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { skip, take } = req.query;
  let takeInt = (take as any) === 0 || (take as any) > 50 || !take ? 10 : parseInt(take as any);
  let skipInt = (skip as any) === 0 || !skip || (skip as any) > takeInt ? 0 : parseInt(skip as any);
  const token = req.cookies.token;
  const decoded_token = decode(token!) as JwtPayload;
  const uid = decoded_token?.userId;
  if (req.method === "GET") {
    const sessionsCount = await prisma.session.count({
      where: {
        userId: uid,
      },
    });
    if (takeInt > sessionsCount) {
      takeInt = sessionsCount;
    }
    if (takeInt <= sessionsCount) {
      const pages = Math.ceil(sessionsCount / takeInt);
      skipInt = skipInt > pages ? 0 : skipInt;
    }
    const sessions = await prisma.session.findMany({
      where: {
        userId: uid,
      },
      include: {
        exercises: {
          include: {
            sets: {
              orderBy: {
                createdAt: "asc",
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        date: "desc",
      },
      skip: skipInt,
      take: takeInt,
    });
    if (sessions.length === 0) {
      res.status(404).json({ error: "No sessions found" });
      await prisma.$disconnect();
      return;
    }
    res.status(200).json({ sessions, count: sessionsCount });
  } else if (req.method === "POST") {
    const data = req.body;
    const session = await prisma.session.create({
      data: data,
    });
    await prisma.$disconnect();
    res.status(200).json({ session });
    return;
  } else {
    await prisma.$disconnect();
    res.status(405).send("Method not allowed");
  }
});
