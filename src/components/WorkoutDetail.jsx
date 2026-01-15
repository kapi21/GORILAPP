import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Clock, Repeat, TrendingUp, Plus, Pencil, Trash2 } from 'lucide-react';
import { getExercisesByWorkout, getSetsByExercise, addExercise, updateExercise, deleteExercise } from '../db/database';
import ExerciseModal from './ExerciseModal';

export default function WorkoutDetail({ workout, onBack, onStartSession }) {
    const [exercises, setExercises] = useState([]);
    const [lastWeights, setLastWeights] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExercise, setEditingExercise] = useState(null);

    useEffect(() => {
        loadExercises();
    }, [workout]);

    async function loadExercises() {
        const exerciseList = await getExercisesByWorkout(workout.id);
        setExercises(exerciseList);

        // Load last weight for each exercise
        const weights = {};
        for (const exercise of exerciseList) {
            const sets = await getSetsByExercise(exercise.id, 1);
            if (sets.length > 0) {
                weights[exercise.id] = sets[0].weight;
            }
        }
        setLastWeights(weights);
    }

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

    return (
        <div className="animate-fadeIn" style={{ paddingBottom: '80px' }}>
            {/* Header */}
            <div style={{
                background: 'var(--gradient-primary)',
                padding: 'var(--spacing-xl) var(--spacing-md)',
                marginBottom: 'var(--spacing-xl)'
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

                    <h2 style={{ color: 'white', marginBottom: 'var(--spacing-xs)' }}>
                        {workout.name}
                    </h2>
                    <p style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: 0 }}>
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
                        marginBottom: 'var(--spacing-xl)',
                        fontSize: '1.125rem',
                        boxShadow: 'var(--shadow-md)'
                    }}
                >
                    <Play size={24} />
                    Iniciar Sesión
                </button>

                {/* Exercise List */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--spacing-lg)' }}>
                    <h3 style={{ margin: 0 }}>Ejercicios</h3>
                    <div style={{
                        background: 'var(--bg-card)',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border)'
                    }}>
                        {exercises.length} ejercicios
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {exercises.map((exercise, index) => (
                        <div
                            key={exercise.id}
                            className="card animate-slideInRight"
                            style={{ animationDelay: `${index * 50}ms`, position: 'relative', paddingRight: '50px' }}
                        >
                            {/* Action Buttons */}
                            <div style={{
                                position: 'absolute',
                                top: 'var(--spacing-md)',
                                right: 'var(--spacing-md)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 'var(--spacing-xs)'
                            }}>
                                <button
                                    onClick={() => handleEditClick(exercise)}
                                    className="btn-icon"
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(exercise.id)}
                                    className="btn-icon"
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        background: 'rgba(244, 67, 54, 0.2)',
                                        color: '#ff4444',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: 'var(--spacing-md)'
                            }}>
                                <div style={{ flex: 1, paddingRight: '40px' }}>
                                    <h4 style={{
                                        fontSize: '1.125rem',
                                        marginBottom: 'var(--spacing-xs)',
                                        color: 'var(--text-primary)'
                                    }}>
                                        {exercise.name}
                                    </h4>

                                    {exercise.notes && (
                                        <p style={{
                                            fontSize: '0.875rem',
                                            color: 'var(--text-muted)',
                                            fontStyle: 'italic',
                                            marginBottom: 'var(--spacing-sm)'
                                        }}>
                                            {exercise.notes}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {lastWeights[exercise.id] && (
                                <div style={{
                                    marginBottom: 'var(--spacing-md)'
                                }}>
                                    <span style={{
                                        background: 'var(--gradient-primary)',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        color: 'white'
                                    }}>
                                        Último: {lastWeights[exercise.id]} kg
                                    </span>
                                </div>
                            )}

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(3, 1fr)',
                                gap: 'var(--spacing-sm)',
                                padding: 'var(--spacing-md)',
                                background: 'var(--bg-input)',
                                borderRadius: 'var(--radius-md)'
                            }}>
                                <div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        color: 'var(--text-muted)',
                                        fontSize: '0.75rem',
                                        marginBottom: '4px'
                                    }}>
                                        <Repeat size={14} />
                                        <span>Series</span>
                                    </div>
                                    <div style={{ fontSize: '1rem', fontWeight: 600 }}>
                                        {exercise.sets}
                                    </div>
                                </div>

                                <div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        color: 'var(--text-muted)',
                                        fontSize: '0.75rem',
                                        marginBottom: '4px'
                                    }}>
                                        <TrendingUp size={14} />
                                        <span>RIR</span>
                                    </div>
                                    <div style={{ fontSize: '1rem', fontWeight: 600 }}>
                                        {exercise.rir}
                                    </div>
                                </div>

                                <div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        color: 'var(--text-muted)',
                                        fontSize: '0.75rem',
                                        marginBottom: '4px'
                                    }}>
                                        <Clock size={14} />
                                        <span>Desc.</span>
                                    </div>
                                    <div style={{ fontSize: '1rem', fontWeight: 600 }}>
                                        {exercise.rest}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Add Exercise Button */}
                <button
                    onClick={handleAddClick}
                    className="btn btn-secondary dashed-border"
                    style={{
                        width: '100%',
                        marginTop: 'var(--spacing-lg)',
                        padding: 'var(--spacing-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'var(--spacing-md)',
                        color: 'var(--text-secondary)',
                        marginBottom: 'var(--spacing-2xl)'
                    }}
                >
                    <Plus size={24} />
                    <span>Añadir Ejercicio</span>
                </button>
            </div>

            <ExerciseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveExercise}
                initialData={editingExercise}
            />
        </div>
    );
}
