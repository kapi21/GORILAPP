/**
 * Timer sound effects using Web Audio API
 */

let audioContext = null;
const soundBuffers = {};

/**
 * Initialize audio context (call this on user interaction)
 */
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    return audioContext;
}

// Load sound file into buffer
async function loadSound(name, url) {
    try {
        const ctx = initAudioContext();
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        soundBuffers[name] = audioBuffer;
    } catch (error) {
        console.warn(`Failed to load sound ${name} from ${url}:`, error);
    }
}

// Preload sounds
export async function preloadSounds() {
    await Promise.all([
        loadSound('beep', '/assets/sounds/bip1.mp3'),
        loadSound('countdown', '/assets/sounds/bip2.mp3'),
        loadSound('long', '/assets/sounds/bip3.mp3'),
        loadSound('start', '/assets/sounds/doublebip.mp3'), // Or use this for transition
        loadSound('end', '/assets/sounds/doublebip.mp3')
    ]);
}

// Play a preloaded sound
function playSound(name, volume = 1.0) {
    try {
        const ctx = initAudioContext();
        const buffer = soundBuffers[name];
        if (!buffer) {
            console.warn(`Sound ${name} not loaded.`);
            return;
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const gainNode = ctx.createGain();

        source.connect(gainNode);
        gainNode.connect(ctx.destination);

        gainNode.gain.value = volume;
        source.start(0);
    } catch (error) {
        console.warn('Error playing sound:', error);
    }
}

// --- Specific Sound Functions (Mapped to Velites Assets) ---

export function playBeep(volume = 1.0) {
    // Standard beep (bip1.mp3)
    playSound('beep', volume);
}

export function playStartBeep(volume = 1.0) {
    // Start/Transition beep (doublebip.mp3)
    playSound('start', volume);
}

export function playFinalBeep(volume = 1.0) {
    // Long final beep (bip3.mp3)
    playSound('long', volume);
}

export function playCountdownBeep(frequency = 800, duration = 100, volume = 1.0) {
    // Countdown beep (bip2.mp3)
    // Ignored frequency/duration to use the real sound
    playSound('countdown', volume);
}

// Initialize on load
preloadSounds();

/**
 * Play a long beep sound (for timer completion)
 */
export function playLongBeep() {
    playFinalBeep();
}

/**
 * Play a start sound (ascending beep)
 */
export function playStartSound() {
    playStartBeep();
}

/**
 * Play countdown beeps (3-2-1)
 * @param {Function} onComplete - Callback when countdown completes
 */
export function playCountdownBeeps(onComplete) {
    playCountdownBeep(1.0);

    setTimeout(() => {
        playCountdownBeep(1.0);
    }, 1000);

    setTimeout(() => {
        playCountdownBeep(1.0);
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
    playCountdownBeep(1.0);
}

/**
 * Play phase change sound (for TABATA work/rest transitions)
 */
export function playPhaseChangeSound() {
    playStartBeep(1.0);
}
