import { PrismaClient } from "@prisma/client";
import { authenticated } from "../../../middlewares/auth";
import { decode } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default authenticated(async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { skip, take } = req.query;
  let takeInt = parseInt(take) === 0 || parseInt(take) > 50 || !take ? 10 : parseInt(take);
  let skipInt = parseInt(skip) === 0 || !skip || parseInt(skip) > takeInt ? 0 : parseInt(skip);
  const uid = decode(req.cookies.token).userId;
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
