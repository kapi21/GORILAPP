import { Play, Pause, RotateCcw, Square } from 'lucide-react';

export default function TimerControls({
    isRunning,
    onStart,
    onPause,
    onReset,
    onStop,
    showStop = false,
    disabled = false
}) {
    return (
        <div style={{
            display: 'flex',
            gap: 'var(--spacing-md)',
            justifyContent: 'center',
            flexWrap: 'wrap'
        }}>
            {!isRunning ? (
                <button
                    onClick={onStart}
                    className="btn btn-primary btn-lg"
                    disabled={disabled}
                    style={{
                        minWidth: '120px',
                        fontSize: '1.25rem'
                    }}
                >
                    <Play size={24} fill="currentColor" />
                    START
                </button>
            ) : (
                <button
                    onClick={onPause}
                    className="btn btn-warning btn-lg"
                    disabled={disabled}
                    style={{
                        minWidth: '120px',
                        fontSize: '1.25rem',
                        background: 'var(--warning)',
                        color: 'white'
                    }}
                >
                    <Pause size={24} fill="currentColor" />
                    PAUSE
                </button>
            )}

            <button
                onClick={onReset}
                className="btn btn-secondary btn-lg"
                disabled={disabled}
                style={{
                    minWidth: '120px',
                    fontSize: '1.25rem'
                }}
            >
                <RotateCcw size={24} />
                RESET
            </button>

            {showStop && (
                <button
                    onClick={onStop}
                    className="btn btn-lg"
                    disabled={disabled}
                    style={{
                        minWidth: '120px',
                        fontSize: '1.25rem',
                        background: 'var(--error)',
                        color: 'white'
                    }}
                >
                    <Square size={24} fill="currentColor" />
                    STOP
                </button>
            )}
        </div>
    );
}
