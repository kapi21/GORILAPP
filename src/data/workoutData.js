// Workout data imported from Excel
export const workoutData = [
    {
        name: 'Día 1 – Empuje',
        day: 'Pecho/Hombro/Tríceps',
        order: 1,
        exercises: [
            {
                name: 'Press banca plano',
                sets: '4x4 / 5x3',
                reps: '4-5',
                rir: '2→1',
                rest: '3-4 min',
                order: 1,
                exerciseDbId: '0027',
                gifUrl: '/exercises/press-banca-plano.gif',
                notes: ''
            },
            {
                name: 'Press militar de pie',
                sets: '4x5',
                reps: '5',
                rir: '2→1',
                rest: '3 min',
                order: 2,
                exerciseDbId: '0134',
                gifUrl: '/exercises/press-militar.gif',
                notes: ''
            },
            {
                name: 'Press inclinado mancuernas/máquina',
                sets: '4x8-10',
                reps: '8-10',
                rir: '1–2',
                rest: '2 min',
                order: 3,
                exerciseDbId: '0314',
                gifUrl: '/exercises/press-inclinado.gif',
                notes: ''
            },
            {
                name: 'Cruces en polea alta (crossover)',
                sets: '3x12-15',
                reps: '12-15',
                rir: '0–1',
                rest: '90 s',
                order: 4,
                exerciseDbId: '0179',
                gifUrl: '/exercises/cruces-polea.gif',
                notes: ''
            },
            {
                name: 'Elevaciones laterales',
                sets: '4x12-15',
                reps: '12-15',
                rir: '0–1',
                rest: '90 s',
                order: 5,
                exerciseDbId: '0338',
                gifUrl: '/exercises/elevaciones-laterales.gif',
                notes: ''
            },
            {
                name: 'Extensión tríceps barra polea',
                sets: '4x10-12',
                reps: '10-12',
                rir: '1',
                rest: '90 s',
                order: 6,
                exerciseDbId: '1451',
                gifUrl: '/exercises/extension-triceps-barra.gif',
                notes: ''
            },
            {
                name: 'Extensión tríceps cuerda polea',
                sets: '3x12-15',
                reps: '12-15',
                rir: '0–1',
                rest: '90 s',
                order: 7,
                exerciseDbId: '1452',
                gifUrl: '/exercises/extension-triceps-cuerda.gif',
                notes: ''
            }
        ]
    },
    {
        name: 'Día 2 – Tirón',
        day: 'Espalda/Bíceps',
        order: 2,
        exercises: [
            {
                name: 'Peso muerto',
                sets: '4x4 / 5x3',
                reps: '4-5',
                rir: '2→1',
                rest: '3-4 min',
                order: 1,
                exerciseDbId: '0032',
                gifUrl: '/exercises/peso-muerto.gif',
                notes: ''
            },
            {
                name: 'Dominadas estrictas',
                sets: '5x3-4 / 6x2-3',
                reps: '2-4',
                rir: '1–2',
                rest: '3 min',
                order: 2,
                exerciseDbId: '3293',
                gifUrl: '/exercises/dominadas.gif',
                notes: 'Técnica / lastre'
            },
            {
                name: 'Jalón polea alta supino',
                sets: '3x10-12',
                reps: '10-12',
                rir: '1',
                rest: '2 min',
                order: 3,
                exerciseDbId: '0197',
                gifUrl: '/exercises/jalon-polea.gif',
                notes: ''
            },
            {
                name: 'Remo polea baja',
                sets: '4x10-12',
                reps: '10-12',
                rir: '1–2',
                rest: '2-3 min',
                order: 4,
                exerciseDbId: '0207',
                gifUrl: '/exercises/remo-polea.gif',
                notes: ''
            },
            {
                name: 'Face pulls',
                sets: '3x12-15',
                reps: '12-15',
                rir: '1',
                rest: '90 s',
                order: 5,
                exerciseDbId: '0187',
                gifUrl: '/exercises/face-pulls.gif',
                notes: ''
            },
            {
                name: 'Curl bíceps polea baja (barra)',
                sets: '4x10-12',
                reps: '10-12',
                rir: '1',
                rest: '2 min',
                order: 6,
                exerciseDbId: '0168',
                gifUrl: '/exercises/curl-biceps-barra.gif',
                notes: ''
            },
            {
                name: 'Curl inclinado mancuernas',
                sets: '3x10-12',
                reps: '10-12',
                rir: '1–0',
                rest: '90 s',
                order: 7,
                exerciseDbId: '0298',
                gifUrl: '/exercises/curl-inclinado.gif',
                notes: ''
            }
        ]
    },
    {
        name: 'Día 3 – Pierna',
        day: 'Pierna + Brazos',
        order: 3,
        exercises: [
            {
                name: 'Sentadilla trasera',
                sets: '4x4 / 5x3',
                reps: '4-5',
                rir: '2→1',
                rest: '3-4 min',
                order: 1,
                exerciseDbId: '0043',
                gifUrl: '/exercises/sentadilla.gif',
                notes: 'Rodilla OK'
            },
            {
                name: 'Prensa inclinada',
                sets: '5x8-10',
                reps: '8-10',
                rir: '1',
                rest: '2-3 min',
                order: 2,
                exerciseDbId: '1422',
                gifUrl: '/exercises/prensa-inclinada.gif',
                notes: ''
            },
            {
                name: 'Curl femoral máquina',
                sets: '4x10-12',
                reps: '10-12',
                rir: '1',
                rest: '2 min',
                order: 3,
                exerciseDbId: '1615',
                gifUrl: '/exercises/curl-femoral.gif',
                notes: ''
            },
            {
                name: 'Extensiones de cuádriceps',
                sets: '4x12-15',
                reps: '12-15',
                rir: '0–1',
                rest: '90s-2 min',
                order: 4,
                exerciseDbId: '1407',
                gifUrl: '/exercises/extension-cuadriceps.gif',
                notes: ''
            },
            {
                name: 'Walking lunges',
                sets: '3x12-15/pierna',
                reps: '12-15',
                rir: '1–2',
                rest: '2-3 min',
                order: 5,
                exerciseDbId: '1490',
                gifUrl: '/exercises/walking-lunges.gif',
                notes: ''
            },
            {
                name: 'Curl bíceps polea alta',
                sets: '3x12-15',
                reps: '12-15',
                rir: '1',
                rest: '90 s',
                order: 6,
                exerciseDbId: '0168',
                gifUrl: '/exercises/curl-biceps-polea.gif',
                notes: ''
            },
            {
                name: 'Press francés polea baja',
                sets: '3x10-12',
                reps: '10-12',
                rir: '1',
                rest: '90 s',
                order: 7,
                exerciseDbId: '1451',
                gifUrl: '/exercises/press-frances.gif',
                notes: ''
            },
            {
                name: 'Elevaciones laterales',
                sets: '4x12-15',
                reps: '12-15',
                rir: '0–1',
                rest: '90 s',
                order: 8,
                exerciseDbId: '0338',
                gifUrl: '/exercises/elevaciones-laterales.gif',
                notes: ''
            }
        ]
    }
];
