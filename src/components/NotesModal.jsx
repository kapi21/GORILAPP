import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { addNote, getNotesByExercise } from '../db/database';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function NotesModal({ exercise, onClose }) {
    const [note, setNote] = useState('');
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        loadNotes();
    }, [exercise]);

    async function loadNotes() {
        const exerciseNotes = await getNotesByExercise(exercise.id);
        setNotes(exerciseNotes);
    }

    async function handleSave() {
        if (!note.trim()) return;

        await addNote(exercise.id, note.trim());
        setNote('');
        await loadNotes();
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-lg)' }}>
                    <h3 style={{ margin: 0 }}>Notas</h3>
                    <button onClick={onClose} className="btn-icon btn-secondary">
                        <X size={20} />
                    </button>
                </div>

                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>
                    {exercise.name}
                </p>

                {/* Add Note */}
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <textarea
                        className="input"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Escribe una nota sobre este ejercicio..."
                        rows={4}
                        style={{ resize: 'vertical', marginBottom: 'var(--spacing-md)' }}
                    />
                    <button
                        onClick={handleSave}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={!note.trim()}
                    >
                        <Save size={20} />
                        Guardar Nota
                    </button>
                </div>

                {/* Notes History */}
                {notes.length > 0 && (
                    <div>
                        <h4 style={{ marginBottom: 'var(--spacing-md)' }}>Notas anteriores</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', maxHeight: '300px', overflowY: 'auto' }}>
                            {notes.map(n => (
                                <div
                                    key={n.id}
                                    style={{
                                        padding: 'var(--spacing-md)',
                                        background: 'var(--bg-input)',
                                        borderRadius: 'var(--radius-md)',
                                        borderLeft: '3px solid var(--primary)'
                                    }}
                                >
                                    <p style={{ marginBottom: 'var(--spacing-xs)' }}>{n.note}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 0 }}>
                                        {format(new Date(n.date), "d 'de' MMMM 'a las' HH:mm", { locale: es })}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
