import { PrismaClient } from "@prisma/client";
import { decode, JwtPayload } from "jsonwebtoken";
import { authenticated } from "../../../../middlewares/auth";
import Fuse from "fuse.js";

const prisma = new PrismaClient();

export default authenticated(async function search(req, res) {
  if (req.method !== "POST") {
    await prisma.$disconnect();
    res.status(405).send("Method not allowed");
  }

  const { userId } = decode(req.cookies.token) as JwtPayload;
  const { search, sessionId } = req.body;
  try {
    const sessions = await prisma.session.findMany({
      where: {
        userId: userId,
        NOT: {
          id: sessionId,
        },
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
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    const exercises = sessions.flatMap((session) => session.exercises);

    if (sessions.length === 0 && exercises.length === 0) {
      await prisma.$disconnect();
      res.status(404).send("No results found");
    }

    const exerciseFuse = new Fuse(exercises, {
      keys: ["name"],
      threshold: 0.1,
    });
    const exerciseResults = exerciseFuse
      .search(search)
      .sort(
        (a, b) =>
          (new Date(b.item.createdAt) as any) -
            (new Date(a.item.createdAt) as any) && a.refIndex - b.refIndex
      );

    console.log(exerciseResults);
    const exercisesList = exerciseResults.map((exercise) => {
      return exercise.item;
    });

    if (exercisesList.length === 0) {
      await prisma.$disconnect();
      res.status(404).send("No results found");
      return;
    }

    await prisma.$disconnect();
    res.status(200).json({
      exercises: exercisesList,
    });
  } catch (error) {
    await prisma.$disconnect();
    res.status(500).send("Internal server error");
  }
});
