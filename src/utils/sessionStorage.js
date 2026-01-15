// Session persistence utilities using localStorage

const SESSION_KEY = 'gorilapp_active_session';

/**
 * Save current session state to localStorage
 */
export function saveSession(sessionData) {
    try {
        const data = {
            ...sessionData,
            timestamp: Date.now()
        };
        localStorage.setItem(SESSION_KEY, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving session:', error);
        return false;
    }
}

/**
 * Get saved session from localStorage
 */
export function getSavedSession() {
    try {
        const data = localStorage.getItem(SESSION_KEY);
        if (!data) return null;

        const session = JSON.parse(data);

        // Check if session is not too old (24 hours)
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        if (Date.now() - session.timestamp > maxAge) {
            clearSession();
            return null;
        }

        return session;
    } catch (error) {
        console.error('Error loading session:', error);
        return null;
    }
}

/**
 * Clear saved session
 */
export function clearSession() {
    try {
        localStorage.removeItem(SESSION_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing session:', error);
        return false;
    }
}

/**
 * Check if there's a saved session
 */
export function hasSavedSession() {
    return getSavedSession() !== null;
}
