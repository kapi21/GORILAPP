/**
 * Timer sound effects using Web Audio API
 */

let audioContext = null;

/**
 * Initialize audio context (call this on user interaction)
 */
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

/**
 * Play a beep sound
 * @param {number} frequency - Frequency in Hz (default: 800)
 * @param {number} duration - Duration in milliseconds (default: 100)
 * @param {number} volume - Volume 0-1 (default: 0.3)
 */
export function playBeep(frequency = 800, duration = 100, volume = 0.3) {
    try {
        const ctx = initAudioContext();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration / 1000);
    } catch (error) {
        console.warn('Could not play beep:', error);
    }
}

/**
 * Play a long beep sound (for timer completion)
 */
export function playLongBeep() {
    playBeep(1000, 500, 0.4);
}

/**
 * Play a start sound (ascending beep)
 */
export function playStartSound() {
    playBeep(600, 100, 0.3);
    setTimeout(() => playBeep(800, 100, 0.3), 150);
    setTimeout(() => playBeep(1000, 200, 0.4), 300);
}

/**
 * Play countdown beeps (3-2-1)
 * @param {Function} onComplete - Callback when countdown completes
 */
export function playCountdownBeeps(onComplete) {
    playBeep(800, 200, 0.3);

    setTimeout(() => {
        playBeep(800, 200, 0.3);
    }, 1000);

    setTimeout(() => {
        playBeep(800, 200, 0.3);
    }, 2000);

    setTimeout(() => {
        playLongBeep();
        if (onComplete) onComplete();
    }, 3000);
}

/**
 * Play warning sound (for last 10 seconds)
 */
export function playWarningBeep() {
    playBeep(1200, 150, 0.35);
}

/**
 * Play phase change sound (for TABATA work/rest transitions)
 */
export function playPhaseChangeSound() {
    playBeep(900, 300, 0.4);
}
