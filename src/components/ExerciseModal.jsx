import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export default function ExerciseModal({ isOpen, onClose, onSave, initialData }) {
    const [formData, setFormData] = useState({
        name: '',
        sets: 3,
        reps: '8-12',
        rir: '2',
        rest: '90s',
        notes: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                sets: initialData.sets || 3,
                reps: initialData.reps || '8-12',
                rir: initialData.rir || '2',
                rest: initialData.rest || '90s',
                notes: initialData.notes || ''
            });
        } else {
            // Reset to defaults for new exercise
            setFormData({
                name: '',
                sets: 3,
                reps: '8-12',
                rir: '2',
                rest: '90s',
                notes: ''
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content animate-slideUp"
                onClick={e => e.stopPropagation()}
                style={{ maxWidth: '500px', width: '90%' }}
            >
                <div className="modal-header">
                    <h3 style={{ margin: 0, color: 'white' }}>
                        {initialData ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
                    </h3>
                    <button onClick={onClose} className="btn-icon" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: 'var(--spacing-lg)' }}>
                    <div className="form-group">
                        <label>Nombre del Ejercicio</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="input"
                            placeholder="Ej: Press de Banca"
                            required
                            autoFocus
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                        <div className="form-group">
                            <label>Series</label>
                            <input
                                type="number"
                                name="sets"
                                value={formData.sets}
                                onChange={handleChange}
                                className="input"
                                min="1"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Reps</label>
                            <input
                                type="text"
                                name="reps"
                                value={formData.reps}
                                onChange={handleChange}
                                className="input"
                                placeholder="8-12"
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                        <div className="form-group">
                            <label>RIR Target</label>
                            <input
                                type="text"
                                name="rir"
                                value={formData.rir}
                                onChange={handleChange}
                                className="input"
                                placeholder="1-2"
                            />
                        </div>
                        <div className="form-group">
                            <label>Descanso</label>
                            <input
                                type="text"
                                name="rest"
                                value={formData.rest}
                                onChange={handleChange}
                                className="input"
                                placeholder="90s"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Notas (Opcional)</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="input"
                            placeholder="Tips técnicos, setup, etc."
                            rows={3}
                            style={{ resize: 'vertical' }}
                        />
                    </div>

                    <div style={{ marginTop: 'var(--spacing-xl)' }}>
                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%' }}
                        >
                            <Save size={20} />
                            {initialData ? 'Guardar Cambios' : 'Añadir Ejercicio'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
