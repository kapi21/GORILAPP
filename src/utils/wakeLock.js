import NoSleep from 'nosleep.js';

// Utilidad infalible para mantener la pantalla siempre encendida durante el entrenamiento
// Integra NoSleep.js (emulación multimedia para iOS y Android en HTTP/PWA) + WakeLock API nativa

let noSleepInstance = null;
let wakeLock = null;
let isRequested = false;

function getNoSleep() {
    if (!noSleepInstance) {
        noSleepInstance = new NoSleep();
    }
    return noSleepInstance;
}

/**
 * Solicita mantener la pantalla encendida
 * Debe llamarse preferiblemente tras un toque o click de usuario (iniciar entreno, añadir serie, etc.)
 * @returns {Promise<boolean>}
 */
export async function requestWakeLock() {
    isRequested = true;
    let success = false;

    // 1. Activar NoSleep.js (compatible con iOS Safari, Android Chrome, HTTP y PWA)
    try {
        const ns = getNoSleep();
        await ns.enable();
        success = true;
        console.log('[GorilApp] NoSleep activado (pantalla fija)');
    } catch (err) {
        console.warn('[GorilApp] Error activando NoSleep:', err);
    }

    // 2. Activar Wake Lock API nativo si el navegador y el contexto lo permiten
    if ('wakeLock' in navigator) {
        try {
            if (!wakeLock || wakeLock.released) {
                wakeLock = await navigator.wakeLock.request('screen');
                wakeLock.addEventListener('release', () => {
                    console.log('[GorilApp] Wake Lock nativo liberado por el sistema');
                });
                success = true;
                console.log('[GorilApp] Wake Lock nativo activado');
            }
        } catch (err) {
            console.warn('[GorilApp] Wake Lock nativo no disponible en este contexto:', err.message);
        }
    }

    return success;
}

/**
 * Libera el bloqueo de pantalla al terminar la sesión
 */
export function releaseWakeLock() {
    isRequested = false;

    if (wakeLock !== null) {
        try {
            wakeLock.release();
        } catch (err) {
            console.warn('[GorilApp] Error al liberar Wake Lock nativo:', err.message);
        } finally {
            wakeLock = null;
        }
    }

    if (noSleepInstance) {
        try {
            noSleepInstance.disable();
            console.log('[GorilApp] NoSleep desactivado');
        } catch (err) {
            console.warn('[GorilApp] Error desactivando NoSleep:', err);
        }
    }
}

/**
 * Indica si la pantalla activa está solicitada
 * @returns {boolean}
 */
export function isWakeLockActive() {
    return isRequested;
}

// Reactivación al volver a la pestaña si la sesión sigue activa
document.addEventListener('visibilitychange', async () => {
    if (isRequested && document.visibilityState === 'visible') {
        await requestWakeLock();
    }
});
