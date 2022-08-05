import { getReps, getWeight } from '../utils/session';

describe('test session', () => {
  it('test getReps', () => {
    const set1 = {
      reps: 5,
    }
    const set2 = {
      reps: 6
    }
    const set3 = {
      reps: 7
    }

    const exercise1 = { sets: [set1, set2, set3] };
    const exercise2 = { sets: [set1, set2, set3] };
    const exercise3 = { sets: [set1, set2, set3] };

    const exercises = [exercise1, exercise2, exercise3];

    const session = {
      exercises
    };

    let a: any = [];
    let rest: any = [];


    [a, ...rest] = getReps(session);

    expect(a.reps_avg).toBe(6)
    expect(a.reps_sum).toBe(18)
    expect(a.reps).toStrictEqual([5, 6, 7])
  })

  it('test getWeight', () => {
    const set1 = {
      reps: 3,
      weight: 5,
    }
    const set2 = {
      reps: 4,
      weight: 6
    }
    const set3 = {
      reps: 5,
      weight: 7
    }

    const exercise1 = { sets: [set1, set2, set3] };
    const exercise2 = { sets: [set1, set2, set3] };
    const exercise3 = { sets: [set1, set2, set3] };

    const exercises = [exercise1, exercise2, exercise3];

    const session = {
      exercises
    };

    let a: any = [];
    let rest: any = [];


    [a, ...rest] = getWeight(session);

    expect(a.weights_avg).toBe(74 / 3)
    expect(a.weights_sum).toBe(74)
    expect(a.weights).toStrictEqual([5, 6, 7])
  })
})