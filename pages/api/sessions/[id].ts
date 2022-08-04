import { PrismaClient } from "@prisma/client";
import { authenticated } from "../../../middlewares/auth";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default authenticated(async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const id = req.query.id as string;
  const session = await prisma.session.findUnique({
    where: {
      id: id,
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
  });
  await prisma.$disconnect();
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }
  res.status(200).json(session);
});
