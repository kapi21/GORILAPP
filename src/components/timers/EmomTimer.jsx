import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import SevenSegmentDisplay from './SevenSegmentDisplay';
import TimerControls from './TimerControls';
import CountdownStart from './CountdownStart';
import { formatTime } from '../../utils/timerUtils';
import { playStartSound, playLongBeep, playBeep } from '../../utils/timerSounds';
import { useOrientation } from '../../hooks/useOrientation';

export default function EmomTimer({ onBack }) {
    const [totalMinutes, setTotalMinutes] = useState(10);
    const [currentMinute, setCurrentMinute] = useState(1);
    const [secondsInMinute, setSecondsInMinute] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isConfiguring, setIsConfiguring] = useState(true);
    const [showCountdown, setShowCountdown] = useState(false);
    const intervalRef = useRef(null);
    const orientation = useOrientation();

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setSecondsInMinute(prev => {
                    if (prev === 59) {
                        // New minute starting
                        playBeep(1000, 300, 0.4);

                        if (currentMinute >= totalMinutes) {
                            // Workout complete
                            playLongBeep();
                            setIsRunning(false);
                            return 0;
                        }

                        setCurrentMinute(m => m + 1);
                        return 0;
                    }
                    return prev + 1;
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
    }, [isRunning, currentMinute, totalMinutes]);

    const handleStart = () => {
        if (isConfiguring) {
            setCurrentMinute(1);
            setSecondsInMinute(0);
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
        setCurrentMinute(1);
        setSecondsInMinute(0);
        setIsConfiguring(true);
    };

    const adjustMinutes = (amount) => {
        setTotalMinutes(Math.max(1, totalMinutes + amount));
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
                                EMOM - Configuración
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
                            <button onClick={() => adjustMinutes(-1)} className="btn btn-secondary btn-lg">
                                <Minus size={24} />
                            </button>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--primary)' }}>
                                    {totalMinutes}
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    minutos
                                </div>
                            </div>
                            <button onClick={() => adjustMinutes(1)} className="btn btn-secondary btn-lg">
                                <Plus size={24} />
                            </button>
                        </div>

                        <button onClick={handleStart} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                            Iniciar EMOM
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

    const timeRemaining = 60 - secondsInMinute;

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
                            EMOM
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
                {/* Round Counter */}
                <div style={{
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--spacing-md)',
                    minWidth: '200px',
                    textAlign: 'center'
                }}>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--spacing-xs)' }}>
                        MINUTO
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {currentMinute} / {totalMinutes}
                    </div>
                </div>

                <SevenSegmentDisplay
                    time={formatTime(timeRemaining, false)}
                    size={orientation === 'landscape' ? 'lg' : 'md'}
                    label="TIEMPO RESTANTE"
                />

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
