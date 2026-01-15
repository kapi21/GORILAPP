import { useState, useEffect } from 'react';
import { Play, SkipForward } from 'lucide-react';

export default function PrepTimer({ setNumber, totalSets, onComplete, onSkip }) {
    const [timeLeft, setTimeLeft] = useState(10); // 10 seconds prep time
    const [isActive, setIsActive] = useState(true);

    useEffect(() => {
        if (!isActive || timeLeft === 0) {
            if (timeLeft === 0) {
                // Play beep sound
                playBeep();
                onComplete();
            }
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft, isActive, onComplete]);

    function playBeep() {
        // Create audio context for beep sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800; // Frequency in Hz
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);

        // Vibrate if available
        if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
        }
    }

    const progress = ((10 - timeLeft) / 10) * 100;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 'var(--spacing-xl)'
        }}>
            {/* Header */}
            <div style={{ textAlign: 'center' }}>
                <h2 style={{
                    fontSize: '1.5rem',
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--text-secondary)'
                }}>
                    Prepárate para
                </h2>
                <h1 style={{
                    fontSize: '2.5rem',
                    margin: 0,
                    background: 'var(--gradient-accent)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Serie {setNumber} / {totalSets}
                </h1>
            </div>

            {/* Circular Timer */}
            <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                {/* Background Circle */}
                <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke="var(--bg-input)"
                        strokeWidth="10"
                    />
                    <circle
                        cx="100"
                        cy="100"
                        r="90"
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="10"
                        strokeDasharray={`${2 * Math.PI * 90}`}
                        strokeDashoffset={`${2 * Math.PI * 90 * (1 - progress / 100)}`}
                        style={{ transition: 'stroke-dashoffset 1s linear' }}
                    />
                </svg>

                {/* Timer Number */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: '4rem',
                    fontWeight: 700,
                    color: 'white'
                }}>
                    {timeLeft}
                </div>
            </div>

            {/* Skip Button */}
            <button
                onClick={onSkip}
                className="btn btn-secondary btn-lg"
                style={{ minWidth: '200px' }}
            >
                <SkipForward size={24} />
                Saltar
            </button>

            {/* Progress Text */}
            <p style={{
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
                textAlign: 'center'
            }}>
                El timer comenzará automáticamente
            </p>
        </div>
    );
}
