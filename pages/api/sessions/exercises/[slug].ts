import { PrismaClient } from "@prisma/client";
import { authenticated } from "../../../../middlewares/auth";
import { decode, JwtPayload } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default authenticated(async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const name = req.query.slug;
  const { userId } = decode(req.cookies.token!) as JwtPayload;
  try {
    const sessions = await prisma.session.findMany({
      where: {
        userId: userId,
      },
      include: {
        exercises: {
          include: {
            sets: {
              orderBy: {
                createdAt: "desc",
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });
    const exercises = sessions.flatMap((session) => session.exercises);
    if (!exercises) {
      await prisma.$disconnect();
      res.status(404).json({ error: "Session not found" });
      return;
    }
    // Ignore whitespace - first version didn't take user input with whitespace in consideration
    const exercisesList = exercises.filter(
      (exercise) => exercise.name.trim() === (name as string).trim()
    );
    if (exercisesList.length === 0) {
      await prisma.$disconnect();
      res.status(404).send("No results found");
      return;
    }
    await prisma.$disconnect();
    res.status(200).json(exercisesList);
    return;
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    res.status(500).json({ error: "an error has occured" });
    return;
  }
});
