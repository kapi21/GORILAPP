import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import SevenSegmentDisplay from './SevenSegmentDisplay';
import TimerControls from './TimerControls';
import CountdownStart from './CountdownStart';
import { formatTime } from '../../utils/timerUtils';
import { playStartSound, playLongBeep, playWarningBeep } from '../../utils/timerSounds';
import { useOrientation } from '../../hooks/useOrientation';

export default function AmrapTimer({ onBack }) {
    const [duration, setDuration] = useState(600); // 10 minutes default
    const [timeRemaining, setTimeRemaining] = useState(600);
    const [rounds, setRounds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isConfiguring, setIsConfiguring] = useState(true);
    const [showCountdown, setShowCountdown] = useState(false);
    const intervalRef = useRef(null);
    const orientation = useOrientation();

    useEffect(() => {
        if (isRunning && timeRemaining > 0) {
            intervalRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    const newTime = prev - 1;

                    // Warning beep in last 10 seconds
                    if (newTime <= 10 && newTime > 0) {
                        playWarningBeep();
                    }

                    // Finish
                    if (newTime === 0) {
                        playLongBeep();
                        setIsRunning(false);
                    }

                    return newTime;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, timeRemaining]);

    const handleStart = () => {
        if (isConfiguring) {
            setTimeRemaining(duration);
            setIsConfiguring(false);
            setShowCountdown(true);
        } else {
            playStartSound();
            setIsRunning(true);
        }
    };

    const handleCountdownComplete = () => {
        setShowCountdown(false);
        playStartSound();
        setIsRunning(true);
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimeRemaining(duration);
        setRounds(0);
        setIsConfiguring(true);
    };

    const adjustDuration = (minutes) => {
        const newDuration = Math.max(60, duration + (minutes * 60));
        setDuration(newDuration);
        if (isConfiguring) {
            setTimeRemaining(newDuration);
        }
    };

    if (isConfiguring) {
        return (
            <div className="animate-fadeIn" style={{ minHeight: '100vh', background: '#000000' }}>
                <div style={{
                    background: 'var(--gradient-primary)',
                    padding: 'var(--spacing-md)',
                    boxShadow: 'var(--shadow-md)'
                }}>
                    <div className="container">
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                            <button onClick={onBack} className="btn-icon" style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
                                <ArrowLeft size={24} />
                            </button>
                            <h3 style={{ color: 'white', margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                                AMRAP - Configuración
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="container" style={{ padding: 'var(--spacing-xl)' }}>
                    <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                        <h4 style={{ marginBottom: 'var(--spacing-lg)', textAlign: 'center' }}>
                            Duración Total
                        </h4>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                            <button onClick={() => adjustDuration(-1)} className="btn btn-secondary btn-lg">
                                <Minus size={24} />
                            </button>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--primary)' }}>
                                    {Math.floor(duration / 60)}
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    minutos
                                </div>
                            </div>
                            <button onClick={() => adjustDuration(1)} className="btn btn-secondary btn-lg">
                                <Plus size={24} />
                            </button>
                        </div>

                        <button onClick={handleStart} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                            Iniciar AMRAP
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (showCountdown) {
        return <CountdownStart
            duration={10}
            onComplete={handleCountdownComplete}
            onCancel={() => {
                setShowCountdown(false);
                setIsConfiguring(true);
            }}
        />;
    }

    return (
        <div className="animate-fadeIn" style={{ minHeight: '100vh', background: '#000000', display: 'flex', flexDirection: 'column' }}>
            <div style={{
                background: 'var(--gradient-primary)',
                padding: 'var(--spacing-md)',
                boxShadow: 'var(--shadow-md)'
            }}>
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                        <button onClick={onBack} className="btn-icon" style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
                            <ArrowLeft size={24} />
                        </button>
                        <h3 style={{ color: 'white', margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                            AMRAP
                        </h3>
                    </div>
                </div>
            </div>

            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--spacing-md)',
                gap: 'var(--spacing-lg)',
                maxHeight: '100%',
                overflow: 'hidden'
            }}>
                <SevenSegmentDisplay
                    time={formatTime(timeRemaining)}
                    size={orientation === 'landscape' ? 'lg' : 'md'}
                    label="TIEMPO RESTANTE"
                />

                {/* Rounds Counter */}
                <div style={{
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--spacing-md)',
                    minWidth: '250px',
                    textAlign: 'center'
                }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)' }}>
                        RONDAS COMPLETADAS
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
                        <button
                            onClick={() => setRounds(Math.max(0, rounds - 1))}
                            className="btn btn-secondary"
                            disabled={!isRunning}
                        >
                            <Minus size={20} />
                        </button>
                        <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)', minWidth: '80px' }}>
                            {rounds}
                        </div>
                        <button
                            onClick={() => setRounds(rounds + 1)}
                            className="btn btn-secondary"
                            disabled={!isRunning}
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                <TimerControls
                    isRunning={isRunning}
                    onStart={handleStart}
                    onPause={handlePause}
                    onReset={handleReset}
                />
            </div>
        </div>
    );
}
