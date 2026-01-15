/**
 * Timer utility functions
 */

/**
 * Format seconds to HH:MM:SS or MM:SS format
 * @param {number} totalSeconds - Total seconds to format
 * @param {boolean} includeHours - Whether to include hours (default: true)
 * @returns {string} Formatted time string
 * @returns {string} Formatted time string
 */
export function formatTime(totalSeconds) {
    const pad = (num) => String(num).padStart(2, '0');

    // Force MM:SS format (total minutes : seconds)
    // This supports > 60 minutes (e.g. 90:00) and fits 4 digits + colon better
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${pad(minutes)}:${pad(seconds)}`;
}

/**
 * Parse time string to seconds
 * @param {string} timeString - Time string in format "MM:SS" or "HH:MM:SS"
 * @returns {number} Total seconds
 */
export function parseTimeToSeconds(timeString) {
    const parts = timeString.split(':').map(Number);

    if (parts.length === 2) {
        // MM:SS
        return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
        // HH:MM:SS
        return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }

    return 0;
}

/**
 * Validate timer configuration
 * @param {Object} config - Timer configuration object
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateTimerConfig(config) {
    const errors = [];

    if (config.workTime !== undefined && config.workTime <= 0) {
        errors.push('El tiempo de trabajo debe ser mayor a 0');
    }

    if (config.restTime !== undefined && config.restTime < 0) {
        errors.push('El tiempo de descanso no puede ser negativo');
    }

    if (config.rounds !== undefined && config.rounds <= 0) {
        errors.push('El número de rondas debe ser mayor a 0');
    }

    if (config.duration !== undefined && config.duration <= 0) {
        errors.push('La duración debe ser mayor a 0');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * Calculate total workout time
 * @param {number} workTime - Work time in seconds
 * @param {number} restTime - Rest time in seconds
 * @param {number} rounds - Number of rounds
 * @returns {number} Total time in seconds
 */
export function calculateTotalTime(workTime, restTime, rounds) {
    return (workTime + restTime) * rounds;
}
