import { useState, useEffect } from 'react';
import { X, Save, Trash2, Plus, Minus } from 'lucide-react';

export default function EditSetModal({
    isOpen = true,
    set,
    exerciseName = '',
    onSave,
    onDelete,
    onClose
}) {
    const [weight, setWeight] = useState('');
    const [reps, setReps] = useState('');
    const [rir, setRir] = useState('');

    useEffect(() => {
        if (set) {
            setWeight(set.weight !== undefined ? set.weight.toString() : '');
            setReps(set.reps !== undefined ? set.reps.toString() : '');
            setRir(set.rir !== undefined ? set.rir.toString() : '');
        }
    }, [set, isOpen]);

    if (!isOpen || !set) return null;

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

    function handleSubmit(e) {
        e.preventDefault();
        if (!weight || !reps) {
            alert('Introduce peso y repeticiones válidos');
            return;
        }

        onSave({
            ...set,
            weight: parseFloat(weight),
            reps: parseInt(reps),
            rir: rir || '-'
        });
    }

    function handleDelete() {
        if (window.confirm(`¿Eliminar la Serie ${set.setNumber}?`)) {
            onDelete(set.id || set.setNumber);
        }
    }

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
            style={{
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px',
                background: 'rgba(0, 0, 0, 0.82)',
                backdropFilter: 'blur(4px)'
            }}
        >
            <div
                className="animate-slideUp"
                onClick={e => e.stopPropagation()}
                style={{
                    width: 'min(440px, 95vw)',
                    border: '1px solid var(--border-light)',
                    padding: 0,
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    background: 'var(--bg-card)',
                    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.7)'
                }}
            >
                {/* Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.3) 0%, rgba(26, 26, 26, 0.95) 100%)',
                    borderBottom: '1px solid var(--border)'
                }}>
                    <div style={{ minWidth: 0, flex: 1, paddingRight: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{
                                background: 'var(--primary)',
                                color: 'white',
                                fontSize: '0.65rem',
                                fontWeight: 800,
                                padding: '2px 6px',
                                borderRadius: '4px'
                            }}>
                                S{set.setNumber}
                            </span>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'white' }}>
                                Editar Serie {set.setNumber}
                            </span>
                        </div>
                        {exerciseName && (
                            <p style={{
                                margin: '2px 0 0 0',
                                fontSize: '0.75rem',
                                color: 'var(--text-secondary)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>
                                {exerciseName}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="btn-icon"
                        style={{ width: '28px', height: '28px', background: 'rgba(255, 255, 255, 0.08)', color: 'white' }}
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Form Controls */}
                <form onSubmit={handleSubmit} style={{ padding: '12px 14px' }}>
                    {/* Controls Row: Peso & Reps */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                        {/* Peso */}
                        <div style={{
                            background: 'var(--bg-input)',
                            padding: '6px 8px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700 }}>PESO</span>
                                <span style={{ fontSize: '0.65rem', color: 'var(--primary-light)', fontWeight: 800 }}>kg</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', margin: '2px 0' }}>
                                <input
                                    type="number"
                                    step="0.5"
                                    value={weight}
                                    onChange={e => setWeight(e.target.value)}
                                    style={{
                                        width: '100%',
                                        maxWidth: '90px',
                                        fontSize: '1.25rem',
                                        fontWeight: 800,
                                        textAlign: 'center',
                                        padding: '2px',
                                        background: 'transparent',
                                        border: 'none',
                                        borderBottom: '2px solid var(--primary)',
                                        color: '#FFFFFF',
                                        outline: 'none'
                                    }}
                                    required
                                />
                            </div>
                            {/* Pills +/- kg */}
                            <div style={{ display: 'flex', gap: '3px', marginTop: '4px' }}>
                                {[-5, -2.5, +2.5, +5].map(val => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => adjustWeight(val)}
                                        style={{
                                            flex: 1,
                                            padding: '4px 0',
                                            borderRadius: '3px',
                                            border: '1px solid var(--border)',
                                            background: val > 0 ? 'rgba(211, 47, 47, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                                            color: val > 0 ? '#ff8a80' : 'var(--text-secondary)',
                                            fontWeight: 700,
                                            fontSize: '0.68rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {val > 0 ? `+${val}` : val}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Repeticiones */}
                        <div style={{
                            background: 'var(--bg-input)',
                            padding: '6px 8px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700 }}>REPS</span>
                                <span style={{ fontSize: '0.65rem', color: 'var(--primary-light)', fontWeight: 800 }}>reps</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', margin: '2px 0' }}>
                                <button
                                    type="button"
                                    onClick={() => adjustReps(-1)}
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '4px',
                                        border: '1px solid var(--border)',
                                        background: 'rgba(255, 255, 255, 0.06)',
                                        color: 'var(--text-secondary)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}
                                >
                                    <Minus size={13} />
                                </button>
                                <input
                                    type="number"
                                    value={reps}
                                    onChange={e => setReps(e.target.value)}
                                    style={{
                                        width: '48px',
                                        fontSize: '1.25rem',
                                        fontWeight: 800,
                                        textAlign: 'center',
                                        padding: '2px',
                                        background: 'transparent',
                                        border: 'none',
                                        borderBottom: '2px solid var(--primary)',
                                        color: '#FFFFFF',
                                        outline: 'none'
                                    }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => adjustReps(+1)}
                                    style={{
                                        width: '28px',
                                        height: '28px',
                                        borderRadius: '4px',
                                        border: '1px solid var(--border)',
                                        background: 'rgba(211, 47, 47, 0.25)',
                                        color: '#ff8a80',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}
                                >
                                    <Plus size={13} />
                                </button>
                            </div>
                            <div style={{ textAlign: 'center', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                Repeticiones hechas
                            </div>
                        </div>
                    </div>

                    {/* RIR Selection */}
                    <div style={{ marginBottom: '10px' }}>
                        <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, marginBottom: '3px' }}>
                            RIR CONSEGUIDO
                        </span>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px' }}>
                            {['3', '2', '1', '0', 'F'].map(r => {
                                const isSelected = rir === r;
                                return (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setRir(r)}
                                        style={{
                                            padding: '5px 0',
                                            borderRadius: '3px',
                                            border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                                            background: isSelected ? 'var(--gradient-primary)' : 'var(--bg-input)',
                                            color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                                            fontWeight: 800,
                                            fontSize: '0.72rem',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {r === 'F' ? 'Fallo' : `RIR ${r}`}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{
                                flex: 1,
                                padding: '8px 12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                fontSize: '0.85rem',
                                fontWeight: 700
                            }}
                        >
                            <Save size={15} />
                            Guardar Corrección
                        </button>
                        {onDelete && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="btn-icon"
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    background: 'rgba(244, 67, 54, 0.15)',
                                    color: '#ff5252',
                                    border: '1px solid rgba(244, 67, 54, 0.3)',
                                    borderRadius: 'var(--radius-sm)'
                                }}
                                title="Eliminar serie"
                            >
                                <Trash2 size={16} />
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
