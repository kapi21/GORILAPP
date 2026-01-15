import Dexie from 'dexie';

export const db = new Dexie('GorilAppDB');

db.version(3).stores({
  workouts: '++id, name, day, order',
  exercises: '++id, workoutId, name, sets, reps, rir, rest, order, exerciseDbId, gifUrl',
  sessions: '++id, workoutId, date, duration, notes',
  sets: '++id, sessionId, exerciseId, setNumber, weight, reps, rir, rpe, date',
  notes: '++id, exerciseId, note, date'
});

// Initialize database with workout data
export async function initializeDatabase() {
  const count = await db.workouts.count();

  if (count === 0) {
    // Import workout data
    const { workoutData } = await import('../data/workoutData');

    // Insert workouts
    for (const workout of workoutData) {
      const workoutId = await db.workouts.add({
        name: workout.name,
        day: workout.day,
        order: workout.order
      });

      // Insert exercises for this workout
      for (const exercise of workout.exercises) {
        await db.exercises.add({
          workoutId,
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          rir: exercise.rir,
          rest: exercise.rest,
          order: exercise.order,
          exerciseDbId: exercise.exerciseDbId,
          gifUrl: exercise.gifUrl || '',
          notes: exercise.notes || ''
        });
      }
    }

    console.log('Database initialized with workout data');
  }
}

// Helper functions
export async function getWorkouts() {
  return await db.workouts.orderBy('order').toArray();
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
  // Get max order for this workout to append at the end
  const lastExercise = await db.exercises
    .where('workoutId')
    .equals(exerciseData.workoutId)
    .reverse()
    .sortBy('order');

  const order = lastExercise.length > 0 ? lastExercise[0].order + 1 : 0;

  return await db.exercises.add({
    ...exerciseData,
    order,
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

export async function createSession(workoutId, notes = '') {
  return await db.sessions.add({
    workoutId,
    date: new Date().toISOString(),
    duration: 0,
    notes
  });
}

export async function updateSession(sessionId, data) {
  return await db.sessions.update(sessionId, data);
}

export async function addSet(sessionId, exerciseId, setNumber, weight, reps, rir, rpe = null) {
  return await db.sets.add({
    sessionId,
    exerciseId,
    setNumber,
    weight,
    reps,
    rir,
    rpe,
    date: new Date().toISOString()
  });
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

export async function getSessions(limit = 20) {
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

  // Group by date and calculate max weight
  const progressByDate = {};
  sets.forEach(set => {
    const date = new Date(set.date).toLocaleDateString();
    if (!progressByDate[date] || set.weight > progressByDate[date].weight) {
      progressByDate[date] = {
        date,
        weight: set.weight,
        reps: set.reps
      };
    }
  });

  return Object.values(progressByDate).sort((a, b) =>
    new Date(a.date) - new Date(b.date)
  );
}
