// Catálogo de rutinas organizado por bloques de entrenamiento (Mesociclos)
export const workoutData = [
    // ==========================================
    // BLOQUE: RUTINA SEPTIEMBRE (4 SESIONES)
    // ==========================================
    {
        block: 'Rutina Septiembre',
        name: 'Sesión 1 – Espalda / Torso / Pierna',
        day: 'Posterior / Dorsal / Cuádriceps / Glúteo / Abdomen',
        order: 1,
        exercises: [
            {
                name: 'Reverse Peck Deck',
                muscleGroup: 'DEL. POSTERIOR',
                sets: '3',
                reps: '10-14',
                rir: '0-0-F',
                rest: '1\'-2\'',
                order: 1,
                exerciseDbId: 'Reverse_Flyes',
                notes: 'Control en fase excéntrica, foco en deltoide posterior.'
            },
            {
                name: 'Remo en T',
                muscleGroup: 'ESPALDA ALTA',
                sets: '2',
                reps: '1x5-8 / 1x8-11',
                rir: '2-1',
                rest: '2\'-3\'',
                order: 2,
                exerciseDbId: 'T-Bar_Row_with_Handle',
                notes: 'Serie 1 pesada (5-8 reps), serie 2 retroceso (8-11 reps).'
            },
            {
                name: 'Remo Gironda Agarre Neutro',
                muscleGroup: 'DORSAL',
                sets: '3',
                reps: '8-12',
                rir: '1-1-0',
                rest: '2\'',
                order: 3,
                exerciseDbId: 'Seated_Cable_Rows',
                notes: 'Agarre neutro estrecho, tracción hacia la cadera.'
            },
            {
                name: 'Curl Predicador Máquina',
                muscleGroup: 'BÍCEPS',
                sets: '2',
                reps: '8-12',
                rir: '0-F',
                rest: '2\'',
                order: 4,
                exerciseDbId: 'Machine_Preacher_Curls',
                notes: 'Segunda serie al fallo muscular técnico.'
            },
            {
                name: 'Hip Thrust Máquina',
                muscleGroup: 'GLÚTEO',
                sets: '2',
                reps: '1x6-8 / 1x8-11',
                rir: '2-1',
                rest: '2\'-3\'',
                order: 5,
                exerciseDbId: 'Barbell_Hip_Thrust',
                notes: 'Pausa de 1s arriba en máxima contracción.'
            },
            {
                name: 'Belt Squat',
                muscleGroup: 'CUÁDRICEPS',
                sets: '2',
                reps: '8-12',
                rir: '0-0',
                rest: '2\'-3\'',
                order: 6,
                exerciseDbId: 'Barbell_Squat',
                notes: 'Profundidad controlada sin sobrecarga axial.'
            },
            {
                name: 'Aductor en Máquina',
                muscleGroup: 'ADUCTOR',
                sets: '2',
                reps: '10-14',
                rir: '0-F',
                rest: '2\'-3\'',
                order: 7,
                exerciseDbId: 'Thigh_Adductor',
                notes: 'Rango de recorrido completo.'
            },
            {
                name: 'Crunch en Máquina',
                muscleGroup: 'ABDOMEN',
                sets: '2',
                reps: '10-14',
                rir: 'F-F',
                rest: '1\'-2\'',
                order: 8,
                exerciseDbId: 'Ab_Crunch_Machine',
                notes: 'Ambas series al fallo concéntrico.'
            }
        ]
    },
    {
        block: 'Rutina Septiembre',
        name: 'Sesión 2 – Empuje / Deltoides / Pectoral',
        day: 'Hombro / Pecho / Tríceps',
        order: 2,
        exercises: [
            {
                name: 'Press Inclinado en Multipower',
                muscleGroup: 'DEL. ANTERIOR',
                sets: '2',
                reps: '1x4-6 / 1x7-10',
                rir: '2-1',
                rest: '2\'-3\'',
                order: 1,
                exerciseDbId: 'Smith_Machine_Incline_Bench_Press',
                notes: 'Inclinación 30-45º. Serie 1 fuerza, serie 2 hipertrofia.'
            },
            {
                name: 'Elevaciones Laterales Mancuernas de Pie',
                muscleGroup: 'DEL. MEDIAL',
                sets: '3',
                reps: '9-14',
                rir: '0-F-PARCIALES',
                rest: '2\'',
                order: 2,
                exerciseDbId: 'Side_Lateral_Raise',
                notes: 'Última serie: continuar con parciales tras el fallo.'
            },
            {
                name: 'Press Plano con Mancuernas',
                muscleGroup: 'PECTORAL',
                sets: '2',
                reps: '9-13',
                rir: '2-1',
                rest: '2\'-3\'',
                order: 3,
                exerciseDbId: 'Dumbbell_Bench_Press',
                notes: 'Retracción escapular sólida en todo el recorrido.'
            },
            {
                name: 'Elevaciones Laterales Tumbado en Banco Poleas',
                muscleGroup: 'DEL. MEDIAL',
                sets: '3',
                reps: '9-14',
                rir: '0-F-F',
                rest: '2\'',
                order: 4,
                exerciseDbId: 'Cable_Seated_Lateral_Raise',
                notes: 'Tensión constante en el punto de estiramiento.'
            },
            {
                name: 'Cruces de Poleas con Banco',
                muscleGroup: 'PECTORAL',
                sets: '2',
                reps: '10-14',
                rir: '1-0',
                rest: '1\'-2\'',
                order: 5,
                exerciseDbId: 'Cable_Crossover',
                notes: 'Foco en el estiramiento y compresión pectoral.'
            },
            {
                name: 'Extensiones de Tríceps Crucifix',
                muscleGroup: 'TRÍCEPS',
                sets: '2',
                reps: '10-15',
                rir: '0-F',
                rest: '1\'-2\'',
                order: 6,
                exerciseDbId: 'Cable_One_Arm_Tricep_Extension',
                notes: 'Polea a la altura del hombro, extensión unilateral.'
            },
            {
                name: 'Press Francés Tumbado con Mancuernas',
                muscleGroup: 'TRÍCEPS',
                sets: '2',
                reps: '9-13',
                rir: '1-1',
                rest: '2\'',
                order: 7,
                exerciseDbId: 'Lying_Dumbbell_Tricep_Extension',
                notes: 'Codos fijos ligeramente inclinados hacia atrás.'
            }
        ]
    },
    {
        block: 'Rutina Septiembre',
        name: 'Sesión 3 – Pierna / Tracción / Bíceps',
        day: 'Cuádriceps / Femoral / Dorsal / Bíceps / Gemelos',
        order: 3,
        exercises: [
            {
                name: 'Hack con Banda Asistida',
                muscleGroup: 'CUÁDRICEPS',
                sets: '2',
                reps: '6-10',
                rir: '3-2',
                rest: '3\'',
                order: 1,
                exerciseDbId: 'Hack_Squat',
                notes: 'Banda elástica asistiendo en el fondo para fluidez.'
            },
            {
                name: 'Peso Muerto Rumano Máquina en Palancas',
                muscleGroup: 'FEMORAL',
                sets: '2',
                reps: '6-9',
                rir: '3-2',
                rest: '3\'',
                order: 2,
                exerciseDbId: 'Romanian_Deadlift',
                notes: 'Empujar cadera atrás, máxima tensión en isquios.'
            },
            {
                name: 'Extensiones Cuádriceps Máquina de Placas',
                muscleGroup: 'CUÁDRICEPS',
                sets: '3',
                reps: '10-15',
                rir: '1-0-F',
                rest: '1\'-2\'',
                order: 3,
                exerciseDbId: 'Leg_Extensions',
                notes: 'Pausa isométrica de 1s arriba.'
            },
            {
                name: 'Remo Alto Unilateral Polea con Banco',
                muscleGroup: 'DORSAL',
                sets: '3',
                reps: '9-13',
                rir: '1-1-0',
                rest: '1\'-2\'',
                order: 4,
                exerciseDbId: 'Seated_One-arm_Cable_Pulley_Rows',
                notes: 'Trayectoria del codo pegada al costado.'
            },
            {
                name: 'Curl Barra Z de Pie',
                muscleGroup: 'BÍCEPS',
                sets: '2',
                reps: '7-10',
                rir: '1-1',
                rest: '1\'-2\'',
                order: 5,
                exerciseDbId: 'Close-Grip_EZ_Bar_Curl',
                notes: 'Cuerpo firme sin inercia lumbar.'
            },
            {
                name: 'Remo Prono en Máquina Poleas',
                muscleGroup: 'DORSAL',
                sets: '3',
                reps: '9-13',
                rir: '1-0-F',
                rest: '1\'-2\'',
                order: 6,
                exerciseDbId: 'Seated_Cable_Rows',
                notes: 'Agarre prono medio para estímulo de dorsal medio.'
            },
            {
                name: 'Curl Bayesian Unilateral con Polea',
                muscleGroup: 'BÍCEPS',
                sets: '2',
                reps: '10-14',
                rir: '0-F',
                rest: '1\'-2\'',
                order: 7,
                exerciseDbId: 'Standing_Biceps_Cable_Curl',
                notes: 'Bíceps estirado por detrás de la línea del cuerpo.'
            },
            {
                name: 'Elevaciones Talones Rodillas Extendidas',
                muscleGroup: 'GEMELOS',
                sets: '2',
                reps: '9-14',
                rir: 'F-F',
                rest: '1\'',
                order: 8,
                exerciseDbId: 'Standing_Calf_Raises',
                notes: 'Parada en estiramiento abajo antes de subir.'
            }
        ]
    },
    {
        block: 'Rutina Septiembre',
        name: 'Sesión 4 – Torso / Hombro / Pectoral / Tríceps',
        day: 'Pectoral / Deltoides / Tríceps / Abdomen',
        order: 4,
        exercises: [
            {
                name: 'Crunch Polea Alta',
                muscleGroup: 'ABDOMEN',
                sets: '3',
                reps: '12-16',
                rir: 'F-F-F',
                rest: '1\'-2\'',
                order: 1,
                exerciseDbId: 'Kneeling_Cable_Crunch_With_Alternating_Oblique_Twists',
                notes: 'Flexionar la columna, no tirar con la cadera.'
            },
            {
                name: 'Elevaciones Laterales Máquina de Placas',
                muscleGroup: 'DEL. MEDIAL',
                sets: '3',
                reps: '10-15',
                rir: '0-F-PARCIALES',
                rest: '1\'-2\'',
                order: 2,
                exerciseDbId: 'Cable_Seated_Lateral_Raise',
                notes: 'Fallo y continuación con parciales en la última.'
            },
            {
                name: 'Press Inclinado Barra entre Pines',
                muscleGroup: 'PECTORAL',
                sets: '3',
                reps: '1x5-7 / 2x8-10',
                rir: '2-2-1',
                rest: '2\'-3\'',
                order: 3,
                exerciseDbId: 'Barbell_Incline_Bench_Press_-_Medium_Grip',
                notes: 'Pines a la altura del pecho para salida concéntrica pura.'
            },
            {
                name: 'Elevación Lateral Polea Media',
                muscleGroup: 'DEL. MEDIAL',
                sets: '2',
                reps: '12-16',
                rir: '0-F',
                rest: '1\'',
                order: 4,
                exerciseDbId: 'Cable_Seated_Lateral_Raise',
                notes: 'Tensión máxima en la porción media del deltoide.'
            },
            {
                name: 'Dips',
                muscleGroup: 'PECTORAL',
                sets: '2',
                reps: '12-16',
                rir: '2-1',
                rest: '1\'',
                order: 5,
                exerciseDbId: 'Dips_-_Chest_Version',
                notes: 'Torso inclinado al frente para mayor activación de pecho.'
            },
            {
                name: 'Extensiones Katana Unilateral Polea',
                muscleGroup: 'TRÍCEPS',
                sets: '2',
                reps: '9-13',
                rir: '0-F',
                rest: '2\'',
                order: 6,
                exerciseDbId: 'Cable_Rope_Overhead_Triceps_Extension',
                notes: 'Extensión trasnuca por encima de la cabeza.'
            },
            {
                name: 'Press Plano en Máquina de Placas',
                muscleGroup: 'PECTORAL',
                sets: '3',
                reps: '9-13',
                rir: '1-1-0',
                rest: '2\'-3\'',
                order: 7,
                exerciseDbId: 'Leverage_Chest_Press',
                notes: 'Última serie a RIR 0 al borde del fallo.'
            }
        ]
    }
];
