import { useState, useEffect } from 'react';
import { X, Check, ChevronLeft, ChevronRight, StickyNote, Timer, Pause } from 'lucide-react';
import {
    getExercisesByWorkout,
    createSession,
    addSet,
    updateSession,
    getSetsByExercise
} from '../db/database';
import RestTimer from './RestTimer';
import NotesModal from './NotesModal';
import PrepTimer from './PrepTimer';
import { requestWakeLock, releaseWakeLock } from '../utils/wakeLock';
import { saveSession, clearSession } from '../utils/sessionStorage';
import { getExerciseImageUrl } from '../data/exerciseImages';

export default function SessionTracker({ workout, onClose }) {
    const [exercises, setExercises] = useState([]);
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [currentSetNumber, setCurrentSetNumber] = useState(1);
    const [sessionId, setSessionId] = useState(null);
    const [weight, setWeight] = useState('');
    const [rpe, setRpe] = useState(null); // RPE 1-5 scale
    const [exercisePhase, setExercisePhase] = useState('input'); // 'input', 'executing', 'rpe'
    const [sessionSets, setSessionSets] = useState({});
    const [showTimer, setShowTimer] = useState(false);
    const [timerDuration, setTimerDuration] = useState(90);
    const [showPrepTimer, setShowPrepTimer] = useState(false);
    const [showNotes, setShowNotes] = useState(false);
    const [lastWeights, setLastWeights] = useState({});
    const [startTime] = useState(Date.now());
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        initSession();
    }, [workout]);

    // Block navigation during active session
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '¿Seguro que quieres salir? Perderás el progreso de esta sesión.';
            return e.returnValue;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Activate wake lock to keep screen on
        requestWakeLock();

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            // Release wake lock when component unmounts
            releaseWakeLock();
        };
    }, []);

    useEffect(() => {
        if (exercises.length > 0) {
            loadLastWeight(exercises[currentExerciseIndex]);
        }
    }, [currentExerciseIndex, exercises]);

    async function initSession() {
        const exerciseList = await getExercisesByWorkout(workout.id);
        setExercises(exerciseList);

        // Check if resuming a paused session
        if (workout.savedSession) {
            const saved = workout.savedSession;

            // Restore all state
            setSessionId(saved.sessionId);
            setCurrentExerciseIndex(saved.currentExerciseIndex);
            setCurrentSetNumber(saved.currentSetNumber);
            setWeight(saved.weight || '');
            setRpe(saved.rpe);
            setExercisePhase(saved.exercisePhase || 'input');
            setSessionSets(saved.sessionSets || {});

            // Clear the saved session from localStorage
            clearSession();
        } else {
            // New session
            const id = await createSession(workout.id);
            setSessionId(id);
        }

        // Load last weights for all exercises
        const weights = {};
        for (const exercise of exerciseList) {
            const sets = await getSetsByExercise(exercise.id);
            if (sets.length > 0) {
                weights[exercise.id] = sets[0].weight;
            }
        }
        setLastWeights(weights);
    }

    async function loadLastWeight(exercise) {
        if (lastWeights[exercise.id]) {
            setWeight(lastWeights[exercise.id].toString());
        } else {
            setWeight('');
        }
        setRpe(null); // Reset RPE for new exercise
    }

    function parseRestTime(restString) {
        // Parse rest time like "90 s", "2 min", "3-4 min"
        if (restString.includes('90')) return 90;
        if (restString.includes('2')) return 120;
        if (restString.includes('3')) return 180;
        if (restString.includes('4')) return 240;
        return 90;
    }

    // NEW WORKFLOW: Start all 5 sets for current exercise
    function startExerciseSets() {
        if (!weight) return;

        // Change to executing phase
        setExercisePhase('executing');
        setCurrentSetNumber(1);

        // Start first PrepTimer
        setShowPrepTimer(true);
    }

    // Called when PrepTimer completes - user does the set, then RestTimer starts automatically
    function handlePrepTimerComplete() {
        setShowPrepTimer(false);

        const exercise = exercises[currentExerciseIndex];
        const totalSets = parseInt(exercise.sets.match(/\d+/)[0]);

        // After a short delay (user does the set), start rest timer automatically
        // For now, start rest timer immediately - user will do set during rest
        if (currentSetNumber < totalSets) {
            // Start rest timer for next set
            const restSeconds = parseRestTime(exercise.rest);
            setTimerDuration(restSeconds);
            setShowTimer(true);
        } else {
            // All sets done, move to RPE phase
            setExercisePhase('rpe');
        }
    }

    // Called when RestTimer completes - move to next set
    function handleRestTimerComplete() {
        setShowTimer(false);
        setCurrentSetNumber(prev => prev + 1);

        // Start PrepTimer for next set
        setShowPrepTimer(true);
    }

    // Submit RPE for all sets of current exercise
    async function submitExerciseRPE() {
        if (!rpe) return;

        const exercise = exercises[currentExerciseIndex];
        const totalSets = parseInt(exercise.sets.match(/\d+/)[0]);

        // Extract target reps
        const repsMatch = exercise.reps.match(/(\d+)(?:-(\d+))?/);
        const targetReps = repsMatch ?
            (repsMatch[2] ? Math.round((parseInt(repsMatch[1]) + parseInt(repsMatch[2])) / 2) : parseInt(repsMatch[1]))
            : 10;

        // Save all sets with same weight and RPE
        for (let setNum = 1; setNum <= totalSets; setNum++) {
            await addSet(
                sessionId,
                exercise.id,
                setNum,
                parseFloat(weight),
                targetReps,
                exercise.rir,
                rpe
            );

            // Store in state
            const key = `${exercise.id}-${setNum}`;
            setSessionSets(prev => ({
                ...prev,
                [key]: { weight: parseFloat(weight), reps: targetReps, rpe }
            }));
        }

        // Move to next exercise or complete workout
        if (currentExerciseIndex < exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
            setCurrentSetNumber(1);
            setExercisePhase('input');
            setWeight('');
            setRpe(null);

            // Load last weight for next exercise
            loadLastWeight(exercises[currentExerciseIndex + 1]);
        } else {
            // Workout complete!
            await completeSession();
        }
    }

    async function completeSession() {
        const duration = Math.floor((Date.now() - startTime) / 1000 / 60); // minutes
        await updateSession(sessionId, { duration });

        // Clear saved session
        clearSession();

        // Show completion message
        alert('¡Sesión completada! 💪');
        onClose();
    }

    function handlePauseSession() {
        // Save current state
        const sessionData = {
            workoutId: workout.id,
            workoutName: workout.name,
            sessionId,
            currentExerciseIndex,
            currentSetNumber,
            weight,
            rpe,
            exercisePhase,
            sessionSets,
            startTime
        };

        saveSession(sessionData);

        // Release wake lock
        releaseWakeLock();

        // Close without completing
        onClose();
    }

    function handlePreviousExercise() {
        if (currentExerciseIndex > 0) {
            setCurrentExerciseIndex(prev => prev - 1);
            setCurrentSetNumber(1);
        }
    }

    function handleNextExercise() {
        if (currentExerciseIndex < exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
            setCurrentSetNumber(1);
        }
    }

    function handleSkipSet() {
        const exercise = exercises[currentExerciseIndex];
        const totalSets = parseInt(exercise.sets.match(/\d+/)[0]);

        if (currentSetNumber < totalSets) {
            setCurrentSetNumber(prev => prev + 1);
        } else if (currentExerciseIndex < exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
            setCurrentSetNumber(1);
        }
    }

    if (exercises.length === 0) {
        return <div className="container" style={{ padding: 'var(--spacing-xl)' }}>
            <p>Cargando ejercicios...</p>
        </div>;
    }

    const currentExercise = exercises[currentExerciseIndex];
    const totalSets = parseInt(currentExercise.sets.match(/\d+/)[0]);
    const progress = ((currentExerciseIndex * totalSets + currentSetNumber - 1) /
        (exercises.reduce((sum, ex) => sum + parseInt(ex.sets.match(/\d+/)[0]), 0))) * 100;

    return (
        <div className="animate-fadeIn" style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
            {/* Header */}
            <div style={{
                background: 'var(--gradient-accent)',
                padding: 'var(--spacing-lg)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ color: 'white', margin: 0 }}>{workout.name}</h3>
                        <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                            <button
                                onClick={handlePauseSession}
                                className="btn-icon"
                                style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
                                title="Pausar sesión"
                            >
                                <Pause size={24} />
                            </button>
                            <button
                                onClick={onClose}
                                className="btn-icon"
                                style={{ background: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
                                title="Cerrar (perderás el progreso)"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={{
                        marginTop: 'var(--spacing-md)',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: 'var(--radius-full)',
                        height: '8px',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            width: `${progress}%`,
                            height: '100%',
                            background: 'white',
                            transition: 'width 0.3s ease'
                        }} />
                    </div>

                    <p style={{
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontSize: '0.875rem',
                        marginTop: 'var(--spacing-sm)',
                        marginBottom: 0
                    }}>
                        Ejercicio {currentExerciseIndex + 1} de {exercises.length}
                    </p>
                </div>
            </div>

            <div className="container" style={{ padding: 'var(--spacing-xl) var(--spacing-md)' }}>
                {/* Exercise Image */}
                <div style={{
                    background: 'var(--bg-card)',
                    borderRadius: 'var(--radius-xl)',
                    marginBottom: 'var(--spacing-xl)',
                    overflow: 'hidden',
                    border: '1px solid var(--border)'
                }}>
                    {(() => {
                        const exerciseImageUrl = getExerciseImageUrl(currentExercise.name);

                        if (exerciseImageUrl && !imageError) {
                            return (
                                <img
                                    src={exerciseImageUrl}
                                    alt={currentExercise.name}
                                    onError={() => setImageError(true)}
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        display: 'block',
                                        minHeight: '250px',
                                        objectFit: 'cover',
                                        background: 'var(--bg-input)'
                                    }}
                                />
                            );
                        }

                        // Fallback placeholder
                        return (
                            <div style={{
                                padding: 'var(--spacing-xl)',
                                textAlign: 'center',
                                minHeight: '250px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column'
                            }}>
                                <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>💪</div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                                    {currentExercise.name}
                                </p>
                            </div>
                        );
                    })()}
                </div>

                {/* Exercise Info */}
                <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h2 style={{ marginBottom: 'var(--spacing-md)' }}>{currentExercise.name}</h2>

                    <div style={{
                        display: 'flex',
                        gap: 'var(--spacing-md)',
                        marginBottom: 'var(--spacing-md)'
                    }}>
                        <div className="badge badge-primary" style={{ fontSize: '0.875rem', padding: 'var(--spacing-sm) var(--spacing-md)' }}>
                            Serie {currentSetNumber} / {totalSets}
                        </div>
                        <div className="badge badge-success" style={{ fontSize: '0.875rem', padding: 'var(--spacing-sm) var(--spacing-md)' }}>
                            {currentExercise.reps} reps
                        </div>
                        <div className="badge badge-warning" style={{ fontSize: '0.875rem', padding: 'var(--spacing-sm) var(--spacing-md)' }}>
                            RIR {currentExercise.rir}
                        </div>
                    </div>

                    {lastWeights[currentExercise.id] && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            Último peso: <strong>{lastWeights[currentExercise.id]} kg</strong>
                        </p>
                    )}
                </div>

                {/* Phase-based UI */}
                {exercisePhase === 'input' && (
                    <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        {/* Weight Input */}
                        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                Peso (kg)
                            </label>
                            <input
                                type="number"
                                className="input"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                placeholder="0"
                                step="0.5"
                                style={{ fontSize: '1.5rem', textAlign: 'center', width: '100%' }}
                            />
                        </div>

                        <button
                            onClick={startExerciseSets}
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%' }}
                            disabled={!weight}
                        >
                            Iniciar {totalSets} Series
                        </button>
                    </div>
                )}

                {exercisePhase === 'executing' && (
                    <div className="card" style={{ marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}>
                        <h3 style={{ marginBottom: 'var(--spacing-md)' }}>
                            Haciendo las series...
                        </h3>
                        <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 'var(--spacing-md)' }}>
                            {weight} kg
                        </p>

                        {/* Progress indicator */}
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}>
                            {Array.from({ length: totalSets }).map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: i < currentSetNumber ? 'var(--success)' : 'var(--bg-input)',
                                        border: i === currentSetNumber - 1 ? '2px solid var(--primary)' : 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 600,
                                        color: i < currentSetNumber ? 'white' : 'var(--text-muted)'
                                    }}
                                >
                                    {i < currentSetNumber ? '✓' : i + 1}
                                </div>
                            ))}
                        </div>

                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            Los timers te guiarán automáticamente
                        </p>
                    </div>
                )}

                {exercisePhase === 'rpe' && (
                    <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <h3 style={{ marginBottom: 'var(--spacing-md)', textAlign: 'center' }}>
                            ¡Ejercicio completado!
                        </h3>
                        <p style={{ textAlign: 'center', fontSize: '1.25rem', marginBottom: 'var(--spacing-lg)', color: 'var(--text-secondary)' }}>
                            {totalSets} series × {weight} kg
                        </p>

                        {/* RPE Selector */}
                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                                RPE
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 'var(--spacing-sm)' }}>
                                {[1, 2, 3, 4, 5].map(level => {
                                    const emojis = ['😊', '🙂', '😐', '😓', '😰'];
                                    const isSelected = rpe === level;

                                    return (
                                        <button
                                            key={level}
                                            onClick={() => setRpe(level)}
                                            style={{
                                                padding: 'var(--spacing-md)',
                                                borderRadius: 'var(--radius-md)',
                                                border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                                                background: isSelected ? 'var(--primary)' : 'var(--bg-input)',
                                                color: isSelected ? 'white' : 'var(--text-primary)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: 'var(--spacing-xs)',
                                                transition: 'all 0.2s ease'
                                            }}
                                        >
                                            <div style={{ fontSize: '1.5rem' }}>{emojis[level - 1]}</div>
                                            <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{level}</div>
                                        </button>
                                    );
                                })}
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 'var(--spacing-sm)' }}>
                                1 = Muy fácil | 5 = Muy difícil
                            </p>
                        </div>

                        <button
                            onClick={submitExerciseRPE}
                            className="btn btn-success btn-lg"
                            style={{ width: '100%' }}
                            disabled={!rpe}
                        >
                            <Check size={24} />
                            Guardar y Continuar
                        </button>
                    </div>
                )}

                {/* Previous Sets */}
                {Object.keys(sessionSets).filter(key => key.startsWith(`${currentExercise.id}-`)).length > 0 && (
                    <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Series completadas</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                            {Object.entries(sessionSets)
                                .filter(([key]) => key.startsWith(`${currentExercise.id}-`))
                                .map(([key, set]) => {
                                    const setNum = key.split('-')[1];
                                    const rpeEmojis = ['😊', '🙂', '😐', '😓', '😰'];
                                    return (
                                        <div
                                            key={key}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                padding: 'var(--spacing-sm)',
                                                background: 'var(--bg-input)',
                                                borderRadius: 'var(--radius-md)'
                                            }}
                                        >
                                            <span>Serie {setNum}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                                <span style={{ fontWeight: 600 }}>
                                                    {set.weight} kg × {set.reps} reps
                                                </span>
                                                {set.rpe && (
                                                    <span style={{ fontSize: '1.25rem' }}>
                                                        {rpeEmojis[set.rpe - 1]}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                )}

                {/* Navigation & Actions */}
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }}>
                    <button
                        onClick={handlePreviousExercise}
                        className="btn btn-secondary"
                        disabled={currentExerciseIndex === 0}
                        style={{ flex: 1 }}
                    >
                        <ChevronLeft size={20} />
                        Anterior
                    </button>

                    <button
                        onClick={() => setShowNotes(true)}
                        className="btn btn-secondary btn-icon"
                    >
                        <StickyNote size={20} />
                    </button>

                    <button
                        onClick={handleNextExercise}
                        className="btn btn-secondary"
                        disabled={currentExerciseIndex === exercises.length - 1}
                        style={{ flex: 1 }}
                    >
                        Siguiente
                        <ChevronRight size={20} />
                    </button>
                </div>

                <button
                    onClick={handleSkipSet}
                    className="btn btn-secondary"
                    style={{ width: '100%' }}
                >
                    Saltar Serie
                </button>
            </div>

            {/* Rest Timer */}
            {showTimer && (
                <RestTimer
                    duration={timerDuration}
                    onComplete={handleRestTimerComplete}
                    onSkip={handleRestTimerComplete}
                />
            )}

            {/* Prep Timer */}
            {showPrepTimer && (
                <PrepTimer
                    setNumber={currentSetNumber}
                    totalSets={totalSets}
                    onComplete={handlePrepTimerComplete}
                    onSkip={handlePrepTimerComplete}
                />
            )}

            {/* Notes Modal */}
            {showNotes && (
                <NotesModal
                    exercise={currentExercise}
                    onClose={() => setShowNotes(false)}
                />
            )}
        </div>
    );
}
