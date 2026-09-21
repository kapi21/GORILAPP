import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export default function ExerciseModal({ isOpen = true, onClose, onSave, initialData, exercise }) {
    const data = initialData || exercise;

    const [formData, setFormData] = useState({
        name: '',
        muscleGroup: '',
        sets: 3,
        reps: '8-12',
        rir: '1-0',
        rest: '2 min',
        notes: ''
    });

    useEffect(() => {
        if (data) {
            setFormData({
                name: data.name || '',
                muscleGroup: data.muscleGroup || '',
                sets: data.sets || 3,
                reps: data.reps || '8-12',
                rir: data.rir || '1-0',
                rest: data.rest || '2 min',
                notes: data.notes || ''
            });
        } else {
            setFormData({
                name: '',
                muscleGroup: '',
                sets: 3,
                reps: '8-12',
                rir: '1-0',
                rest: '2 min',
                notes: ''
            });
        }
    }, [data, isOpen]);

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
                        {data ? 'Editar Ejercicio' : 'Nuevo Ejercicio'}
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
                            placeholder="Ej: Press Banca con Mancuernas"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>Grupo Muscular</label>
                        <input
                            type="text"
                            name="muscleGroup"
                            value={formData.muscleGroup}
                            onChange={handleChange}
                            className="input"
                            placeholder="Ej: PECTORAL, DORSAL, DEL. MEDIAL, BÍCEPS..."
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                        <div className="form-group">
                            <label>Series</label>
                            <input
                                type="text"
                                name="sets"
                                value={formData.sets}
                                onChange={handleChange}
                                className="input"
                                placeholder="Ej: 3 o 4"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Reps (Objetivo)</label>
                            <input
                                type="text"
                                name="reps"
                                value={formData.reps}
                                onChange={handleChange}
                                className="input"
                                placeholder="Ej: 8-12 o 1x5-8 / 1x8-11"
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                        <div className="form-group">
                            <label>RIR Target (por serie)</label>
                            <input
                                type="text"
                                name="rir"
                                value={formData.rir}
                                onChange={handleChange}
                                className="input"
                                placeholder="Ej: 0-0-F o 2-1"
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
                                placeholder="Ej: 2 min, 1'-2'"
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
                            placeholder="Tips técnicos, setup, tempo..."
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
                            {data ? 'Guardar Cambios' : 'Añadir Ejercicio'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
