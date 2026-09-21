import { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Play, Plus, Pencil, Trash2, Maximize2, X, Calendar, Clock, History as HistoryIcon, Dumbbell } from 'lucide-react';
import {
    getExercisesByWorkout,
    getSetsByExercise,
    addExercise,
    updateExercise,
    deleteExercise,
    getSessionsByWorkout,
    getSetsBySession,
    updateSet,
    deleteSet,
    deleteSession
} from '../db/database';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ExerciseModal from './ExerciseModal';
import ExerciseMedia from './ExerciseMedia';
import EditSetModal from './EditSetModal';

export default function WorkoutDetail({ workout, onBack, onStartSession }) {
    const [activeTab, setActiveTab] = useState('exercises'); // 'exercises' | 'history'
    const [exercises, setExercises] = useState([]);
    const [lastWeights, setLastWeights] = useState({});
    const [pastSessions, setPastSessions] = useState([]);
    const [sessionSetsMap, setSessionSetsMap] = useState({}); // sessionId -> sets[]
    const [expandedSessionId, setExpandedSessionId] = useState(null);

    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExercise, setEditingExercise] = useState(null);
    const [previewExercise, setPreviewExercise] = useState(null);
    const [editingSet, setEditingSet] = useState(null);

    const loadExercises = useCallback(async () => {
        const exerciseList = await getExercisesByWorkout(workout.id);
        setExercises(exerciseList);

        const weights = {};
        for (const exercise of exerciseList) {
            const sets = await getSetsByExercise(exercise.id, 1);
            if (sets.length > 0) {
                weights[exercise.id] = sets[0].weight;
            }
        }
        setLastWeights(weights);
    }, [workout.id]);

    const loadHistory = useCallback(async () => {
        const sessions = await getSessionsByWorkout(workout.id, 30);
        setPastSessions(sessions);

        // Load sets for each past session
        const map = {};
        for (const s of sessions) {
            const sets = await getSetsBySession(s.id);
            map[s.id] = sets;
        }
        setSessionSetsMap(map);

        if (sessions.length > 0 && !expandedSessionId) {
            setExpandedSessionId(sessions[0].id);
        }
    }, [workout.id, expandedSessionId]);

    useEffect(() => {
        loadExercises();
        loadHistory();
    }, [loadExercises, loadHistory]);

    const handleAddClick = () => {
        setEditingExercise(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (exercise) => {
        setEditingExercise(exercise);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (exerciseId) => {
        if (window.confirm('¿Seguro que quieres eliminar este ejercicio?')) {
            await deleteExercise(exerciseId);
            loadExercises();
        }
    };

    const handleSaveExercise = async (data) => {
        try {
            if (editingExercise) {
                await updateExercise(editingExercise.id, data);
            } else {
                await addExercise({
                    ...data,
                    workoutId: workout.id
                });
            }
            setIsModalOpen(false);
            loadExercises();
        } catch (error) {
            console.error('Error saving exercise:', error);
            alert('Error al guardar el ejercicio');
        }
    };

    const handleSaveEditedSet = async (updatedSet) => {
        if (updatedSet.id) {
            await updateSet(updatedSet.id, {
                weight: updatedSet.weight,
                reps: updatedSet.reps,
                rir: updatedSet.rir
            });
        }
        setEditingSet(null);
        await loadHistory();
    };

    const handleDeleteEditedSet = async (setId) => {
        if (setId) {
            await deleteSet(setId);
        }
        setEditingSet(null);
        await loadHistory();
    };

    const handleDeleteDaySession = async (sessionId, e) => {
        e.stopPropagation();
        if (window.confirm('¿Seguro que quieres eliminar el registro de este día de entrenamiento?')) {
            await deleteSession(sessionId);
            await loadHistory();
        }
    };

    function getMuscleBadgeStyle(muscle) {
        if (!muscle) return { background: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.2)' };
        const m = muscle.toUpperCase();
        if (m.includes('PECTORAL') || m.includes('PECHO')) return { background: 'rgba(239, 68, 68, 0.18)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.4)' };
        if (m.includes('DORSAL') || m.includes('ESPALDA')) return { background: 'rgba(59, 130, 246, 0.18)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.4)' };
        if (m.includes('CUÁDRICEPS') || m.includes('CUADRICEPS') || m.includes('FEMORAL') || m.includes('PIERNA') || m.includes('GLÚTEO') || m.includes('GEMELOS') || m.includes('ADUCTOR')) {
            return { background: 'rgba(245, 158, 11, 0.18)', color: '#fde68a', border: '1px solid rgba(245, 158, 11, 0.4)' };
        }
        if (m.includes('DEL.') || m.includes('HOMBRO')) return { background: 'rgba(168, 85, 247, 0.18)', color: '#d8b4fe', border: '1px solid rgba(168, 85, 247, 0.4)' };
        if (m.includes('BÍCEPS') || m.includes('BICEPS') || m.includes('TRÍCEPS') || m.includes('TRICEPS')) return { background: 'rgba(16, 185, 129, 0.18)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.4)' };
        if (m.includes('ABDOMEN') || m.includes('CORE')) return { background: 'rgba(234, 179, 8, 0.18)', color: '#fef08a', border: '1px solid rgba(234, 179, 8, 0.4)' };
        return { background: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF', border: '1px solid rgba(255, 255, 255, 0.2)' };
    }

    return (
        <div className="animate-fadeIn" style={{ paddingBottom: '80px' }}>
            {/* Header */}
            <div style={{
                background: 'var(--gradient-primary)',
                padding: 'var(--spacing-xl) var(--spacing-md)',
                marginBottom: 'var(--spacing-md)'
            }}>
                <div className="container">
                    <button
                        onClick={onBack}
                        className="btn-icon"
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            marginBottom: 'var(--spacing-md)'
                        }}
                    >
                        <ArrowLeft size={24} />
                    </button>

                    <h2 style={{ color: 'white', marginBottom: 'var(--spacing-xs)', fontSize: '1.4rem' }}>
                        {workout.name}
                    </h2>
                    <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: 0, fontSize: '0.85rem' }}>
                        {workout.day}
                    </p>
                </div>
            </div>

            <div className="container">
                {/* Start Session Button */}
                <button
                    onClick={() => onStartSession(workout)}
                    className="btn btn-accent btn-lg"
                    style={{
                        width: '100%',
                        marginBottom: 'var(--spacing-lg)',
                        fontSize: '1.15rem',
                        boxShadow: 'var(--shadow-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <Play size={24} />
                    Iniciar Sesión de Hoy
                </button>

                {/* Navigation Tabs: Ejercicios vs Registros de cada día */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    marginBottom: 'var(--spacing-lg)',
                    background: 'var(--bg-card)',
                    padding: '4px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border)'
                }}>
                    <button
                        onClick={() => setActiveTab('exercises')}
                        style={{
                            padding: '10px 8px',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            background: activeTab === 'exercises' ? 'var(--gradient-primary)' : 'transparent',
                            color: activeTab === 'exercises' ? '#FFFFFF' : 'var(--text-secondary)',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        <Dumbbell size={16} />
                        <span>Ejercicios ({exercises.length})</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        style={{
                            padding: '10px 8px',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            background: activeTab === 'history' ? 'var(--gradient-primary)' : 'transparent',
                            color: activeTab === 'history' ? '#FFFFFF' : 'var(--text-secondary)',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            cursor: 'pointer'
                        }}
                    >
                        <HistoryIcon size={16} />
                        <span>Registros ({pastSessions.length} días)</span>
                    </button>
                </div>

                {/* TAB 1: EJERCICIOS */}
                {activeTab === 'exercises' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {exercises.map((exercise, index) => {
                            const muscleStyle = getMuscleBadgeStyle(exercise.muscleGroup);

                            return (
                                <div
                                    key={exercise.id}
                                    className="card animate-slideInRight"
                                    style={{
                                        animationDelay: `${index * 40}ms`,
                                        position: 'relative',
                                        border: '1px solid var(--border)',
                                        padding: 'var(--spacing-md)'
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'flex-start' }}>
                                        {/* Exercise Media Thumbnail */}
                                        <div style={{ position: 'relative', width: '92px', flexShrink: 0 }}>
                                            <ExerciseMedia
                                                exerciseName={exercise.name}
                                                exerciseDbId={exercise.exerciseDbId}
                                                gifUrl={exercise.gifUrl}
                                                height="92px"
                                                width="92px"
                                                autoAnimate={true}
                                                onClick={() => setPreviewExercise(exercise)}
                                            />
                                            <button
                                                onClick={() => setPreviewExercise(exercise)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '4px',
                                                    right: '4px',
                                                    background: 'rgba(0,0,0,0.6)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    padding: '2px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}
                                                title="Ver animación grande"
                                            >
                                                <Maximize2 size={12} />
                                            </button>
                                        </div>

                                        {/* Exercise Information */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                                                <div style={{ flex: 1 }}>
                                                    {exercise.muscleGroup && (
                                                        <span style={{
                                                            display: 'inline-block',
                                                            padding: '2px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '0.65rem',
                                                            fontWeight: 800,
                                                            letterSpacing: '0.5px',
                                                            marginBottom: '4px',
                                                            ...muscleStyle
                                                        }}>
                                                            {exercise.muscleGroup}
                                                        </span>
                                                    )}
                                                    <h4 style={{
                                                        fontSize: '1rem',
                                                        margin: '2px 0 6px 0',
                                                        color: 'var(--text-primary)',
                                                        lineHeight: 1.3
                                                    }}>
                                                        {exercise.name}
                                                    </h4>
                                                </div>

                                                <div style={{ display: 'flex', gap: '4px' }}>
                                                    <button
                                                        onClick={() => handleEditClick(exercise)}
                                                        className="btn-icon"
                                                        style={{ width: '28px', height: '28px', background: 'rgba(255, 255, 255, 0.08)', color: 'var(--text-secondary)' }}
                                                        title="Editar"
                                                    >
                                                        <Pencil size={13} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(exercise.id)}
                                                        className="btn-icon"
                                                        style={{ width: '28px', height: '28px', background: 'rgba(244, 67, 54, 0.15)', color: '#ff4444' }}
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Last Weight Tag */}
                                            {lastWeights[exercise.id] && (
                                                <div style={{ marginBottom: '6px' }}>
                                                    <span style={{
                                                        background: 'rgba(211, 47, 47, 0.25)',
                                                        border: '1px solid var(--primary)',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        fontSize: '0.7rem',
                                                        fontWeight: 700,
                                                        color: '#ff8a80'
                                                    }}>
                                                        Último: {lastWeights[exercise.id]} kg
                                                    </span>
                                                </div>
                                            )}

                                            {/* Specs Target Bar */}
                                            <div style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(4, 1fr)',
                                                gap: '4px',
                                                padding: '6px 8px',
                                                background: 'var(--bg-input)',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.75rem',
                                                textAlign: 'center'
                                            }}>
                                                <div>
                                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>SERIES</div>
                                                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{exercise.sets}</div>
                                                </div>
                                                <div>
                                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>REPS</div>
                                                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {exercise.reps}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>RIR OBJ.</div>
                                                    <div style={{ fontWeight: 700, color: '#fca5a5' }}>
                                                        {exercise.rir || '-'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>DESCANSO</div>
                                                    <div style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>
                                                        {exercise.rest || '2\''}
                                                    </div>
                                                </div>
                                            </div>

                                            {exercise.notes && (
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic', margin: '6px 0 0 0', lineHeight: 1.3 }}>
                                                    💡 {exercise.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <button
                            onClick={handleAddClick}
                            className="btn btn-secondary"
                            style={{
                                width: '100%',
                                marginTop: 'var(--spacing-md)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 'var(--spacing-sm)'
                            }}
                        >
                            <Plus size={20} />
                            Añadir Ejercicio a la Sesión
                        </button>
                    </div>
                )}

                {/* TAB 2: REGISTROS DE CADA DÍA */}
                {activeTab === 'history' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {pastSessions.length === 0 ? (
                            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)', color: 'var(--text-muted)' }}>
                                <Calendar size={40} style={{ opacity: 0.3, marginBottom: 'var(--spacing-sm)' }} />
                                <p>Aún no has completado ningún día para esta sesión.</p>
                                <p style={{ fontSize: '0.85rem' }}>Cada vez que pulses "Iniciar Sesión de Hoy" se guardará un nuevo registro aquí.</p>
                            </div>
                        ) : (
                            pastSessions.map((session, sIdx) => {
                                const isExpanded = expandedSessionId === session.id;
                                const sets = sessionSetsMap[session.id] || [];

                                // Group sets by exercise
                                const exerciseSets = {};
                                sets.forEach(set => {
                                    if (!exerciseSets[set.exerciseId]) {
                                        exerciseSets[set.exerciseId] = [];
                                    }
                                    exerciseSets[set.exerciseId].push(set);
                                });

                                return (
                                    <div
                                        key={session.id}
                                        className="card"
                                        style={{ border: '1px solid var(--border)', padding: 'var(--spacing-md)' }}
                                    >
                                        <div
                                            onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-light)', textTransform: 'uppercase' }}>
                                                    Registro Día #{pastSessions.length - sIdx}
                                                </div>
                                                <h4 style={{ margin: '2px 0', fontSize: '1.05rem', color: '#FFFFFF' }}>
                                                    {format(new Date(session.date), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                                                </h4>
                                                <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                    {session.duration > 0 && (
                                                        <span><Clock size={13} style={{ display: 'inline', marginRight: '4px' }} />{session.duration} min</span>
                                                    )}
                                                    <span>{sets.length} series registradas</span>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleDeleteDaySession(session.id, e)}
                                                    className="btn-icon"
                                                    style={{ width: '32px', height: '32px', background: 'rgba(244, 67, 54, 0.15)', color: '#ff4444' }}
                                                    title="Eliminar registro de este día"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn-icon"
                                                    style={{ background: 'rgba(255,255,255,0.06)', color: 'white', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                                                >
                                                    ▼
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expanded Sets Detail for this day */}
                                        {isExpanded && (
                                            <div style={{ marginTop: 'var(--spacing-md)', borderTop: '1px solid var(--border)', paddingTop: 'var(--spacing-md)' }}>
                                                {exercises.map(ex => {
                                                    const exSets = exerciseSets[ex.id] || [];
                                                    if (exSets.length === 0) return null;

                                                    return (
                                                        <div key={ex.id} style={{ marginBottom: '12px' }}>
                                                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                                                                {ex.name}
                                                            </div>
                                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                                {exSets.map(set => (
                                                                    <div
                                                                        key={set.id}
                                                                        onClick={() => setEditingSet({ ...set, exerciseName: ex.name })}
                                                                        style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '6px',
                                                                            background: 'var(--bg-input)',
                                                                            padding: '4px 8px',
                                                                            borderRadius: 'var(--radius-sm)',
                                                                            fontSize: '0.8rem',
                                                                            border: '1px solid var(--border)',
                                                                            cursor: 'pointer'
                                                                        }}
                                                                        title="Pulsar para editar esta serie"
                                                                    >
                                                                        <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>
                                                                            S{set.setNumber}:
                                                                        </span>
                                                                        <span style={{ fontWeight: 600 }}>
                                                                            {set.weight} kg × {set.reps}
                                                                        </span>
                                                                        {set.rir && (
                                                                            <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
                                                                                (RIR {set.rir})
                                                                            </span>
                                                                        )}
                                                                        <Pencil size={11} style={{ opacity: 0.6 }} />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            {/* Exercise Modal */}
            {isModalOpen && (
                <ExerciseModal
                    exercise={editingExercise}
                    onSave={handleSaveExercise}
                    onClose={() => setIsModalOpen(false)}
                />
            )}

            {/* Large Exercise Preview Modal */}
            {previewExercise && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0, 0, 0, 0.88)',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 'var(--spacing-md)',
                        backdropFilter: 'blur(5px)'
                    }}
                    onClick={() => setPreviewExercise(null)}
                >
                    <div
                        style={{
                            background: 'var(--bg-card)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--spacing-lg)',
                            maxWidth: '420px',
                            width: '100%',
                            border: '1px solid var(--border)',
                            position: 'relative'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                            <div>
                                {previewExercise.muscleGroup && (
                                    <span style={{
                                        ...getMuscleBadgeStyle(previewExercise.muscleGroup),
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.7rem',
                                        fontWeight: 800
                                    }}>
                                        {previewExercise.muscleGroup}
                                    </span>
                                )}
                                <h3 style={{ margin: '4px 0 0 0', fontSize: '1.2rem' }}>{previewExercise.name}</h3>
                            </div>
                            <button
                                onClick={() => setPreviewExercise(null)}
                                className="btn-icon"
                                style={{ background: 'rgba(255,255,255,0.1)', color: 'white' }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <ExerciseMedia
                            exerciseName={previewExercise.name}
                            exerciseDbId={previewExercise.exerciseDbId}
                            gifUrl={previewExercise.gifUrl}
                            height="260px"
                            width="100%"
                            autoAnimate={true}
                        />

                        <div style={{
                            marginTop: 'var(--spacing-md)',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '8px',
                            background: 'var(--bg-input)',
                            padding: '10px',
                            borderRadius: 'var(--radius-md)',
                            textAlign: 'center'
                        }}>
                            <div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>REPS OBJ.</div>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{previewExercise.reps}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>RIR OBJ.</div>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fca5a5' }}>{previewExercise.rir || '-'}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>DESCANSO</div>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{previewExercise.rest || '2\''}</div>
                            </div>
                        </div>

                        {previewExercise.notes && (
                            <p style={{ marginTop: 'var(--spacing-md)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                💡 {previewExercise.notes}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Edit Set Modal */}
            {editingSet && (
                <EditSetModal
                    isOpen={true}
                    set={editingSet}
                    exerciseName={editingSet.exerciseName}
                    onSave={handleSaveEditedSet}
                    onDelete={handleDeleteEditedSet}
                    onClose={() => setEditingSet(null)}
                />
            )}
        </div>
    );
}
