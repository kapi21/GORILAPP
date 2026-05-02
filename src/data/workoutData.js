// Workout data imported from Excel and updated with new 5-day routine
export const workoutData = [
    {
        name: 'Día 1 – Empuje',
        day: 'Hombro/Pecho/Tríceps',
        order: 1,
        exercises: [
            { name: 'Press militar de pie', sets: '4x8-10', reps: '8-10', rir: '1-2', rest: '2 min', order: 1, exerciseDbId: '0134', gifUrl: '/exercises/press-militar.gif', notes: '' },
            { name: 'Elevaciones laterales sentado', sets: '4x12-15', reps: '12-15', rir: '0-1', rest: '90 s', order: 2, exerciseDbId: '0338', gifUrl: '/exercises/elevaciones-laterales.gif', notes: '' },
            { name: 'Press inclinado con mancuernas', sets: '4x8-10', reps: '8-10', rir: '1-2', rest: '2 min', order: 3, exerciseDbId: '0314', gifUrl: '/exercises/press-inclinado.gif', notes: '' },
            { name: 'Peck deck / Aperturas en máquina', sets: '3x12-15', reps: '12-15', rir: '0-1', rest: '90 s', order: 4, exerciseDbId: '', gifUrl: '', notes: '' },
            { name: 'Extensión en polea', sets: '4x10-12', reps: '10-12', rir: '1', rest: '90 s', order: 5, exerciseDbId: '1451', gifUrl: '/exercises/extension-triceps-barra.gif', notes: '' },
            { name: 'Extensión copa con mancuerna a una mano', sets: '3x12-15', reps: '12-15', rir: '1', rest: '90 s', order: 6, exerciseDbId: '', gifUrl: '', notes: '' }
        ]
    },
    {
        name: 'Día 2 – Tracción',
        day: 'Espalda/Hombro posterior/Bíceps',
        order: 2,
        exercises: [
            { name: 'Dominadas', sets: '4x8-10', reps: '8-10', rir: '1-2', rest: '2 min', order: 1, exerciseDbId: '3293', gifUrl: '/exercises/dominadas.gif', notes: '' },
            { name: 'Remo con mancuerna a una mano', sets: '4x10-12', reps: '10-12', rir: '1-2', rest: '2 min', order: 2, exerciseDbId: '', gifUrl: '', notes: '' },
            { name: 'Face pull', sets: '3x12-15', reps: '12-15', rir: '1', rest: '90 s', order: 3, exerciseDbId: '0187', gifUrl: '/exercises/face-pulls.gif', notes: '' },
            { name: 'Pájaros en banco inclinado', sets: '3x12-15', reps: '12-15', rir: '0-1', rest: '90 s', order: 4, exerciseDbId: '', gifUrl: '', notes: '' },
            { name: 'Curl con barra', sets: '4x10-12', reps: '10-12', rir: '1', rest: '90 s', order: 5, exerciseDbId: '0168', gifUrl: '/exercises/curl-biceps-barra.gif', notes: '' },
            { name: 'Curl martillo inclinado', sets: '3x10-12', reps: '10-12', rir: '1', rest: '90 s', order: 6, exerciseDbId: '', gifUrl: '', notes: '' }
        ]
    },
    {
        name: 'Día 3 – Pierna',
        day: 'Cuádriceps/Femoral/Glúteo/Gemelos',
        order: 3,
        exercises: [
            { name: 'Prensa', sets: '4x10-12', reps: '10-12', rir: '1', rest: '2-3 min', order: 1, exerciseDbId: '1422', gifUrl: '/exercises/prensa-inclinada.gif', notes: '' },
            { name: 'Extensiones de cuádriceps', sets: '4x12-15', reps: '12-15', rir: '0-1', rest: '90 s', order: 2, exerciseDbId: '1407', gifUrl: '/exercises/extension-cuadriceps.gif', notes: '' },
            { name: 'Peso muerto con mancuernas', sets: '4x10-12', reps: '10-12', rir: '1-2', rest: '2-3 min', order: 3, exerciseDbId: '', gifUrl: '', notes: '' },
            { name: 'Curl femoral tumbado', sets: '4x10-12', reps: '10-12', rir: '1', rest: '2 min', order: 4, exerciseDbId: '1615', gifUrl: '/exercises/curl-femoral.gif', notes: '' },
            { name: 'Hip thrust', sets: '4x10-12', reps: '10-12', rir: '1-2', rest: '2 min', order: 5, exerciseDbId: '', gifUrl: '', notes: '' },
            { name: 'Elevación de talones sentado', sets: '4x15-20', reps: '15-20', rir: '0-1', rest: '90 s', order: 6, exerciseDbId: '', gifUrl: '', notes: '' }
        ]
    },
    {
        name: 'Día 4 – Tren Superior',
        day: 'Pecho/Espalda/Hombro/Bíceps/Tríceps',
        order: 4,
        exercises: [
            { name: 'Press banca plano', sets: '4x8-10', reps: '8-10', rir: '1-2', rest: '2 min', order: 1, exerciseDbId: '0027', gifUrl: '/exercises/press-banca-plano.gif', notes: '' },
            { name: 'Remo sentado', sets: '4x10-12', reps: '10-12', rir: '1', rest: '2 min', order: 2, exerciseDbId: '0207', gifUrl: '/exercises/remo-polea.gif', notes: '' },
            { name: 'Press militar sentado', sets: '4x8-10', reps: '8-10', rir: '1-2', rest: '2 min', order: 3, exerciseDbId: '', gifUrl: '', notes: '' },
            { name: 'Curl bíceps máquina', sets: '3x10-12', reps: '10-12', rir: '1', rest: '90 s', order: 4, exerciseDbId: '', gifUrl: '', notes: '' },
            { name: 'Press francés', sets: '3x10-12', reps: '10-12', rir: '1', rest: '90 s', order: 5, exerciseDbId: '1451', gifUrl: '/exercises/press-frances.gif', notes: '' }
        ]
    },
    {
        name: 'Día 5 – Pierna y Core',
        day: 'Cuádriceps/Femoral/Glúteo/Core',
        order: 5,
        exercises: [
            { name: 'Sentadilla', sets: '4x8-10', reps: '8-10', rir: '1-2', rest: '3 min', order: 1, exerciseDbId: '0043', gifUrl: '/exercises/sentadilla.gif', notes: '' },
            { name: 'Zancadas', sets: '3x12-15/pierna', reps: '12-15', rir: '1', rest: '2 min', order: 2, exerciseDbId: '1490', gifUrl: '/exercises/walking-lunges.gif', notes: '' },
            { name: 'Peso muerto', sets: '4x8-10', reps: '8-10', rir: '1-2', rest: '3 min', order: 3, exerciseDbId: '0032', gifUrl: '/exercises/peso-muerto.gif', notes: '' },
            { name: 'Curl femoral', sets: '4x10-12', reps: '10-12', rir: '1', rest: '2 min', order: 4, exerciseDbId: '1615', gifUrl: '/exercises/curl-femoral.gif', notes: '' },
            { name: 'Rueda abdominal', sets: '3x10-15', reps: '10-15', rir: '1', rest: '90 s', order: 5, exerciseDbId: '', gifUrl: '', notes: '' },
            { name: 'Plancha', sets: '3xal fallo', reps: 'al fallo', rir: '0', rest: '90 s', order: 6, exerciseDbId: '', gifUrl: '', notes: '' }
        ]
    }
];
