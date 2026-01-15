import { useState, useEffect } from 'react';
import { ChevronRight, Calendar, Play, Pause, X } from 'lucide-react';
import { getWorkouts, getSessionsByWorkout } from '../db/database';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getSavedSession, clearSession } from '../utils/sessionStorage';

export default function WorkoutList({ onSelectWorkout }) {
    const [workouts, setWorkouts] = useState([]);
    const [lastSessions, setLastSessions] = useState({});
    const [pausedSession, setPausedSession] = useState(null);

    useEffect(() => {
        loadWorkouts();
        loadPausedSession();
    }, []);

    async function loadWorkouts() {
        const workoutList = await getWorkouts();
        setWorkouts(workoutList);

        // Load last session for each workout
        const sessions = {};
        for (const workout of workoutList) {
            const workoutSessions = await getSessionsByWorkout(workout.id, 1);
            if (workoutSessions.length > 0) {
                sessions[workout.id] = workoutSessions[0];
            }
        }
        setLastSessions(sessions);
    }

    function loadPausedSession() {
        const saved = getSavedSession();
        setPausedSession(saved);
    }

    function handleContinueSession() {
        if (pausedSession) {
            // Find the full workout object
            const workout = workouts.find(w => w.id === pausedSession.workoutId);
            if (workout) {
                // Pass full workout object with saved session data
                onSelectWorkout(workout, pausedSession);
            }
        }
    }

    function handleDiscardSession() {
        clearSession();
        setPausedSession(null);
    }

    const workoutColors = [
        'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)',
        'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
        'linear-gradient(135deg, #C62828 0%, #8B0000 100%)'
    ];

    return (
        <div className="container" style={{ paddingTop: 'var(--spacing-xl)' }}>
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Tus Rutinas</h2>

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

            <div className="grid grid-2">
                {workouts.map((workout, index) => {
                    const lastSession = lastSessions[workout.id];

                    return (
                        <div
                            key={workout.id}
                            className="card card-interactive animate-fadeIn"
                            onClick={() => onSelectWorkout(workout)}
                            style={{
                                background: workoutColors[index % workoutColors.length],
                                border: 'none',
                                color: 'white',
                                animationDelay: `${index * 100}ms`
                            }}
                        >
                            <div style={{ marginBottom: 'var(--spacing-md)' }}>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: 'var(--spacing-xs)' }}>
                                    {workout.name}
                                </h3>
                                <p style={{ opacity: 0.9, fontSize: '0.875rem', marginBottom: 0 }}>
                                    {workout.day}
                                </p>
                            </div>

                            {lastSession && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--spacing-xs)',
                                    fontSize: '0.75rem',
                                    opacity: 0.8,
                                    marginTop: 'var(--spacing-md)'
                                }}>
                                    <Calendar size={14} />
                                    <span>
                                        Última: {format(new Date(lastSession.date), "d 'de' MMMM", { locale: es })}
                                    </span>
                                </div>
                            )}

                            <div style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                marginTop: 'var(--spacing-md)'
                            }}>
                                <ChevronRight size={24} />
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
                    <p>Cargando rutinas...</p>
                </div>
            )}
        </div>
    );
}
