import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import SevenSegmentDisplay from './SevenSegmentDisplay';
import TimerControls from './TimerControls';
import CountdownStart from './CountdownStart';
import { formatTime } from '../../utils/timerUtils';
import { playStartSound, playLongBeep, playPhaseChangeSound } from '../../utils/timerSounds';
import { useOrientation } from '../../hooks/useOrientation';

export default function TabataTimer({ onBack }) {
    const [workTime, setWorkTime] = useState(20);
    const [restTime, setRestTime] = useState(10);
    const [rounds, setRounds] = useState(8);
    const [currentRound, setCurrentRound] = useState(1);
    const [timeRemaining, setTimeRemaining] = useState(20);
    const [isWork, setIsWork] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [isConfiguring, setIsConfiguring] = useState(true);
    const [showCountdown, setShowCountdown] = useState(false);
    const intervalRef = useRef(null);
    const orientation = useOrientation();

    useEffect(() => {
        if (isRunning && timeRemaining > 0) {
            intervalRef.current = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev === 1) {
                        // Phase change
                        if (isWork) {
                            // Switch to rest
                            playPhaseChangeSound();
                            setIsWork(false);
                            return restTime;
                        } else {
                            // Switch to work or finish
                            if (currentRound >= rounds) {
                                // Workout complete
                                playLongBeep();
                                setIsRunning(false);
                                return 0;
                            }

                            playPhaseChangeSound();
                            setCurrentRound(r => r + 1);
                            setIsWork(true);
                            return workTime;
                        }
                    }
                    return prev - 1;
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
    }, [isRunning, timeRemaining, isWork, currentRound, rounds, workTime, restTime]);

    const handleStart = () => {
        if (isConfiguring) {
            setCurrentRound(1);
            setTimeRemaining(workTime);
            setIsWork(true);
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
        setCurrentRound(1);
        setTimeRemaining(workTime);
        setIsWork(true);
        setIsConfiguring(true);
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
                                TABATA - Configuración
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="container" style={{ padding: 'var(--spacing-xl)' }}>
                    <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
                        {/* Work Time */}
                        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                            <h4 style={{ marginBottom: 'var(--spacing-md)', textAlign: 'center' }}>
                                Tiempo de Trabajo
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                <button onClick={() => setWorkTime(Math.max(5, workTime - 5))} className="btn btn-secondary">
                                    <Minus size={20} />
                                </button>
                                <div style={{ flex: 1, textAlign: 'center' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>
                                        {workTime}s
                                    </div>
                                </div>
                                <button onClick={() => setWorkTime(workTime + 5)} className="btn btn-secondary">
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Rest Time */}
                        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                            <h4 style={{ marginBottom: 'var(--spacing-md)', textAlign: 'center' }}>
                                Tiempo de Descanso
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                <button onClick={() => setRestTime(Math.max(5, restTime - 5))} className="btn btn-secondary">
                                    <Minus size={20} />
                                </button>
                                <div style={{ flex: 1, textAlign: 'center' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning)' }}>
                                        {restTime}s
                                    </div>
                                </div>
                                <button onClick={() => setRestTime(restTime + 5)} className="btn btn-secondary">
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Rounds */}
                        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                            <h4 style={{ marginBottom: 'var(--spacing-md)', textAlign: 'center' }}>
                                Número de Rondas
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                                <button onClick={() => setRounds(Math.max(1, rounds - 1))} className="btn btn-secondary">
                                    <Minus size={20} />
                                </button>
                                <div style={{ flex: 1, textAlign: 'center' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>
                                        {rounds}
                                    </div>
                                </div>
                                <button onClick={() => setRounds(rounds + 1)} className="btn btn-secondary">
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        <button onClick={handleStart} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                            Iniciar TABATA
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
        <div className="animate-fadeIn" style={{
            minHeight: '100vh',
            background: isWork ? '#001a00' : '#1a0000',
            display: 'flex',
            flexDirection: 'column',
            transition: 'background 0.5s ease'
        }}>
            <div style={{
                background: isWork ? 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)' : 'linear-gradient(135deg, #FF9800 0%, #E65100 100%)',
                padding: 'var(--spacing-md)',
                boxShadow: 'var(--shadow-md)',
                transition: 'background 0.5s ease'
            }}>
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                        <button onClick={onBack} className="btn-icon" style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white' }}>
                            <ArrowLeft size={24} />
                        </button>
                        <h3 style={{ color: 'white', margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                            TABATA - {isWork ? 'TRABAJO' : 'DESCANSO'}
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
                        RONDA
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>
                        {currentRound} / {rounds}
                    </div>
                </div>

                <SevenSegmentDisplay
                    time={formatTime(timeRemaining, false)}
                    size={orientation === 'landscape' ? 'lg' : 'md'}
                    label={isWork ? 'TRABAJO' : 'DESCANSO'}
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
