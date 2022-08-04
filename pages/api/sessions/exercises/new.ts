import { PrismaClient  } from "@prisma/client";
import { authenticated } from "../../../../middlewares/auth";
import { isEqual } from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";

export default authenticated(async function handle(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient();

  try {
    const sets = req.body.sets.filter((set) => !set.toBeDeleted);
    const toBeDeleted = req.body.sets.filter((set) => set.toBeDeleted);
    let deletedSets = 0;
    if (toBeDeleted.length > 0) {
      deletedSets = await prisma.set.deleteMany({
        where: {
          id: { in: toBeDeleted.map((set) => set.id) },
        },
      }) as any;
    }

    const exercise = await prisma.exercise.upsert({
      where: {
        id: req.body.id,
      },
      update: {
        name: req.body.name,
        sets: {
          upsert: sets.map((set) => ({
            where: {
              id: set.id,
            },
            update: {
              reps: set.reps,
              weight: set.weight,
              createdAt: set.createdAt,
            },
            create: {
              reps: set.reps,
              weight: set.weight,
              createdAt: set.createdAt,
              updatedAt: set.createdAt,
            },
          })),
        },
      },
      create: {
        name: req.body.name,
        sets: {
          create: sets.map((set) => ({
            reps: set.reps,
            weight: set.weight,
            createdAt: set.createdAt,
            updatedAt: set.createdAt,
          })),
        },
        session: {
          connect: {
            id: req.body.sessionId,
          },
        },
      },
      include: {
        sets: true,
      },
    });

    let created = false;
    created = isEqual(exercise.createdAt, exercise.updatedAt) ? true : false;

    await prisma.$disconnect();
    res.status(200).json({ exercise, deletedSets, created });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Creation/Edit was not successful" });
  }
});
