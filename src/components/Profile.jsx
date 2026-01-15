import { useState, useEffect } from 'react';
import { Download, Upload, Trash2, Database } from 'lucide-react';
import { exportData, importData, clearAllData, getDatabaseStats } from '../db/backup';

export default function Profile() {
    const [stats, setStats] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadStats();
    }, []);

    async function loadStats() {
        const dbStats = await getDatabaseStats();
        setStats(dbStats);
    }

    async function handleExport() {
        const result = await exportData();
        setMessage(result.message);
        setTimeout(() => setMessage(''), 3000);
    }

    async function handleImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const confirmReplace = window.confirm(
            '¿Quieres reemplazar todos los datos existentes?\n\n' +
            'SÍ = Borra todo y carga el backup\n' +
            'NO = Añade el backup a los datos actuales'
        );

        const result = await importData(file, confirmReplace);
        setMessage(result.message);
        setTimeout(() => setMessage(''), 3000);

        if (result.success) {
            loadStats();
        }

        // Reset file input
        event.target.value = '';
    }

    async function handleClearData() {
        const confirm = window.confirm(
            '⚠️ ADVERTENCIA ⚠️\n\n' +
            'Esto eliminará TODOS tus datos:\n' +
            '- Historial de entrenamientos\n' +
            '- Series registradas\n' +
            '- Notas\n\n' +
            '¿Estás seguro?\n\n' +
            'Recomendación: Exporta un backup antes de continuar.'
        );

        if (!confirm) return;

        const doubleConfirm = window.confirm('¿Estás COMPLETAMENTE seguro? Esta acción no se puede deshacer.');

        if (!doubleConfirm) return;

        const result = await clearAllData();
        setMessage(result.message);
        setTimeout(() => setMessage(''), 3000);

        if (result.success) {
            loadStats();
        }
    }

    return (
        <div className="container animate-fadeIn" style={{ paddingTop: 'var(--spacing-xl)', paddingBottom: 'var(--spacing-xl)' }}>
            <h2 style={{ marginBottom: 'var(--spacing-lg)' }}>Perfil</h2>

            <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
                <img
                    src="/logo.png"
                    alt="GorilApp Logo"
                    style={{
                        height: '120px',
                        width: '120px',
                        objectFit: 'contain',
                        margin: '0 auto var(--spacing-md)'
                    }}
                />
                <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>GorilApp</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
                    Tu gymbro de entrenamiento
                </p>

                <div style={{
                    background: 'var(--bg-input)',
                    padding: 'var(--spacing-lg)',
                    borderRadius: 'var(--radius-lg)',
                    textAlign: 'left'
                }}>
                    <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Características v1.2.1</h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        <li style={{ padding: 'var(--spacing-sm) 0', borderBottom: '1px solid var(--border)' }}>
                            ✅ <strong>Gestión Total (CRUD)</strong>: Crea y edita ejercicios
                        </li>
                        <li style={{ padding: 'var(--spacing-sm) 0', borderBottom: '1px solid var(--border)' }}>
                            ✅ <strong>Timers Pro</strong>: Tabata, EMOM, AMRAP, Clock
                        </li>
                        <li style={{ padding: 'var(--spacing-sm) 0', borderBottom: '1px solid var(--border)' }}>
                            ✅ <strong>Modo LED</strong>: Estética 7-segmentos
                        </li>
                        <li style={{ padding: 'var(--spacing-sm) 0', borderBottom: '1px solid var(--border)' }}>
                            ✅ <strong>Registro Completo</strong>: Series, Reps, RIR, Notas
                        </li>
                        <li style={{ padding: 'var(--spacing-sm) 0', borderBottom: '1px solid var(--border)' }}>
                            ✅ <strong>100% Privado</strong>: Datos locales (DexieDB)
                        </li>
                        <li style={{ padding: 'var(--spacing-sm) 0' }}>
                            ✅ <strong>PWA Offline</strong>: Entrena sin internet
                        </li>
                    </ul>
                </div>

                <p style={{ marginTop: 'var(--spacing-xl)', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    Versión 1.2.1 - Desarrollado por Jimmy80
                </p>
            </div>

            {/* Database Statistics */}
            {stats && (
                <div className="card" style={{ marginTop: 'var(--spacing-lg)' }}>
                    <h4 style={{ marginBottom: 'var(--spacing-md)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <Database size={20} />
                        Estadísticas de la Base de Datos
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-md)' }}>
                        <div style={{ background: 'var(--bg-input)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{stats.sessions}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Sesiones</div>
                        </div>
                        <div style={{ background: 'var(--bg-input)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{stats.sets}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Series</div>
                        </div>
                        <div style={{ background: 'var(--bg-input)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{stats.exercises}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Ejercicios</div>
                        </div>
                        <div style={{ background: 'var(--bg-input)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{stats.notes}</div>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Notas</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Backup & Restore */}
            <div className="card" style={{ marginTop: 'var(--spacing-lg)' }}>
                <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Backup y Restauración</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 'var(--spacing-lg)' }}>
                    Exporta tus datos para hacer backup o importa datos desde otro dispositivo
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {/* Export Button */}
                    <button
                        onClick={handleExport}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                    >
                        <Download size={20} />
                        Exportar Datos (Backup)
                    </button>

                    {/* Import Button */}
                    <label className="btn btn-secondary" style={{ width: '100%', cursor: 'pointer', margin: 0 }}>
                        <Upload size={20} />
                        Importar Datos
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImport}
                            style={{ display: 'none' }}
                        />
                    </label>

                    {/* Clear Data Button */}
                    <button
                        onClick={handleClearData}
                        className="btn"
                        style={{
                            width: '100%',
                            background: 'var(--error)',
                            color: 'white'
                        }}
                    >
                        <Trash2 size={20} />
                        Borrar Todos los Datos
                    </button>
                </div>

                {/* Message */}
                {message && (
                    <div style={{
                        marginTop: 'var(--spacing-md)',
                        padding: 'var(--spacing-md)',
                        background: message.includes('Error') ? 'var(--error)' : 'var(--success)',
                        color: 'white',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem',
                        textAlign: 'center'
                    }}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
