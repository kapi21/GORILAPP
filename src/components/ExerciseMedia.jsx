import { useState, useEffect } from 'react';
import { Dumbbell } from 'lucide-react';
import { getExerciseImages } from '../data/exerciseImages';

export default function ExerciseMedia({
    exerciseName,
    exerciseDbId = null,
    gifUrl = '',
    height = '140px',
    width = '100%',
    autoAnimate = true,
    style = {},
    onClick = null
}) {
    const [frameIndex, setFrameIndex] = useState(0);
    const [hasError, setHasError] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const images = getExerciseImages(exerciseName, exerciseDbId);

    // Reset error when exercise changes
    useEffect(() => {
        setHasError(false);
        setIsLoaded(false);
        setFrameIndex(0);
    }, [exerciseName, exerciseDbId, gifUrl]);

    // Animate frames 0 and 1 periodically if autoAnimate is true
    useEffect(() => {
        if (!autoAnimate || gifUrl || !images || images.length < 2 || hasError) return;

        const interval = setInterval(() => {
            setFrameIndex(prev => (prev === 0 ? 1 : 0));
        }, 1100);

        return () => clearInterval(interval);
    }, [autoAnimate, gifUrl, images, hasError]);

    if (gifUrl) {
        return (
            <div
                onClick={onClick}
                style={{
                    height,
                    width,
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 'var(--radius-md)',
                    background: '#121212',
                    cursor: onClick ? 'pointer' : 'default',
                    ...style
                }}
            >
                <img
                    src={gifUrl}
                    alt={exerciseName}
                    onError={() => setHasError(true)}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        display: 'block'
                    }}
                />
            </div>
        );
    }

    if (hasError || !images) {
        return (
            <div
                onClick={onClick}
                style={{
                    height,
                    width,
                    background: 'linear-gradient(135deg, #1f1f1f 0%, #141414 100%)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    color: 'var(--text-muted)',
                    cursor: onClick ? 'pointer' : 'default',
                    border: '1px solid var(--border)',
                    ...style
                }}
            >
                <Dumbbell size={28} style={{ opacity: 0.5 }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.5px' }}>
                    GORILAPP
                </span>
            </div>
        );
    }

    const currentSrc = images[frameIndex] || images[0];

    return (
        <div
            onClick={onClick}
            style={{
                height,
                width,
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 'var(--radius-md)',
                background: '#121212',
                cursor: onClick ? 'pointer' : 'default',
                border: '1px solid var(--border)',
                ...style
            }}
        >
            {/* Hidden preload for the other frame to avoid white flicker */}
            {images[1] && (
                <img
                    src={images[1]}
                    alt=""
                    aria-hidden="true"
                    style={{ display: 'none' }}
                />
            )}

            <img
                src={currentSrc}
                alt={exerciseName}
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    transition: 'opacity 0.2s ease',
                    opacity: isLoaded ? 1 : 0.4
                }}
            />

            {/* Frame Indicator Pill */}
            {images.length > 1 && !hasError && (
                <div style={{
                    position: 'absolute',
                    bottom: '6px',
                    right: '6px',
                    background: 'rgba(0, 0, 0, 0.65)',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    fontSize: '0.65rem',
                    color: 'white',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    backdropFilter: 'blur(4px)'
                }}>
                    {frameIndex === 0 ? 'Fase 1' : 'Fase 2'}
                </div>
            )}
        </div>
    );
}
