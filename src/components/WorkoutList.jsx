import { useState, useEffect, useCallback } from 'react';
import { ChevronRight, Calendar, Play, Pause, X, Dumbbell, Layers } from 'lucide-react';
import { getWorkouts, getSessionsByWorkout } from '../db/database';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getSavedSession, clearSession } from '../utils/sessionStorage';

export default function WorkoutList({ onSelectWorkout }) {
    const [workouts, setWorkouts] = useState([]);
    const [sessionStats, setSessionStats] = useState({}); // workoutId -> { count, lastSession }
    const [pausedSession, setPausedSession] = useState(null);

    const loadPausedSession = useCallback(() => {
        const saved = getSavedSession();
        setPausedSession(saved);
    }, []);

    const loadWorkouts = useCallback(async () => {
        const workoutList = await getWorkouts();
        setWorkouts(workoutList);

        const stats = {};
        await Promise.all(
            workoutList.map(async (w) => {
                const sessions = await getSessionsByWorkout(w.id, 50);
                stats[w.id] = {
                    count: sessions.length,
                    lastSession: sessions.length > 0 ? sessions[0] : null
                };
            })
        );
        setSessionStats(stats);
    }, []);

    useEffect(() => {
        loadWorkouts();
        loadPausedSession();
    }, [loadWorkouts, loadPausedSession]);

    function handleContinueSession() {
        if (pausedSession) {
            const workout = workouts.find(w => w.id === pausedSession.workoutId);
            if (workout) {
                onSelectWorkout(workout, pausedSession);
            }
        }
    }

    function handleDiscardSession() {
        clearSession();
        setPausedSession(null);
    }

    const workoutColors = [
        'linear-gradient(135deg, #D32F2F 0%, #8B0000 100%)',
        'linear-gradient(135deg, #C62828 0%, #4A0E0E 100%)',
        'linear-gradient(135deg, #B71C1C 0%, #3B0000 100%)',
        'linear-gradient(135deg, #E53935 0%, #7F0000 100%)'
    ];

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-xl)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
                <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--primary-light)', fontWeight: 800, letterSpacing: '0.5px' }}>
                        MESOCICLO ACTIVO
                    </span>
                    <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Rutina Septiembre</h2>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.85rem',
                    background: 'var(--bg-card)',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)'
                }}>
                    <Layers size={16} />
                    <span>{workouts.length} sesiones</span>
                </div>
            </div>

            {/* Paused Session Indicator */}
            {pausedSession && (
                <div className="card" style={{
                    marginBottom: 'var(--spacing-xl)',
                    background: 'linear-gradient(135deg, #FF6B6B 0%, #D32F2F 100%)',
                    border: '2px solid var(--primary)',
                    color: 'white'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'rgba(255, 255, 255, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Pause size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: 0, marginBottom: 'var(--spacing-xs)' }}>Sesión en progreso</h3>
                            <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>
                                {pausedSession.workoutName}
                            </p>
                            <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8, marginTop: 'var(--spacing-xs)' }}>
                                Ejercicio {pausedSession.currentExerciseIndex + 1}
                            </p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                        <button
                            onClick={handleContinueSession}
                            className="btn btn-lg"
                            style={{
                                flex: 1,
                                background: 'white',
                                color: 'var(--primary)',
                                fontWeight: 600
                            }}
                        >
                            <Play size={20} />
                            Continuar Sesión
                        </button>
                        <button
                            onClick={handleDiscardSession}
                            className="btn btn-lg"
                            style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white'
                            }}
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Exactly 4 Workout Cards */}
            <div className="grid grid-2">
                {workouts.map((workout, index) => {
                    const stats = sessionStats[workout.id] || { count: 0, lastSession: null };
                    const hasHistory = stats.count > 0;

                    return (
                        <div
                            key={workout.id}
                            className="card card-interactive animate-fadeIn"
                            onClick={() => onSelectWorkout(workout)}
                            style={{
                                background: workoutColors[index % workoutColors.length],
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                color: 'white',
                                animationDelay: `${index * 60}ms`,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                minHeight: '165px',
                                boxShadow: 'var(--shadow-md)'
                            }}
                        >
                            <div>
                                <div style={{
                                    display: 'inline-block',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    background: 'rgba(0, 0, 0, 0.4)',
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.5px',
                                    marginBottom: 'var(--spacing-sm)'
                                }}>
                                    SESIÓN {workout.order || index + 1}
                                </div>
                                <h3 style={{ fontSize: '1.2rem', marginBottom: 'var(--spacing-xs)', lineHeight: 1.3 }}>
                                    {workout.name}
                                </h3>
                                <p style={{ opacity: 0.9, fontSize: '0.85rem', marginBottom: 0 }}>
                                    {workout.day}
                                </p>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: 'var(--spacing-md)',
                                borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                                paddingTop: 'var(--spacing-sm)'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-xs)',
                                    fontSize: '0.75rem',
                                    opacity: hasHistory ? 0.95 : 0.75
                                }}>
                                    <Calendar size={13} />
                                    <span>
                                        {hasHistory
                                            ? `${stats.count} ${stats.count === 1 ? 'día' : 'días'} · Últ: ${format(new Date(stats.lastSession.date), "d MMM", { locale: es })}`
                                            : 'Sin registros · Toca para iniciar'
                                        }
                                    </span>
                                </div>

                                <ChevronRight size={22} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {workouts.length === 0 && (
                <div style={{
                    textAlign: 'center',
                    padding: 'var(--spacing-2xl)',
                    color: 'var(--text-muted)'
                }}>
                    <Dumbbell size={40} style={{ opacity: 0.4, marginBottom: 'var(--spacing-sm)' }} />
                    <p>Cargando sesiones...</p>
                </div>
            )}
        </div>
    );
}
