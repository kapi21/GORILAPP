import { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import SevenSegmentDisplay from './SevenSegmentDisplay';
import TimerControls from './TimerControls';
import CountdownStart from './CountdownStart';
import { formatTime } from '../../utils/timerUtils';
import { playStartSound, playLongBeep } from '../../utils/timerSounds';
import { useOrientation } from '../../hooks/useOrientation';

export default function ForTimeTimer({ onBack }) {
    const [seconds, setSeconds] = useState(0);
    const [isRunning, setIsRunning] = useState(false);

    const [finalTime, setFinalTime] = useState(null);
    const [showCountdown, setShowCountdown] = useState(true);
    const intervalRef = useRef(null);
    const orientation = useOrientation();

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setSeconds(prev => prev + 1);
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
    }, [isRunning]);

    const handleStart = () => {
        playStartSound();
        setIsRunning(true);
        setFinalTime(null);
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setSeconds(0);
        setFinalTime(null);
    };

    const handleStop = () => {
        setIsRunning(false);
        setFinalTime(seconds);
        playLongBeep();
    };

    const handleCountdownComplete = () => {
        setShowCountdown(false);
        // Start timer automatically after countdown
        playStartSound();
        setIsRunning(true);
    };

    if (showCountdown) {
        return <CountdownStart
            duration={10}
            onComplete={handleCountdownComplete}
            onCancel={() => {
                setShowCountdown(false);
                onBack();
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
                            FOR TIME
                        </h3>
                    </div>
                </div>
            </div>

            {/* Main Timer Display */}
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
                    time={formatTime(seconds)}
                    size={orientation === 'landscape' ? 'lg' : 'md'}
                />

                {finalTime !== null && (
                    <div style={{
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-lg)',
                        padding: 'var(--spacing-lg)',
                        textAlign: 'center',
                        border: '2px solid var(--success)'
                    }}>
                        <div style={{ color: 'var(--success)', fontSize: '0.875rem', marginBottom: 'var(--spacing-sm)' }}>
                            ✓ TIEMPO FINAL
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>
                            {formatTime(finalTime)}
                        </div>
                    </div>
                )}

                <TimerControls
                    isRunning={isRunning}
                    onStart={handleStart}
                    onPause={handlePause}
                    onReset={handleReset}
                    onStop={handleStop}
                    showStop={true}
                />
            </div>
        </div>
    );
}
