import { useState } from 'react';
import { Clock, Zap, Target, Repeat, TrendingUp, ArrowLeft } from 'lucide-react';
import ClockTimer from './timers/ClockTimer';
import TabataTimer from './timers/TabataTimer';
import ForTimeTimer from './timers/ForTimeTimer';
import EmomTimer from './timers/EmomTimer';
import AmrapTimer from './timers/AmrapTimer';

export default function TimerModule({ onBack }) {
    const [selectedMode, setSelectedMode] = useState(null);

    const timerModes = [
        {
            id: 'clock',
            name: 'CLOCK',
            description: 'Cronómetro simple',
            icon: Clock,
            component: ClockTimer
        },
        {
            id: 'tabata',
            name: 'TABATA',
            description: 'Intervalos de trabajo/descanso',
            icon: Zap,
            component: TabataTimer
        },
        {
            id: 'fortime',
            name: 'FOR TIME',
            description: 'Mide el tiempo de tu WOD',
            icon: Target,
            component: ForTimeTimer
        },
        {
            id: 'emom',
            name: 'EMOM',
            description: 'Every Minute On the Minute',
            icon: Repeat,
            component: EmomTimer
        },
        {
            id: 'amrap',
            name: 'AMRAP',
            description: 'As Many Rounds As Possible',
            icon: TrendingUp,
            component: AmrapTimer
        }
    ];

    if (selectedMode) {
        const mode = timerModes.find(m => m.id === selectedMode);
        const TimerComponent = mode.component;

        return (
            <TimerComponent
                onBack={() => setSelectedMode(null)}
            />
        );
    }

    return (
        <div className="animate-fadeIn" style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
            {/* Header */}
            <div style={{
                background: 'var(--gradient-primary)',
                padding: 'var(--spacing-lg)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: 'var(--shadow-md)'
            }}>
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                        <button
                            onClick={onBack}
                            className="btn-icon"
                            style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <h2 style={{ color: 'white', margin: 0 }}>Timer</h2>
                    </div>
                </div>
            </div>

            {/* Timer Mode Selection */}
            <div className="container" style={{ padding: 'var(--spacing-xl) var(--spacing-md)' }}>
                <p style={{
                    color: 'var(--text-secondary)',
                    marginBottom: 'var(--spacing-xl)',
                    textAlign: 'center'
                }}>
                    Selecciona el modo de timer que necesites
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: 'var(--spacing-lg)'
                }}>
                    {timerModes.map(mode => {
                        const Icon = mode.icon;
                        return (
                            <button
                                key={mode.id}
                                onClick={() => setSelectedMode(mode.id)}
                                className="card card-interactive"
                                style={{
                                    textAlign: 'center',
                                    padding: 'var(--spacing-xl)',
                                    cursor: 'pointer',
                                    border: '2px solid var(--border)',
                                    background: 'var(--bg-card)',
                                    transition: 'all var(--transition-base)'
                                }}
                            >
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    margin: '0 auto var(--spacing-lg)',
                                    background: 'var(--gradient-primary)',
                                    borderRadius: 'var(--radius-full)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: 'var(--shadow-md)'
                                }}>
                                    <Icon size={40} color="white" />
                                </div>

                                <h3 style={{
                                    marginBottom: 'var(--spacing-sm)',
                                    fontSize: '1.5rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.05em',
                                    color: 'white'
                                }}>
                                    {mode.name}
                                </h3>

                                <p style={{
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.875rem',
                                    marginBottom: 0
                                }}>
                                    {mode.description}
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
