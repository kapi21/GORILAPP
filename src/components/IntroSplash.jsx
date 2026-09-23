import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play } from 'lucide-react';

export default function IntroSplash({ onFinish }) {
    const [muted, setMuted] = useState(true);
    const [needsTap, setNeedsTap] = useState(false);
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Intentar reproducir con sonido primero; si el navegador lo bloquea, mutear para reproducir
        video.play().catch(() => {
            video.muted = true;
            setMuted(true);
            video.play().catch(() => {
                setNeedsTap(true);
            });
        });
    }, []);

    function handleToggleMute(e) {
        e.stopPropagation();
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setMuted(videoRef.current.muted);
        }
    }

    function handleStartManual() {
        if (videoRef.current) {
            videoRef.current.play().then(() => {
                setNeedsTap(false);
            }).catch(() => {
                onFinish();
            });
        }
    }

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#0a0a0a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
        }}>
            <video
                ref={videoRef}
                src="/intro.mp4"
                playsInline
                autoPlay
                muted={muted}
                onEnded={onFinish}
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    maxHeight: '100vh'
                }}
            />

            {/* Botón Saltar Intro */}
            <button
                type="button"
                onClick={onFinish}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    zIndex: 10000,
                    background: 'rgba(0, 0, 0, 0.65)',
                    color: '#FFFFFF',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '20px',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backdropFilter: 'blur(8px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                }}
            >
                Saltar intro ✕
            </button>

            {/* Control de Audio */}
            {!needsTap && (
                <button
                    type="button"
                    onClick={handleToggleMute}
                    style={{
                        position: 'absolute',
                        bottom: '24px',
                        left: '20px',
                        zIndex: 10000,
                        background: 'rgba(0, 0, 0, 0.65)',
                        color: muted ? '#ff8a80' : '#4caf50',
                        border: '1px solid rgba(255, 255, 255, 0.25)',
                        borderRadius: '50%',
                        width: '42px',
                        height: '42px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        backdropFilter: 'blur(8px)'
                    }}
                    title={muted ? 'Activar sonido' : 'Silenciar'}
                >
                    {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>
            )}

            {/* Aviso si el navegador requiere pulsar para reproducir */}
            {needsTap && (
                <button
                    type="button"
                    onClick={handleStartManual}
                    style={{
                        position: 'absolute',
                        zIndex: 10000,
                        background: 'var(--gradient-primary)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '30px',
                        padding: '14px 28px',
                        fontSize: '1rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: '0 6px 20px rgba(211, 47, 47, 0.6)'
                    }}
                >
                    <Play size={20} />
                    Entrar a GorilApp
                </button>
            )}
        </div>
    );
}
