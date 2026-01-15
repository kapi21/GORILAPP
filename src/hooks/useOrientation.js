import { useState, useEffect } from 'react';

/**
 * Custom hook to detect device orientation
 * @returns {'portrait' | 'landscape'} Current orientation
 */
export function useOrientation() {
    const [orientation, setOrientation] = useState(() => {
        // Initial orientation
        if (typeof window !== 'undefined') {
            return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
        }
        return 'portrait';
    });

    useEffect(() => {
        const handleOrientationChange = () => {
            const newOrientation = window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
            setOrientation(newOrientation);
        };

        // Listen to resize events (works on all devices)
        window.addEventListener('resize', handleOrientationChange);

        // Also listen to orientationchange event if available
        if ('onorientationchange' in window) {
            window.addEventListener('orientationchange', handleOrientationChange);
        }

        return () => {
            window.removeEventListener('resize', handleOrientationChange);
            if ('onorientationchange' in window) {
                window.removeEventListener('orientationchange', handleOrientationChange);
            }
        };
    }, []);

    return orientation;
}
