import { useState, useEffect, useRef } from 'react';
import { X, Volume2 } from 'lucide-react';

export default function RestTimer({ duration, onComplete, onSkip }) {
    const [timeLeft, setTimeLeft] = useState(duration);
    const audioRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    playSound();
                    vibrate();
                    setTimeout(onComplete, 1000);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [duration, onComplete]);

    function playSound() {
        if (audioRef.current) {
            audioRef.current.play().catch(() => {
                // Ignore if autoplay is blocked
            });
        }
    }

    function vibrate() {
        if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
        }
    }

    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    const progress = ((duration - timeLeft) / duration) * 100;
    const circumference = 2 * Math.PI * 90;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="modal-overlay" onClick={onSkip}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
                    <h3 style={{ margin: 0 }}>Descanso</h3>
                    <button onClick={onSkip} className="btn-icon btn-secondary">
                        <X size={20} />
                    </button>
                </div>

                {/* Circular Progress */}
                <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto var(--spacing-xl)' }}>
                    <svg width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                        <circle
                            cx="100"
                            cy="100"
                            r="90"
                            stroke="var(--border)"
                            strokeWidth="12"
                            fill="none"
                        />
                        <circle
                            cx="100"
                            cy="100"
                            r="90"
                            stroke="url(#gradient)"
                            strokeWidth="12"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 1s linear' }}
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="var(--primary)" />
                                <stop offset="100%" stopColor="var(--secondary)" />
                            </linearGradient>
                        </defs>
                    </svg>

                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '3rem',
                        fontWeight: 700,
                        background: 'var(--gradient-primary)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        {formatTime(timeLeft)}
                    </div>
                </div>

                <button onClick={onSkip} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                    Saltar Descanso
                </button>

                {/* Hidden audio element for notification sound */}
                <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE" />
            </div>
        </div>
    );
}
