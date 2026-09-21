// Mapeo exhaustivo de ejercicios a IDs verificados de free-exercise-db
export const exerciseImageMap = {
    // --- RUTINA SEPTIEMBRE: SESIÓN 1 ---
    'Reverse Peck Deck': 'Reverse_Flyes',
    'Remo en T': 'T-Bar_Row_with_Handle',
    'Remo Gironda Agarre Neutro': 'Seated_Cable_Rows',
    'Curl Predicador Máquina': 'Machine_Preacher_Curls',
    'Hip Thrust Máquina': 'Barbell_Hip_Thrust',
    'Belt Squat': 'Barbell_Squat',
    'Aductor en Máquina': 'Thigh_Adductor',
    'Crunch en Máquina': 'Ab_Crunch_Machine',

    // --- RUTINA SEPTIEMBRE: SESIÓN 2 ---
    'Press Inclinado en Multipower': 'Smith_Machine_Incline_Bench_Press',
    'Elevaciones Laterales Mancuernas de Pie': 'Side_Lateral_Raise',
    'Press Plano con Mancuernas': 'Dumbbell_Bench_Press',
    'Elevaciones Laterales Tumbado en Banco Poleas': 'Cable_Seated_Lateral_Raise',
    'Cruces de Poleas con Banco': 'Cable_Crossover',
    'Extensiones de Tríceps Crucifix': 'Cable_One_Arm_Tricep_Extension',
    'Press Francés Tumbado con Mancuernas': 'Lying_Dumbbell_Tricep_Extension',

    // --- RUTINA SEPTIEMBRE: SESIÓN 3 ---
    'Hack con Banda Asistida': 'Hack_Squat',
    'Peso Muerto Rumano Máquina en Palancas': 'Romanian_Deadlift',
    'Extensiones Cuádriceps Máquina de Placas': 'Leg_Extensions',
    'Remo Alto Unilateral Polea con Banco': 'Seated_One-arm_Cable_Pulley_Rows',
    'Curl Barra Z de Pie': 'Close-Grip_EZ_Bar_Curl',
    'Remo Prono en Máquina Poleas': 'Seated_Cable_Rows',
    'Curl Bayesian Unilateral con Polea': 'Standing_Biceps_Cable_Curl',
    'Elevaciones Talones Rodillas Extendidas': 'Standing_Calf_Raises',

    // --- RUTINA SEPTIEMBRE: SESIÓN 4 ---
    'Crunch Polea Alta': 'Kneeling_Cable_Crunch_With_Alternating_Oblique_Twists',
    'Elevaciones Laterales Máquina de Placas': 'Cable_Seated_Lateral_Raise',
    'Press Inclinado Barra entre Pines': 'Barbell_Incline_Bench_Press_-_Medium_Grip',
    'Elevación Lateral Polea Media': 'Cable_Seated_Lateral_Raise',
    'Dips': 'Dips_-_Chest_Version',
    'Extensiones Katana Unilateral Polea': 'Cable_Rope_Overhead_Triceps_Extension',
    'Press Plano en Máquina de Placas': 'Leverage_Chest_Press',

    // --- RUTINA BASE PPL & HISTÓRICO ---
    'Press militar de pie': 'Standing_Military_Press',
    'Elevaciones laterales sentado': 'Side_Lateral_Raise',
    'Elevaciones laterales': 'Side_Lateral_Raise',
    'Press inclinado con mancuernas': 'Barbell_Incline_Bench_Press_-_Medium_Grip',
    'Peck deck / Aperturas en máquina': 'Dumbbell_Flyes',
    'Extensión en polea': 'Cable_One_Arm_Tricep_Extension',
    'Extensión copa con mancuerna': 'Lying_Dumbbell_Tricep_Extension',
    'Dominadas': 'Pull_Ups',
    'Remo con mancuerna a una mano': 'One_Arm_Dumbbell_Row',
    'Face pull': 'Face_Pull',
    'Face pulls': 'Face_Pull',
    'Pájaros en banco inclinado': 'Reverse_Flyes',
    'Curl con barra': 'Barbell_Curl',
    'Curl martillo inclinado': 'Hammer_Curls',
    'Prensa': 'Leg_Press',
    'Prensa inclinada': 'Leg_Press',
    'Extensiones de cuádriceps': 'Leg_Extensions',
    'Peso muerto con mancuernas': 'Romanian_Deadlift',
    'Curl femoral tumbado': 'Lying_Leg_Curls',
    'Curl femoral': 'Lying_Leg_Curls',
    'Curl femoral máquina': 'Lying_Leg_Curls',
    'Hip thrust': 'Barbell_Hip_Thrust',
    'Elevación de talones sentado': 'Standing_Calf_Raises',
    'Press banca plano': 'Dumbbell_Bench_Press',
    'Remo sentado': 'Seated_Cable_Rows',
    'Press militar sentado': 'Standing_Military_Press',
    'Curl bíceps máquina': 'Machine_Preacher_Curls',
    'Press francés': 'Lying_Dumbbell_Tricep_Extension',
    'Sentadilla': 'Barbell_Squat',
    'Sentadilla trasera': 'Barbell_Squat',
    'Zancadas': 'Dumbbell_Lunges',
    'Peso muerto': 'Barbell_Deadlift',
    'Rueda abdominal': 'Ab_Crunch_Machine',
    'Plancha': 'Ab_Crunch_Machine'
};

const BASE_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

/**
 * Obtener URL de imagen de ejercicio (0 = inicio, 1 = final/contracción)
 */
export function getExerciseImageUrl(exerciseName, imageIndex = 0, exerciseDbId = null) {
    const id = exerciseDbId || exerciseImageMap[exerciseName];
    if (!id) return null;
    return `${BASE_URL}/${id}/${imageIndex}.jpg`;
}

/**
 * Obtener el par de imágenes (inicio y fin) para crear animación
 */
export function getExerciseImages(exerciseName, exerciseDbId = null) {
    const id = exerciseDbId || exerciseImageMap[exerciseName];
    if (!id) return null;
    return [
        `${BASE_URL}/${id}/0.jpg`,
        `${BASE_URL}/${id}/1.jpg`
    ];
}
