import { server } from "../config";
import Fuse from "fuse";

export function getReps(session) {
  if (!session) return [];
  const exercises = session.exercises;
  if (!exercises) return [];
  const all_reps = session.exercises.map((exercise) =>
    exercise.sets.map((set) => set.reps)
  );
  const stat_exercise = exercises.map((exercise, index) => {
    const reps = all_reps[index].flat();
    const reps_sum = reps.reduce((a, b) => a + b, 0);
    const reps_avg = reps_sum / reps.length;
    return {
      reps_avg,
      reps_sum,
      reps,
      exercise,
    };
  });
  return stat_exercise;
}
export function getWeight(session) {
  const all_weights = session.exercises.map((exercise) =>
    exercise.sets.map((set) => set.weight)
  );
  const total_weight = session.exercises.map((exercise) =>
    exercise.sets.map((set) => set.weight * set.reps)
  );
  const exercises = session.exercises;
  const stat_exercise = exercises.map((exercise, index) => {
    const weights = all_weights[index].flat();
    const weights_sum = total_weight[index].flat().reduce((a, b) => a + b, 0);
    const weights_avg = weights_sum / weights.length;
    return {
      weights_avg,
      weights_sum,
      weights,
      exercise,
    };
  });
  return stat_exercise;
}
export async function getSessionById(ctx, id) {
  const data = await fetch(`${server}/api/sessions/${id}`, {
    headers: {
      cookie: ctx.req.headers.cookie,
    },
  });
  if (!ctx.req.headers.cookie) {
    ctx.res.status = 401;
  }
  const session = await data.json();
  return { session, status: data.status };
}
export async function getLastRelatedSession(ctx, id) {
  const data = await fetch(`${server}/api/sessions/`, {
    headers: {
      cookie: ctx.req.headers.cookie,
    },
  });
  if (!ctx.req.headers.cookie) {
    ctx.res.status = 401;
  }
  const sessions = await data.json();
  if (!sessions.sessions) {
    return { sessions: null };
  }
  const currentSession = sessions.sessions.find((session) => session.id === id);
  const allSessions = sessions.sessions.filter((session) => session.id !== id);
  const sessionFuse = new Fuse(allSessions, {
    keys: ["name"],
    threshold: 0.3,
  });

  let lastRelatedSession = sessionFuse.search(currentSession.name).sort((a, b) => (new Date(b.item.date) as any) - (new Date(a.item.date) as any));
  if (lastRelatedSession.length > 0) {
    lastRelatedSession = lastRelatedSession[0].item;
    return { lastRelatedSession };
  }
  return { lastRelatedSession: null };
}
export async function getExerciseById(ctx, slug) {
  const data = await fetch(`${server}/api/sessions/exercises/${slug}`, {
    headers: {
      cookie: ctx.req.headers.cookie,
    },
  });
  if (!ctx.req.headers.cookie) {
    ctx.res.status = 401;
  }
  const exercises = await data.json();
  return { exercises, status: data.status };
}
export function getExerciseStat(exercises) {
  const all_weights = exercises.map((exercise) =>
    exercise.sets.map((set) => set.weight)
  );
  const total_weight = exercises.map((exercise) =>
    exercise.sets.map((set) => set.weight !== 0 ? set.weight * set.reps : set.reps)
  );
  const stat_exercise = exercises.map((exercise, index) => {
    const weights = all_weights[index].flat();
    const weights_sum = total_weight[index].flat().reduce((a, b) => a + b, 0);
    const weights_avg = weights_sum / weights.length;
    return {
      weights_avg,
      weights_sum,
      weights,
    };
  });
  return stat_exercise;
}
