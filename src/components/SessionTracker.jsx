import { useState, useEffect, useCallback } from 'react';
import { X, Check, ChevronLeft, ChevronRight, StickyNote, Pause, Plus, Minus, Pencil } from 'lucide-react';
import {
    getExercisesByWorkout,
    createSession,
    addSet,
    updateSet,
    deleteSet,
    updateSession,
    getSetsByExercise
} from '../db/database';
import RestTimer from './RestTimer';
import NotesModal from './NotesModal';
import ExerciseMedia from './ExerciseMedia';
import EditSetModal from './EditSetModal';
import { requestWakeLock, releaseWakeLock } from '../utils/wakeLock';
import { saveSession, clearSession } from '../utils/sessionStorage';

function parseRestTime(restString) {
    if (!restString) return 90;
    const str = restString.replace(/'/g, ' min');
    const match = str.match(/(\d+)(?:-(\d+))?\s*(s|min)?/);
    if (!match) return 90;
    const low = parseInt(match[1]);
    const high = match[2] ? parseInt(match[2]) : low;
    const avg = Math.round((low + high) / 2);
    if (str.includes('min') || (low <= 5 && !str.includes('s'))) {
        return avg * 60;
    }
    return avg;
}

function parseTotalSets(exercise) {
    if (!exercise || !exercise.sets) return 3;
    const m = exercise.sets.toString().match(/\d+/);
    return m ? parseInt(m[0]) : 3;
}

function parseDefaultReps(exercise, setNum) {
    if (!exercise || !exercise.reps) return 10;
    const repsStr = exercise.reps;
    if (repsStr.includes('/')) {
        const parts = repsStr.split('/').map(p => p.trim());
        let accumulatedSets = 0;
        for (const part of parts) {
            const countMatch = part.match(/^(\d+)x/i);
            const count = countMatch ? parseInt(countMatch[1]) : 1;
            accumulatedSets += count;
            if (setNum <= accumulatedSets) {
                const cleanRange = part.replace(/^\d+x/i, '').trim();
                const numMatch = cleanRange.match(/\d+/);
                return numMatch ? parseInt(numMatch[0]) : 10;
            }
        }
    }
    const match = repsStr.match(/\d+/);
    return match ? parseInt(match[0]) : 10;
}

function parseSetTargetRepsLabel(exercise, setNum) {
    if (!exercise || !exercise.reps) return '8-12';
    const repsStr = exercise.reps;
    if (repsStr.includes('/')) {
        const parts = repsStr.split('/').map(p => p.trim());
        let accumulatedSets = 0;
        for (const part of parts) {
            const countMatch = part.match(/^(\d+)x/i);
            const count = countMatch ? parseInt(countMatch[1]) : 1;
            accumulatedSets += count;
            if (setNum <= accumulatedSets) {
                return part.replace(/^\d+x/i, '').trim();
            }
        }
    }
    return repsStr;
}

function parseSetTargetRir(exercise, setNum) {
    if (!exercise || !exercise.rir) return '1';
    const parts = exercise.rir.split('-').map(p => p.trim());
    if (parts.length >= setNum) {
        return parts[setNum - 1];
    }
    return parts[parts.length - 1];
}

export default function SessionTracker({ workout, onClose }) {
    const [exercises, setExercises] = useState([]);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [currentSetNumber, setCurrentSetNumber] = useState(1);
    const [sessionId, setSessionId] = useState(null);

    // Current set inputs
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [selectedRir, setSelectedRir] = useState('');

    // Session history
    const [sessionSets, setSessionSets] = useState({});

    // Timers & Modals
    const [showTimer, setShowTimer] = useState(false);
    const [timerDuration, setTimerDuration] = useState(90);
    const [showNotes, setShowNotes] = useState(false);
    const [startTime] = useState(() => Date.now());
    const [editingSet, setEditingSet] = useState(null);

    const initSession = useCallback(async () => {
        const exerciseList = await getExercisesByWorkout(workout.id);
        setExercises(exerciseList);

        if (workout.savedSession) {
            const saved = workout.savedSession;
            setSessionId(saved.sessionId);
            setCurrentExerciseIndex(saved.currentExerciseIndex || 0);
            setCurrentSetNumber(saved.currentSetNumber || 1);
            setWeight(saved.weight || '');
            setReps(saved.reps || '');
            setSelectedRir(saved.selectedRir || '');
            setSessionSets(saved.sessionSets || {});
            clearSession();
        } else {
            const id = await createSession(workout.id, '', '', workout.block || 'Rutina Septiembre');
            setSessionId(id);
        }
    }, [workout]);

    const loadExerciseData = useCallback(async (exercise, setNum) => {
        const pastSets = await getSetsByExercise(exercise.id, 8);

        // Default weight from previous session if empty
        setWeight(prev => {
            if (!prev && pastSets.length > 0) {
                return pastSets[0].weight.toString();
            }
            return prev;
        });

        // Default target reps
        const targetReps = parseDefaultReps(exercise, setNum);
        setReps(prev => prev || targetReps.toString());

        // Default target RIR
        const targetRir = parseSetTargetRir(exercise, setNum);
        setSelectedRir(targetRir);
    }, []);

    useEffect(() => {
        initSession();
    }, [initSession]);

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '¿Seguro que quieres salir? Perderás el progreso no guardado.';
            return e.returnValue;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        requestWakeLock();

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            releaseWakeLock();
        };
    }, []);

    const currentExercise = exercises[currentExerciseIndex];

    useEffect(() => {
        if (currentExercise) {
            loadExerciseData(currentExercise, currentSetNumber);
        }
    }, [currentExercise, currentSetNumber, loadExerciseData]);

    function adjustWeight(delta) {
        const current = parseFloat(weight) || 0;
        const next = Math.max(0, current + delta);
        setWeight(next.toString());
    }

    function adjustReps(delta) {
        const current = parseInt(reps) || 0;
        const next = Math.max(1, current + delta);
        setReps(next.toString());
    }

    // Complete current set
    async function handleCompleteSet() {
        if (!weight || !reps) {
            alert('Introduce el peso y las repeticiones realizadas');
            return;
        }

        const numWeight = parseFloat(weight);
        const numReps = parseInt(reps);
        const totalSets = parseTotalSets(currentExercise);

        // Save set to Dexie DB
        const setId = await addSet(
            sessionId,
            currentExercise.id,
            currentSetNumber,
            numWeight,
            numReps,
            selectedRir || '-'
        );

        // Update local session state
        const setKey = `${currentExercise.id}-${currentSetNumber}`;
        setSessionSets(prev => ({
            ...prev,
            [setKey]: {
                id: setId,
                setNumber: currentSetNumber,
                weight: numWeight,
                reps: numReps,
                rir: selectedRir
            }
        }));

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
        }

        // Check if there are more sets for this exercise
        if (currentSetNumber < totalSets) {
            // Start rest timer
            const restSeconds = parseRestTime(currentExercise.rest);
            setTimerDuration(restSeconds);
            setShowTimer(true);

            // Advance to next set
            const nextSetNum = currentSetNumber + 1;
            setCurrentSetNumber(nextSetNum);
            setReps(parseDefaultReps(currentExercise, nextSetNum).toString());
            setSelectedRir(parseSetTargetRir(currentExercise, nextSetNum));
        } else {
            // Exercise complete! Move to next exercise or finish session
            handleNextExercise();
        }
    }

    async function handleSaveEditedSet(updatedSet) {
        if (updatedSet.id) {
            await updateSet(updatedSet.id, {
                weight: updatedSet.weight,
                reps: updatedSet.reps,
                rir: updatedSet.rir
            });
        }
        const setKey = `${currentExercise.id}-${updatedSet.setNumber}`;
        setSessionSets(prev => ({
            ...prev,
            [setKey]: updatedSet
        }));
        setEditingSet(null);
    }

    async function handleDeleteSet() {
        if (editingSet?.id) {
            await deleteSet(editingSet.id);
        }
        const setKey = `${currentExercise.id}-${editingSet.setNumber}`;
        setSessionSets(prev => {
            const copy = { ...prev };
            delete copy[setKey];
            return copy;
        });
        if (currentSetNumber > 1 && editingSet.setNumber === currentSetNumber - 1) {
            setCurrentSetNumber(prev => Math.max(1, prev - 1));
        }
        setEditingSet(null);
    }

    function handleNextExercise() {
        const nextIndex = currentExerciseIndex + 1;
        if (nextIndex < exercises.length) {
            setCurrentExerciseIndex(nextIndex);
            setCurrentSetNumber(1);
            setWeight('');
            setReps('');
            setSelectedRir('');
        } else {
            completeSession();
        }
    }

    function handlePrevExercise() {
        if (currentExerciseIndex > 0) {
            setCurrentExerciseIndex(currentExerciseIndex - 1);
            setCurrentSetNumber(1);
            setWeight('');
            setReps('');
            setSelectedRir('');
        }
    }

    const handleRestTimerComplete = useCallback(() => {
        setShowTimer(false);
        if (navigator.vibrate) {
            navigator.vibrate([250, 100, 250, 100, 400]);
        }
    }, []);

    async function completeSession() {
        const duration = Math.max(1, Math.floor((Date.now() - startTime) / 1000 / 60));
        await updateSession(sessionId, { duration });
        clearSession();

        if (navigator.vibrate) {
            navigator.vibrate([300, 150, 300]);
        }

        alert('¡SESIÓN COMPLETADA COMO UNA BESTIA! 🦍💪');
        onClose();
    }

    function handlePauseSession() {
        const sessionData = {
            workoutId: workout.id,
            workoutName: workout.name,
            sessionId,
            currentExerciseIndex,
            currentSetNumber,
            weight,
            reps,
            selectedRir,
            sessionSets
        };
        saveSession(sessionData);
        alert('Sesión pausada. Puedes continuarla cuando vuelvas.');
        onClose();
    }

    if (!currentExercise) {
        return (
            <div style={{ padding: 'var(--spacing-2xl)', textAlign: 'center' }}>
                <p>Cargando ejercicio...</p>
            </div>
        );
    }

    const totalSets = parseTotalSets(currentExercise);
    const targetRepsLabel = parseSetTargetRepsLabel(currentExercise, currentSetNumber);
    const targetRirLabel = parseSetTargetRir(currentExercise, currentSetNumber);
    const progressPercent = Math.round(((currentExerciseIndex) / exercises.length) * 100);

    // Completed sets for this exercise
    const completedSets = [];
    for (let s = 1; s <= totalSets; s++) {
        const set = sessionSets[`${currentExercise.id}-${s}`];
        if (set) {
            completedSets.push(set);
        }
    }

    return (
        <div className="animate-fadeIn" style={{ minHeight: '100vh', background: 'var(--bg-dark)', paddingBottom: '90px' }}>
            {/* Sticky Header */}
            <div style={{
                background: 'var(--gradient-primary)',
                padding: 'var(--spacing-md) var(--spacing-lg)',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: 'var(--shadow-md)'
            }}>
                <div className="container" style={{ padding: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', opacity: 0.8, letterSpacing: '0.5px' }}>
                                {workout.block || 'Rutina Septiembre'}
                            </span>
                            <h3 style={{ color: 'white', margin: 0, fontSize: '1.15rem' }}>{workout.name}</h3>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={() => setShowNotes(true)}
                                className="btn-icon"
                                style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
                                title="Ver notas"
                            >
                                <StickyNote size={20} />
                            </button>
                            <button
                                onClick={handlePauseSession}
                                className="btn-icon"
                                style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
                                title="Pausar sesión"
                            >
                                <Pause size={20} />
                            </button>
                            <button
                                onClick={() => {
                                    if (window.confirm('¿Seguro que quieres salir? Perderás el progreso de esta sesión.')) {
                                        clearSession();
                                        onClose();
                                    }
                                }}
                                className="btn-icon"
                                style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
                                title="Cerrar"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Compact Progress Bar */}
                    <div style={{
                        marginTop: '10px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: 'var(--radius-full)',
                        height: '6px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${Math.max(5, progressPercent)}%`,
                            height: '100%',
                            background: '#FFFFFF',
                            transition: 'width 0.3s ease'
                        }} />
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '0.75rem',
                        marginTop: '4px'
                    }}>
                        <span>Ejercicio {currentExerciseIndex + 1} de {exercises.length}</span>
                        <button
                            type="button"
                            onClick={() => {
                                requestWakeLock();
                                alert('⚡ Pantalla fija activada (NoSleep activo). Tu pantalla no se apagará durante el entreno.');
                            }}
                            style={{
                                background: 'rgba(76, 175, 80, 0.2)',
                                border: '1px solid rgba(76, 175, 80, 0.4)',
                                borderRadius: '12px',
                                padding: '2px 8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                color: '#a5d6a7',
                                fontWeight: 700,
                                fontSize: '0.7rem',
                                cursor: 'pointer'
                            }}
                            title="Toca para asegurar que la pantalla no se apague"
                        >
                            <span>⚡ Pantalla activa</span>
                            <span>·</span>
                            <span>{progressPercent}%</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="container" style={{ paddingTop: 'var(--spacing-md)' }}>
                {/* Exercise Identity Banner */}
                <div className="card" style={{ padding: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                    <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
                        <div style={{ width: '100px', flexShrink: 0 }}>
                            <ExerciseMedia
                                exerciseName={currentExercise.name}
                                exerciseDbId={currentExercise.exerciseDbId}
                                gifUrl={currentExercise.gifUrl}
                                height="100px"
                                width="100px"
                                autoAnimate={true}
                            />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            {currentExercise.muscleGroup && (
                                <span style={{
                                    display: 'inline-block',
                                    background: 'rgba(211, 47, 47, 0.25)',
                                    color: '#ff8a80',
                                    border: '1px solid var(--primary)',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.7rem',
                                    fontWeight: 800,
                                    letterSpacing: '0.5px',
                                    marginBottom: '4px'
                                }}>
                                    {currentExercise.muscleGroup}
                                </span>
                            )}
                            <h2 style={{ fontSize: '1.25rem', margin: '2px 0 6px 0', lineHeight: 1.2 }}>
                                {currentExercise.name}
                            </h2>
                            {currentExercise.notes && (
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, fontStyle: 'italic' }}>
                                    💡 {currentExercise.notes}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Specs Target Bar */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '6px',
                        marginTop: '12px',
                        padding: '8px',
                        background: 'var(--bg-input)',
                        borderRadius: 'var(--radius-md)',
                        textAlign: 'center',
                        fontSize: '0.75rem'
                    }}>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>SERIES</div>
                            <div style={{ fontWeight: 700 }}>{currentExercise.sets}</div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>REPS OBJ.</div>
                            <div style={{ fontWeight: 700 }}>{currentExercise.reps}</div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>RIR OBJ.</div>
                            <div style={{ fontWeight: 700, color: '#fca5a5' }}>{currentExercise.rir || '-'}</div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.65rem' }}>DESCANSO</div>
                            <div style={{ fontWeight: 700 }}>{currentExercise.rest || '2\''}</div>
                        </div>
                    </div>
                </div>

                {/* Completed Sets Summary */}
                {completedSets.length > 0 && (
                    <div style={{ marginBottom: 'var(--spacing-md)' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                            SERIES COMPLETADAS HOY
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {completedSets.map((s, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '8px 12px',
                                        background: 'rgba(76, 175, 80, 0.12)',
                                        border: '1px solid rgba(76, 175, 80, 0.3)',
                                        borderRadius: 'var(--radius-md)',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Check size={16} color="var(--success)" />
                                        <span style={{ fontWeight: 700, color: 'var(--success)' }}>
                                            Serie {s.setNumber}:
                                        </span>
                                        <span style={{ fontWeight: 600, color: '#FFFFFF' }}>
                                            {s.weight} kg × {s.reps} reps
                                        </span>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                                            (RIR: {s.rir || '-'})
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setEditingSet(s)}
                                        style={{
                                            background: 'rgba(255, 255, 255, 0.12)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            color: '#FFFFFF',
                                            borderRadius: 'var(--radius-sm)',
                                            padding: '4px 8px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            cursor: 'pointer'
                                        }}
                                        title="Corregir datos de esta serie"
                                    >
                                        <Pencil size={12} />
                                        <span>Editar</span>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Active Set Entry Card */}
                {currentSetNumber <= totalSets && (
                    <div className="card" style={{
                        padding: '16px 12px',
                        border: '2px solid var(--primary)',
                        background: 'linear-gradient(180deg, #1f1414 0%, #171717 100%)',
                        marginBottom: 'var(--spacing-lg)',
                        width: '100%',
                        maxWidth: '100%',
                        boxSizing: 'border-box',
                        overflow: 'hidden'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                            <div style={{
                                background: 'var(--gradient-primary)',
                                color: 'white',
                                padding: '4px 10px',
                                borderRadius: '20px',
                                fontWeight: 800,
                                fontSize: '0.8rem',
                                letterSpacing: '0.5px'
                            }}>
                                SERIE {currentSetNumber} DE {totalSets}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#ff8a80', fontWeight: 600 }}>
                                Obj: {targetRepsLabel} reps · RIR {targetRirLabel}
                            </div>
                        </div>

                        {/* Weight Control */}
                        <div style={{ marginBottom: 'var(--spacing-lg)', width: '100%' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                Peso levantado (kg)
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', width: '100%', boxSizing: 'border-box' }}>
                                <input
                                    type="number"
                                    step="0.5"
                                    value={weight}
                                    onChange={e => setWeight(e.target.value)}
                                    placeholder="0"
                                    style={{
                                        flex: '1 1 0px',
                                        minWidth: 0,
                                        width: '100%',
                                        fontSize: '1.6rem',
                                        fontWeight: 800,
                                        textAlign: 'center',
                                        padding: '10px 4px',
                                        background: 'var(--bg-input)',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: 'var(--radius-md)',
                                        color: '#FFFFFF',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0 }}>kg</span>
                            </div>

                            {/* Quick Increment Buttons */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', width: '100%', boxSizing: 'border-box' }}>
                                {[-5, -2.5, +2.5, +5, +10].map(val => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => adjustWeight(val)}
                                        style={{
                                            padding: '8px 0',
                                            borderRadius: 'var(--radius-sm)',
                                            border: '1px solid var(--border)',
                                            background: val > 0 ? 'rgba(211, 47, 47, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                                            color: val > 0 ? '#ff8a80' : 'var(--text-secondary)',
                                            fontWeight: 700,
                                            fontSize: '0.8rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {val > 0 ? `+${val}` : val}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Reps Control */}
                        <div style={{ marginBottom: 'var(--spacing-lg)', width: '100%' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                Repeticiones realizadas
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
                                <button
                                    type="button"
                                    onClick={() => adjustReps(-1)}
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        minWidth: '44px',
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'var(--bg-input)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-md)',
                                        color: '#FFFFFF',
                                        cursor: 'pointer',
                                        padding: 0
                                    }}
                                >
                                    <Minus size={20} />
                                </button>
                                <input
                                    type="number"
                                    value={reps}
                                    onChange={e => setReps(e.target.value)}
                                    placeholder="10"
                                    style={{
                                        flex: '1 1 0px',
                                        minWidth: 0,
                                        width: '100%',
                                        fontSize: '1.6rem',
                                        fontWeight: 800,
                                        textAlign: 'center',
                                        padding: '10px 4px',
                                        background: 'var(--bg-input)',
                                        border: '1px solid var(--border-light)',
                                        borderRadius: 'var(--radius-md)',
                                        color: '#FFFFFF',
                                        boxSizing: 'border-box'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => adjustReps(+1)}
                                    style={{
                                        width: '44px',
                                        height: '44px',
                                        minWidth: '44px',
                                        flexShrink: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'var(--bg-input)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 'var(--radius-md)',
                                        color: '#FFFFFF',
                                        cursor: 'pointer',
                                        padding: 0
                                    }}
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>

                        {/* RIR Achieved Selector */}
                        <div style={{ marginBottom: 'var(--spacing-xl)', width: '100%' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                RIR conseguido en esta serie
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', width: '100%', boxSizing: 'border-box' }}>
                                {['3', '2', '1', '0', 'F'].map(r => {
                                    const isSelected = selectedRir === r;
                                    return (
                                        <button
                                            key={r}
                                            type="button"
                                            onClick={() => setSelectedRir(r)}
                                            style={{
                                                padding: '8px 0',
                                                borderRadius: 'var(--radius-sm)',
                                                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                                                background: isSelected ? 'var(--gradient-primary)' : 'var(--bg-input)',
                                                color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                                                fontWeight: 800,
                                                fontSize: '0.8rem',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {r === 'F' ? 'Fallo' : `RIR ${r}`}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Big Complete Set Button */}
                        <button
                            type="button"
                            onClick={handleCompleteSet}
                            className="btn btn-accent btn-lg"
                            style={{
                                width: '100%',
                                fontSize: '1.15rem',
                                padding: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                boxShadow: '0 4px 20px rgba(211, 47, 47, 0.4)'
                            }}
                        >
                            <Check size={24} />
                            Completar Serie {currentSetNumber}
                        </button>
                    </div>
                )}

                {/* Jump between exercises navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <button
                        onClick={handlePrevExercise}
                        disabled={currentExerciseIndex === 0}
                        className="btn btn-secondary"
                        style={{ flex: 1, opacity: currentExerciseIndex === 0 ? 0.4 : 1 }}
                    >
                        <ChevronLeft size={18} />
                        Anterior
                    </button>
                    <button
                        onClick={handleNextExercise}
                        className="btn btn-secondary"
                        style={{ flex: 1 }}
                    >
                        {currentExerciseIndex === exercises.length - 1 ? 'Finalizar' : 'Siguiente'}
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Rest Timer Modal */}
            {showTimer && (
                <RestTimer
                    duration={timerDuration}
                    onComplete={handleRestTimerComplete}
                    onSkip={() => setShowTimer(false)}
                />
            )}

            {/* Notes Modal */}
            {showNotes && (
                <NotesModal
                    exercise={currentExercise}
                    onClose={() => setShowNotes(false)}
                />
            )}

            {/* Edit Set Modal */}
            {editingSet && (
                <EditSetModal
                    isOpen={true}
                    set={editingSet}
                    exerciseName={currentExercise.name}
                    onSave={handleSaveEditedSet}
                    onDelete={handleDeleteSet}
                    onClose={() => setEditingSet(null)}
                />
            )}
        </div>
    );
}
