import { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronRight, Pencil } from 'lucide-react';
import { getSessions, getWorkoutById, getSetsBySession, getExerciseById, updateSet, deleteSet } from '../db/database';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import EditSetModal from './EditSetModal';

export default function History() {
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [sessionDetails, setSessionDetails] = useState(null);
    const [editingSet, setEditingSet] = useState(null);

    useEffect(() => {
        loadSessions();
    }, []);

    async function loadSessions() {
        const sessionList = await getSessions();

        const enriched = await Promise.all(
            sessionList.map(async session => {
                const workout = await getWorkoutById(session.workoutId);
                return { ...session, workoutName: workout?.name ?? 'Rutina eliminada' };
            })
        );

        setSessions(enriched);
    }

    async function loadSessionDetails(session) {
        const sets = await getSetsBySession(session.id);

        const exerciseMap = {};
        for (const set of sets) {
            if (!exerciseMap[set.exerciseId]) {
                const exercise = await getExerciseById(set.exerciseId);
                exerciseMap[set.exerciseId] = {
                    exercise: exercise || { id: set.exerciseId, name: 'Ejercicio' },
                    sets: []
                };
            }
            exerciseMap[set.exerciseId].sets.push(set);
        }

        setSessionDetails(Object.values(exerciseMap));
        setSelectedSession(session);
    }

    async function handleSaveEditedSet(updatedSet) {
        if (updatedSet.id) {
            await updateSet(updatedSet.id, {
                weight: updatedSet.weight,
                reps: updatedSet.reps,
                rir: updatedSet.rir
            });
        }
        setEditingSet(null);
        if (selectedSession) {
            await loadSessionDetails(selectedSession);
        }
    }

    async function handleDeleteSet(setId) {
        if (setId) {
            await deleteSet(setId);
        }
        setEditingSet(null);
        if (selectedSession) {
            await loadSessionDetails(selectedSession);
        }
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
                                            alignItems: 'center',
                                            padding: 'var(--spacing-sm) var(--spacing-md)',
                                            background: 'var(--bg-input)',
                                            borderRadius: 'var(--radius-md)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ fontWeight: 700, color: 'var(--primary-light)', fontSize: '0.85rem' }}>
                                                Serie {set.setNumber}
                                            </span>
                                            <span style={{ fontWeight: 600 }}>
                                                {set.weight} kg × {set.reps} reps
                                            </span>
                                            {set.rir && (
                                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                                    (RIR: {set.rir})
                                                </span>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setEditingSet({ ...set, exerciseName: exercise.name })}
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.08)',
                                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                                color: '#FFFFFF',
                                                borderRadius: '4px',
                                                padding: '4px 8px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                cursor: 'pointer'
                                            }}
                                            title="Editar serie"
                                        >
                                            <Pencil size={12} />
                                            <span>Editar</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Edit Set Modal */}
                {editingSet && (
                    <EditSetModal
                        isOpen={true}
                        set={editingSet}
                        exerciseName={editingSet.exerciseName}
                        onSave={handleSaveEditedSet}
                        onDelete={handleDeleteSet}
                        onClose={() => setEditingSet(null)}
                    />
                )}
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
                                            {format(new Date(session.date), "d 'de' MMMM", { locale: es })}
                                        </span>
                                        {session.duration > 0 && (
                                            <span>
                                                <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                                                {session.duration} min
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <ChevronRight size={20} style={{ color: 'var(--text-secondary)' }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
