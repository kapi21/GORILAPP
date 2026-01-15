import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { getWorkouts, getExercisesByWorkout, getProgressData } from '../db/database';

export default function ProgressCharts() {
    const [workouts, setWorkouts] = useState([]);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [exercises, setExercises] = useState([]);
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [progressData, setProgressData] = useState([]);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        loadWorkouts();
    }, []);

    useEffect(() => {
        if (selectedWorkout) {
            loadExercises(selectedWorkout);
        }
    }, [selectedWorkout]);

    useEffect(() => {
        if (selectedExercise) {
            loadProgress(selectedExercise);
        }
    }, [selectedExercise]);

    async function loadWorkouts() {
        const workoutList = await getWorkouts();
        setWorkouts(workoutList);
        if (workoutList.length > 0) {
            setSelectedWorkout(workoutList[0].id);
        }
    }

    async function loadExercises(workoutId) {
        const exerciseList = await getExercisesByWorkout(workoutId);
        setExercises(exerciseList);
        if (exerciseList.length > 0) {
            setSelectedExercise(exerciseList[0].id);
        }
    }

    async function loadProgress(exerciseId) {
        const data = await getProgressData(exerciseId, 90);
        setProgressData(data);

        if (data.length > 0) {
            const weights = data.map(d => d.weight);
            const maxWeight = Math.max(...weights);
            const avgWeight = weights.reduce((a, b) => a + b, 0) / weights.length;
            const trend = data.length > 1 ?
                ((data[data.length - 1].weight - data[0].weight) / data[0].weight * 100).toFixed(1) : 0;

            setStats({
                pr: maxWeight,
                average: avgWeight.toFixed(1),
                trend: parseFloat(trend),
                sessions: data.length
            });
        } else {
            setStats(null);
        }
    }

    const selectedExerciseName = exercises.find(e => e.id === selectedExercise)?.name || '';

    return (
        <div className="container animate-fadeIn" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xl)' }}>
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Progreso</h2>

            {/* Workout Selector */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Rutina
                </label>
                <select
                    className="input"
                    value={selectedWorkout || ''}
                    onChange={(e) => setSelectedWorkout(parseInt(e.target.value))}
                >
                    {workouts.map(workout => (
                        <option key={workout.id} value={workout.id}>
                            {workout.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Exercise Selector */}
            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-sm)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    Ejercicio
                </label>
                <select
                    className="input"
                    value={selectedExercise || ''}
                    onChange={(e) => setSelectedExercise(parseInt(e.target.value))}
                >
                    {exercises.map(exercise => (
                        <option key={exercise.id} value={exercise.id}>
                            {exercise.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: 'var(--spacing-md)',
                    marginBottom: 'var(--spacing-xl)'
                }}>
                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                            RÉCORD
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>
                            {stats.pr} kg
                        </div>
                    </div>

                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                            PROMEDIO
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                            {stats.average} kg
                        </div>
                    </div>

                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                            TENDENCIA
                        </div>
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: stats.trend >= 0 ? 'var(--success)' : 'var(--error)'
                        }}>
                            {stats.trend > 0 ? '+' : ''}{stats.trend}%
                        </div>
                    </div>

                    <div className="card" style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                            SESIONES
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                            {stats.sessions}
                        </div>
                    </div>
                </div>
            )}

            {/* Chart */}
            {progressData.length > 0 ? (
                <div className="card">
                    <h4 style={{ marginBottom: 'var(--spacing-lg)' }}>
                        Evolución de peso - {selectedExerciseName}
                    </h4>

                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={progressData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis
                                dataKey="date"
                                stroke="var(--text-muted)"
                                style={{ fontSize: '0.75rem' }}
                            />
                            <YAxis
                                stroke="var(--text-muted)"
                                style={{ fontSize: '0.75rem' }}
                                label={{ value: 'kg', angle: -90, position: 'insideLeft', fill: 'var(--text-muted)' }}
                            />
                            <Tooltip
                                contentStyle={{
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--text-primary)'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="weight"
                                stroke="url(#lineGradient)"
                                strokeWidth={3}
                                dot={{ fill: 'var(--primary)', r: 5 }}
                                activeDot={{ r: 7 }}
                            />
                            <defs>
                                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="var(--primary)" />
                                    <stop offset="100%" stopColor="var(--secondary)" />
                                </linearGradient>
                            </defs>
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                    <TrendingUp size={48} color="var(--text-muted)" style={{ margin: '0 auto var(--spacing-md)' }} />
                    <p style={{ color: 'var(--text-muted)' }}>
                        No hay datos de progreso para este ejercicio.
                        <br />
                        ¡Completa algunas sesiones para ver tu evolución!
                    </p>
                </div>
            )}
        </div>
    );
}
