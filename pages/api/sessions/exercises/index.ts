import { PrismaClient } from "@prisma/client";
import { decode, JwtPayload } from "jsonwebtoken";
import { authenticated } from "../../../../middlewares/auth";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default authenticated(async function search(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    await prisma.$disconnect();
    res.status(405).send("Method not allowed");
  }

  const decoded = decode(req.cookies.token!) as JwtPayload;
  const uid = decoded.userId;
  const sessionId = req.body.sessionId;
  const name = req.body.name;
  const sessions = await prisma.session.findMany({
    where: {
      userId: uid,
      NOT: {
        id: sessionId,
      },
    },
    include: {
      exercises: {
        include: {
          sets: true,
        },
      },
    },
  });

  const sessions_ = sessions
    .map((session) =>
      name
        .trim()
        .split(" ")
        .map((n) =>
          session.name.includes(n) || session.name === name ? session : null
        )
        .filter((session) => session !== null)
    )
    .flat();

  const _sessions_ = sessions_.map((session) => {
    return {
      ...session,
      exercises: session.exercises.map((exercise) => {
        return {
          name: (exercise.name = exercise.name.trim()),
          ...exercise,
        };
      }),
    };
  });

  function getUnique(arr, comp) {
    // store the comparison  values in array
    const unique = arr
      .map((e) => e[comp])

      // store the indexes of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the false indexes & return unique objects
      .filter((e) => arr[e])
      .map((e) => arr[e]);

    return unique;
  }
  const exercises = getUnique(
    _sessions_.map((session) => session.exercises).flat(),
    "name"
  );

  if (sessions.length === 0 && exercises.length === 0) {
    await prisma.$disconnect();
    res.status(404).send("No results found");
    return;
  }

  await prisma.$disconnect();
  res.status(200).json({
    exercises,
  });
});
