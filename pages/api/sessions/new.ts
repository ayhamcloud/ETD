import { PrismaClient, Session, Exercise } from "@prisma/client";
import { authenticated } from "../../../middlewares/auth";
import { decode, JwtPayload } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default authenticated(async function handle(req: NextApiRequest, res: NextApiResponse) {
  const prisma = new PrismaClient();
  const { userId } = decode(req.cookies.token!) as JwtPayload;

  console.log(req.body);
  try {
    const session = await prisma.session.create({
      data: {
        name: req.body.name,
        date: req.body.date,
        exercises: {
          create: req.body.exercises.map((exercise) => ({
            name: exercise.name,
            sets: {
              create: exercise.sets.map((set) => ({
                reps: set.reps,
                weight: set.weight,
              })),
            },
          })),
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    await prisma.$disconnect();
    res.status(200).json({ id: session.id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Creation was not successful" });
  }
});
