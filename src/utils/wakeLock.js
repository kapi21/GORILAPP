// Wake Lock API utility to keep screen awake during workouts

let wakeLock = null;

/**
 * Request wake lock to keep screen on
 * @returns {Promise<boolean>} Success status
 */
export async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');

            wakeLock.addEventListener('release', () => {
                console.log('Wake Lock released');
            });

            console.log('Wake Lock activated');
            return true;
        } else {
            console.warn('Wake Lock API not supported');
            return false;
        }
    } catch (err) {
        console.error(`Wake Lock error: ${err.name}, ${err.message}`);
        return false;
    }
}

/**
 * Release wake lock to allow screen to turn off
 * @returns {Promise<void>}
 */
export async function releaseWakeLock() {
    if (wakeLock !== null) {
        try {
            await wakeLock.release();
            wakeLock = null;
            console.log('Wake Lock released manually');
        } catch (err) {
            console.error(`Wake Lock release error: ${err.message}`);
        }
    }
}

/**
 * Check if wake lock is currently active
 * @returns {boolean}
 */
export function isWakeLockActive() {
    return wakeLock !== null && !wakeLock.released;
}

// Re-request wake lock when page becomes visible again
document.addEventListener('visibilitychange', async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        await requestWakeLock();
    }
});
