import { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronRight } from 'lucide-react';
import { getSessions, getWorkoutById, getSetsBySession, getExerciseById } from '../db/database';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function History() {
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [sessionDetails, setSessionDetails] = useState(null);

    useEffect(() => {
        loadSessions();
    }, []);

    async function loadSessions() {
        const sessionList = await getSessions();

        // Enrich with workout names
        const enriched = await Promise.all(
            sessionList.map(async session => {
                const workout = await getWorkoutById(session.workoutId);
                return { ...session, workoutName: workout.name };
            })
        );

        setSessions(enriched);
    }

    async function loadSessionDetails(session) {
        const sets = await getSetsBySession(session.id);

        // Group sets by exercise
        const exerciseMap = {};
        for (const set of sets) {
            if (!exerciseMap[set.exerciseId]) {
                const exercise = await getExerciseById(set.exerciseId);
                exerciseMap[set.exerciseId] = {
                    exercise,
                    sets: []
                };
            }
            exerciseMap[set.exerciseId].sets.push(set);
        }

        setSessionDetails(Object.values(exerciseMap));
        setSelectedSession(session);
    }

    if (selectedSession && sessionDetails) {
        return (
            <div className="container animate-fadeIn" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xl)' }}>
                <button
                    onClick={() => {
                        setSelectedSession(null);
                        setSessionDetails(null);
                    }}
                    className="btn btn-secondary"
                    style={{ marginBottom: 'var(--spacing-lg)' }}
                >
                    ← Volver
                </button>

                <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>{selectedSession.workoutName}</h2>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        <span>
                            <Calendar size={16} style={{ display: 'inline', marginRight: '4px' }} />
                            {format(new Date(selectedSession.date), "d 'de' MMMM 'de' yyyy", { locale: es })}
                        </span>
                        {selectedSession.duration > 0 && (
                            <span>
                                <Clock size={16} style={{ display: 'inline', marginRight: '4px' }} />
                                {selectedSession.duration} min
                            </span>
                        )}
                    </div>
                </div>

                <h3 style={{ marginBottom: 'var(--spacing-lg)' }}>Ejercicios realizados</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {sessionDetails.map(({ exercise, sets }) => (
                        <div key={exercise.id} className="card">
                            <h4 style={{ marginBottom: 'var(--spacing-md)' }}>{exercise.name}</h4>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                {sets.map(set => (
                                    <div
                                        key={set.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            padding: 'var(--spacing-sm)',
                                            background: 'var(--bg-input)',
                                            borderRadius: 'var(--radius-md)'
                                        }}
                                    >
                                        <span>Serie {set.setNumber}</span>
                                        <span style={{ fontWeight: 600 }}>
                                            {set.weight} kg × {set.reps} reps
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container animate-fadeIn" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xl)' }}>
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Historial</h2>

            {sessions.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Aún no has completado ninguna sesión.
                        <br />
                        ¡Empieza tu primer entrenamiento!
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {sessions.map((session, index) => (
                        <div
                            key={session.id}
                            className="card card-interactive animate-slideInRight"
                            onClick={() => loadSessionDetails(session)}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ marginBottom: 'var(--spacing-xs)' }}>{session.workoutName}</h4>
                                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                        <span>
                                            <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                            {format(new Date(session.date), "d MMM yyyy", { locale: es })}
                                        </span>
                                        {session.duration > 0 && (
                                            <span>
                                                <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                                {session.duration} min
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <ChevronRight size={24} color="var(--text-muted)" />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
