// Mapeo de nombres de ejercicios en español a IDs de free-exercise-db
export const exerciseImageMap = {
    // Día 1 - Empuje
    'Press banca plano': 'Barbell_Bench_Press',
    'Press inclinado': 'Barbell_Incline_Bench_Press',
    'Aperturas': 'Dumbbell_Flyes',
    'Press militar de pie': 'Standing_Military_Press',
    'Elevaciones laterales': 'Dumbbell_Lateral_Raise',
    'Fondos en paralelas': 'Dips',
    'Extensiones de tríceps': 'Dumbbell_Tricep_Extension',

    // Día 2 - Tirón
    'Dominadas': 'Pull_Ups',
    'Remo con barra': 'Barbell_Bent_Over_Row',
    'Jalón al pecho': 'Wide_Grip_Lat_Pulldown',
    'Remo con mancuerna': 'One_Arm_Dumbbell_Row',
    'Face pulls': 'Face_Pull',
    'Curl con barra': 'Barbell_Curl',
    'Curl martillo': 'Hammer_Curls',

    // Día 3 - Pierna
    'Sentadilla': 'Barbell_Full_Squat',
    'Peso muerto': 'Barbell_Deadlift',
    'Prensa': 'Leg_Press',
    'Zancadas': 'Dumbbell_Lunges',
    'Curl femoral': 'Lying_Leg_Curls',
    'Extensiones de cuádriceps': 'Leg_Extensions',
    'Elevaciones de gemelos': 'Standing_Calf_Raises'
};

/**
 * Get exercise image URL from free-exercise-db GitHub repository
 * @param {string} exerciseName - Name of exercise in Spanish
 * @param {number} imageIndex - Image index (0 = start position, 1 = end position)
 * @returns {string|null} Image URL or null if not found
 */
export function getExerciseImageUrl(exerciseName, imageIndex = 0) {
    const exerciseId = exerciseImageMap[exerciseName];
    if (!exerciseId) return null;

    const baseUrl = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';
    return `${baseUrl}/${exerciseId}/${imageIndex}.jpg`;
}

/**
 * Get both exercise images (start and end positions)
 * @param {string} exerciseName - Name of exercise in Spanish
 * @returns {Array<string>|null} Array of image URLs or null if not found
 */
export function getExerciseImages(exerciseName) {
    const exerciseId = exerciseImageMap[exerciseName];
    if (!exerciseId) return null;

    const baseUrl = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';
    return [
        `${baseUrl}/${exerciseId}/0.jpg`,
        `${baseUrl}/${exerciseId}/1.jpg`
    ];
}
