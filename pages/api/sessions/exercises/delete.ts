import { PrismaClient, Exercise } from "@prisma/client";
import { authenticated } from "../../../../middlewares/auth";

const prisma = new PrismaClient();

export default authenticated(async function handle(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method not allowed");
  }

  try {
    const exercise = await prisma.exercise.delete({
      where: {
        id: req.body.id,
      },
    }) as Exercise;
    res.status(200).json({ exercise: exercise, deleted: true });
  } catch (error) {
    console.log(error)
    res.status(500).send("Deletion was not successful");
  }
});
