import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import SevenSegmentDisplay from './SevenSegmentDisplay';
import { playBeep, playLongBeep } from '../../utils/timerSounds';
import { useOrientation } from '../../hooks/useOrientation';

export default function CountdownStart({ duration = 10, onComplete, onCancel }) {
    const [countdown, setCountdown] = useState(duration);
    const orientation = useOrientation();

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => {
                const newCount = countdown - 1;
                setCountdown(newCount);

                // Play beeps in last 3 seconds
                if (newCount === 3 || newCount === 2 || newCount === 1) {
                    playBeep(800, 200, 0.4);
                } else if (newCount === 0) {
                    playLongBeep();
                    setTimeout(() => {
                        if (onComplete) onComplete();
                    }, 500);
                }
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [countdown, onComplete]);

    return (
        <div className="animate-fadeIn" style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--bg-dark)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
        }}>
            {onCancel && (
                <button
                    onClick={onCancel}
                    className="btn btn-secondary"
                    style={{
                        position: 'absolute',
                        top: 'var(--spacing-md)',
                        right: 'var(--spacing-md)',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '12px 20px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}
                >
                    <X size={24} />
                    <span style={{ fontWeight: 600 }}>CANCELAR</span>
                </button>
            )}

            <div style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--spacing-xl)'
            }}>
                <div style={{
                    fontSize: '1.5rem',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    fontWeight: 800,
                    marginBottom: 'var(--spacing-md)'
                }}>
                    PREPARATE
                </div>

                <SevenSegmentDisplay
                    time={countdown.toString().padStart(2, '0')}
                    size={orientation === 'landscape' ? 'lg' : 'md'}
                />

                <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {countdown <= 3 && countdown > 0 && (
                        <div style={{
                            fontSize: '2rem',
                            color: '#FF3333',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            animation: 'pulse 0.5s ease-in-out infinite'
                        }}>
                            ¡YA!
                        </div>
                    )}

                    {countdown === 0 && (
                        <div style={{
                            fontSize: '3rem',
                            color: 'var(--success)',
                            fontWeight: 800,
                            textTransform: 'uppercase',
                            animation: 'pulse 0.5s ease-in-out'
                        }}>
                            ¡VAMOS!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
