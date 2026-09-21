import Dexie from 'dexie';

export const db = new Dexie('GorilAppDB');

db.version(4).stores({
  workouts: '++id, name, day, order, block',
  exercises: '++id, workoutId, name, muscleGroup, sets, reps, rir, rest, order, exerciseDbId, gifUrl',
  sessions: '++id, workoutId, date, duration, notes, block, motivation',
  sets: '++id, sessionId, exerciseId, setNumber, weight, reps, rir, rpe, date',
  notes: '++id, exerciseId, note, date'
});

// Mutex to prevent concurrent initializations (e.g. React StrictMode)
let initPromise = null;

// Initialize database with exact 4 workout sessions & zero duplicates
export function initializeDatabase() {
  if (!initPromise) {
    initPromise = (async () => {
      try {
        const { workoutData } = await import('../data/workoutData');

        await db.transaction('rw', [db.workouts, db.exercises, db.sessions, db.sets], async () => {
        // 1. Clean up any workouts with id > 4 or invalid block
        const existingWorkouts = await db.workouts.toArray();
        for (const w of existingWorkouts) {
          if (w.id > 4 || !w.id) {
            await db.exercises.where('workoutId').equals(w.id).delete();
            await db.workouts.delete(w.id);
          }
        }

        // 2. Insert or update the exact 4 sessions idempotently with fixed IDs 1..4
        for (let i = 0; i < workoutData.length; i++) {
          const workout = workoutData[i];
          const workoutId = i + 1;

          await db.workouts.put({
            id: workoutId,
            name: workout.name,
            day: workout.day,
            order: workout.order || workoutId,
            block: 'Rutina Septiembre'
          });

          // Clean existing exercises for this workoutId first to avoid duplicates
          await db.exercises.where('workoutId').equals(workoutId).delete();

          for (let eIdx = 0; eIdx < workout.exercises.length; eIdx++) {
            const exercise = workout.exercises[eIdx];
            await db.exercises.put({
              id: (workoutId * 100) + eIdx + 1,
              workoutId,
              name: exercise.name,
              muscleGroup: exercise.muscleGroup || '',
              sets: exercise.sets,
              reps: exercise.reps,
              rir: exercise.rir,
              rest: exercise.rest,
              order: exercise.order || eIdx + 1,
              exerciseDbId: exercise.exerciseDbId || '',
              gifUrl: exercise.gifUrl || '',
              notes: exercise.notes || ''
            });
          }
        }

        // 3. Remap any user session records if workoutId was > 4
        const allSessions = await db.sessions.toArray();
        for (const s of allSessions) {
          if (s.workoutId > 4 || !s.workoutId) {
            const mappedWorkoutId = (((s.workoutId || 1) - 1) % 4) + 1;
            await db.sessions.update(s.id, { workoutId: mappedWorkoutId });
          }
        }

        // 4. Clean extra/empty sessions: keep ONLY this exact 3-min session with 18 sets
        const currentSessions = await db.sessions.toArray();
        const isCleanSingle = currentSessions.length === 1 && currentSessions[0].duration === 3;
        if (!isCleanSingle) {
          await db.sessions.clear();
          await db.sets.clear();

          const setsData = [
            { exerciseId: 101, setNumber: 1, weight: 52, reps: 10, rir: '0', date: '2026-09-21T15:10:54.599Z' },
            { exerciseId: 101, setNumber: 2, weight: 52, reps: 10, rir: '0', date: '2026-09-21T15:10:57.702Z' },
            { exerciseId: 101, setNumber: 3, weight: 52, reps: 10, rir: 'F', date: '2026-09-21T15:11:01.559Z' },
            { exerciseId: 102, setNumber: 1, weight: 50, reps: 8, rir: '0', date: '2026-09-21T15:11:18.958Z' },
            { exerciseId: 102, setNumber: 2, weight: 45, reps: 10, rir: '0', date: '2026-09-21T15:11:29.812Z' },
            { exerciseId: 103, setNumber: 1, weight: 54, reps: 10, rir: '0', date: '2026-09-21T15:11:42.858Z' },
            { exerciseId: 103, setNumber: 2, weight: 54, reps: 10, rir: '1', date: '2026-09-21T15:11:47.518Z' },
            { exerciseId: 103, setNumber: 3, weight: 54, reps: 10, rir: '0', date: '2026-09-21T15:11:53.367Z' },
            { exerciseId: 104, setNumber: 1, weight: 41, reps: 10, rir: '0', date: '2026-09-21T15:12:22.087Z' },
            { exerciseId: 104, setNumber: 2, weight: 41, reps: 10, rir: '1', date: '2026-09-21T15:12:32.779Z' },
            { exerciseId: 105, setNumber: 1, weight: 65, reps: 8, rir: '0', date: '2026-09-21T15:13:07.193Z' },
            { exerciseId: 105, setNumber: 2, weight: 50, reps: 10, rir: '0', date: '2026-09-21T15:13:16.790Z' },
            { exerciseId: 106, setNumber: 1, weight: 140, reps: 8, rir: 'F', date: '2026-09-21T15:13:36.634Z' },
            { exerciseId: 106, setNumber: 2, weight: 140, reps: 8, rir: 'F', date: '2026-09-21T15:13:42.290Z' },
            { exerciseId: 107, setNumber: 1, weight: 73, reps: 10, rir: '1', date: '2026-09-21T15:13:57.363Z' },
            { exerciseId: 107, setNumber: 2, weight: 73, reps: 10, rir: '0', date: '2026-09-21T15:14:01.530Z' },
            { exerciseId: 108, setNumber: 1, weight: 91, reps: 10, rir: '0', date: '2026-09-21T15:14:10.954Z' },
            { exerciseId: 108, setNumber: 2, weight: 91, reps: 10, rir: 'F', date: '2026-09-21T15:14:14.929Z' }
          ];

          await db.sessions.add({
            id: 1,
            workoutId: 1,
            date: '2026-09-21T15:10:37.184Z',
            duration: 3,
            notes: '',
            motivation: '',
            block: 'Rutina Septiembre'
          });

          for (let i = 0; i < setsData.length; i++) {
            await db.sets.add({
              id: i + 1,
              sessionId: 1,
              ...setsData[i]
            });
          }
          console.log('GorilApp: Base depurada. Única sesión activa: Sesión 1 (3 min, 18 series).');
        }
      });
      console.log('GorilApp: Base de datos configurada con exactamente 4 sesiones fijas.');
    } catch (err) {
      initPromise = null;
      console.error('Error inicializando Dexie DB:', err);
      throw err;
    }
  })();
}
return initPromise;
}

export async function importCompletedSessionSeed() {
  await db.sessions.clear();
  await db.sets.clear();

  const setsData = [
    { exerciseId: 101, setNumber: 1, weight: 52, reps: 10, rir: '0', date: '2026-09-21T15:10:54.599Z' },
    { exerciseId: 101, setNumber: 2, weight: 52, reps: 10, rir: '0', date: '2026-09-21T15:10:57.702Z' },
    { exerciseId: 101, setNumber: 3, weight: 52, reps: 10, rir: 'F', date: '2026-09-21T15:11:01.559Z' },
    { exerciseId: 102, setNumber: 1, weight: 50, reps: 8, rir: '0', date: '2026-09-21T15:11:18.958Z' },
    { exerciseId: 102, setNumber: 2, weight: 45, reps: 10, rir: '0', date: '2026-09-21T15:11:29.812Z' },
    { exerciseId: 103, setNumber: 1, weight: 54, reps: 10, rir: '0', date: '2026-09-21T15:11:42.858Z' },
    { exerciseId: 103, setNumber: 2, weight: 54, reps: 10, rir: '1', date: '2026-09-21T15:11:47.518Z' },
    { exerciseId: 103, setNumber: 3, weight: 54, reps: 10, rir: '0', date: '2026-09-21T15:11:53.367Z' },
    { exerciseId: 104, setNumber: 1, weight: 41, reps: 10, rir: '0', date: '2026-09-21T15:12:22.087Z' },
    { exerciseId: 104, setNumber: 2, weight: 41, reps: 10, rir: '1', date: '2026-09-21T15:12:32.779Z' },
    { exerciseId: 105, setNumber: 1, weight: 65, reps: 8, rir: '0', date: '2026-09-21T15:13:07.193Z' },
    { exerciseId: 105, setNumber: 2, weight: 50, reps: 10, rir: '0', date: '2026-09-21T15:13:16.790Z' },
    { exerciseId: 106, setNumber: 1, weight: 140, reps: 8, rir: 'F', date: '2026-09-21T15:13:36.634Z' },
    { exerciseId: 106, setNumber: 2, weight: 140, reps: 8, rir: 'F', date: '2026-09-21T15:13:42.290Z' },
    { exerciseId: 107, setNumber: 1, weight: 73, reps: 10, rir: '1', date: '2026-09-21T15:13:57.363Z' },
    { exerciseId: 107, setNumber: 2, weight: 73, reps: 10, rir: '0', date: '2026-09-21T15:14:01.530Z' },
    { exerciseId: 108, setNumber: 1, weight: 91, reps: 10, rir: '0', date: '2026-09-21T15:14:10.954Z' },
    { exerciseId: 108, setNumber: 2, weight: 91, reps: 10, rir: 'F', date: '2026-09-21T15:14:14.929Z' }
  ];

  await db.sessions.add({
    id: 1,
    workoutId: 1,
    date: '2026-09-21T15:10:37.184Z',
    duration: 3,
    notes: '',
    motivation: '',
    block: 'Rutina Septiembre'
  });

  for (let i = 0; i < setsData.length; i++) {
    await db.sets.add({
      id: i + 1,
      sessionId: 1,
      ...setsData[i]
    });
  }

  return { success: true, sessionId: 1, message: 'Única sesión cargada: Sesión 1 (3 min, 18 series).' };
}

// Helper functions
export async function getWorkouts() {
  return await db.workouts.orderBy('order').toArray();
}

export async function getAvailableBlocks() {
  const allWorkouts = await db.workouts.toArray();
  const blocks = Array.from(new Set(allWorkouts.map(w => w.block || 'Rutina Base (PPL 5 Días)')));
  // Place Rutina Septiembre first if present
  return blocks.sort((a, b) => {
    if (a.includes('Septiembre')) return -1;
    if (b.includes('Septiembre')) return 1;
    return a.localeCompare(b);
  });
}

export async function getWorkoutsByBlock(block) {
  if (!block) return await getWorkouts();
  return await db.workouts.where('block').equals(block).sortBy('order');
}

export async function getWorkoutById(id) {
  return await db.workouts.get(id);
}

export async function getExercisesByWorkout(workoutId) {
  return await db.exercises.where('workoutId').equals(workoutId).sortBy('order');
}

export async function getExerciseById(id) {
  return await db.exercises.get(id);
}

export async function addExercise(exerciseData) {
  const lastExercise = await db.exercises
    .where('workoutId')
    .equals(exerciseData.workoutId)
    .reverse()
    .sortBy('order');

  const order = lastExercise.length > 0 ? lastExercise[0].order + 1 : 0;

  return await db.exercises.add({
    ...exerciseData,
    order,
    muscleGroup: exerciseData.muscleGroup || '',
    gifUrl: exerciseData.gifUrl || '',
    notes: exerciseData.notes || '',
    exerciseDbId: exerciseData.exerciseDbId || 'custom'
  });
}

export async function updateExercise(id, updates) {
  return await db.exercises.update(id, updates);
}

export async function deleteExercise(id) {
  return await db.exercises.delete(id);
}

export async function createSession(workoutId, notes = '', motivation = '', block = '') {
  return await db.sessions.add({
    workoutId,
    date: new Date().toISOString(),
    duration: 0,
    notes,
    motivation,
    block
  });
}

export async function updateSession(sessionId, data) {
  return await db.sessions.update(sessionId, data);
}

export async function deleteSession(sessionId) {
  await db.sets.where('sessionId').equals(sessionId).delete();
  return await db.sessions.delete(sessionId);
}

export async function addSet(sessionId, exerciseId, setNumber, weight, reps, rir, rpe = null) {
  return await db.sets.add({
    sessionId,
    exerciseId,
    setNumber,
    weight,
    reps,
    rir: rir !== undefined ? rir : '',
    rpe,
    date: new Date().toISOString()
  });
}

export async function updateSet(setId, updates) {
  return await db.sets.update(setId, updates);
}

export async function deleteSet(setId) {
  return await db.sets.delete(setId);
}

export async function getSetsBySession(sessionId) {
  return await db.sets.where('sessionId').equals(sessionId).toArray();
}

export async function getSetsByExercise(exerciseId, limit = 10) {
  return await db.sets
    .where('exerciseId')
    .equals(exerciseId)
    .reverse()
    .limit(limit)
    .toArray();
}

export async function getSessions(limit = 30) {
  return await db.sessions.orderBy('date').reverse().limit(limit).toArray();
}

export async function getSessionsByWorkout(workoutId, limit = 10) {
  return await db.sessions
    .where('workoutId')
    .equals(workoutId)
    .reverse()
    .limit(limit)
    .toArray();
}

export async function addNote(exerciseId, note) {
  return await db.notes.add({
    exerciseId,
    note,
    date: new Date().toISOString()
  });
}

export async function getNotesByExercise(exerciseId) {
  return await db.notes
    .where('exerciseId')
    .equals(exerciseId)
    .reverse()
    .toArray();
}

export async function getProgressData(exerciseId, days = 90) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const sets = await db.sets
    .where('exerciseId')
    .equals(exerciseId)
    .filter(set => new Date(set.date) >= cutoffDate)
    .toArray();

  const progressByDate = {};
  sets.forEach(set => {
    const date = new Date(set.date).toLocaleDateString();
    if (!progressByDate[date] || set.weight > progressByDate[date].weight) {
      progressByDate[date] = {
        dateISO: set.date,
        date,
        weight: set.weight,
        reps: set.reps
      };
    }
  });

  return Object.values(progressByDate).sort((a, b) =>
    new Date(a.dateISO) - new Date(b.dateISO)
  );
}

export async function syncRutinaSeptiembre() {
  const { workoutData } = await import('../data/workoutData');
  const septData = workoutData.filter(w => w.block === 'Rutina Septiembre');

  // Remove existing Septiembre workouts to avoid duplicate entries
  const existing = await db.workouts.where('block').equals('Rutina Septiembre').toArray();
  for (const w of existing) {
    await db.exercises.where('workoutId').equals(w.id).delete();
    await db.workouts.delete(w.id);
  }

  // Insert fresh Septiembre workouts
  for (const workout of septData) {
    const workoutId = await db.workouts.add({
      name: workout.name,
      day: workout.day,
      order: workout.order,
      block: workout.block
    });

    for (const exercise of workout.exercises) {
      await db.exercises.add({
        workoutId,
        name: exercise.name,
        muscleGroup: exercise.muscleGroup || '',
        sets: exercise.sets,
        reps: exercise.reps,
        rir: exercise.rir,
        rest: exercise.rest,
        order: exercise.order,
        exerciseDbId: exercise.exerciseDbId || '',
        gifUrl: exercise.gifUrl || '',
        notes: exercise.notes || ''
      });
    }
  }

  return { success: true, message: 'Rutina Septiembre actualizada con éxito (4 sesiones, 30 ejercicios)' };
}

