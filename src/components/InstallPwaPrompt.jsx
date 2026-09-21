import React, { useState, useEffect } from 'react';
import { Download, Smartphone, Check } from 'lucide-react';

export default function InstallPwaPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isInstalled, setIsInstalled] = useState(false);
    const [isIos, setIsIos] = useState(false);
    const [showIosGuide, setShowIosGuide] = useState(false);

    useEffect(() => {
        // Comprobar si ya está instalada como PWA standalone
        if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
            setIsInstalled(true);
            return;
        }

        // Detectar si es dispositivo iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIos(isIosDevice);

        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        window.addEventListener('appinstalled', () => {
            setIsInstalled(true);
            setDeferredPrompt(null);
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setIsInstalled(true);
            }
            setDeferredPrompt(null);
        } else if (isIos) {
            setShowIosGuide(!showIosGuide);
        } else {
            alert('Para instalar la aplicación, pulsa el menú de 3 puntos de tu navegador (⋮) y selecciona "Añadir a la pantalla de inicio" o "Instalar aplicación".');
        }
    };

    if (isInstalled) {
        return (
            <div style={{
                background: 'rgba(76, 175, 80, 0.15)',
                border: '1px solid rgba(76, 175, 80, 0.3)',
                borderRadius: 'var(--radius-lg)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#81c784',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginTop: '12px'
            }}>
                <Check size={18} />
                <span>GorilApp está instalada como App nativa en tu dispositivo</span>
            </div>
        );
    }

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.25) 0%, rgba(30, 20, 20, 0.9) 100%)',
            border: '1px solid var(--primary)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px',
            marginTop: '12px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Smartphone size={24} color="#ff8a80" />
                    <div>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#FFFFFF' }}>
                            Instalar GorilApp en el móvil
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Uso a pantalla completa, sin barras y 100% offline
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleInstallClick}
                    className="btn btn-primary"
                    style={{
                        padding: '8px 16px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: 'var(--shadow-md)',
                        cursor: 'pointer'
                    }}
                >
                    <Download size={16} />
                    <span>Instalar App</span>
                </button>
            </div>

            {showIosGuide && (
                <div style={{
                    marginTop: '12px',
                    padding: '10px',
                    background: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.8rem',
                    color: '#ffcdd2',
                    lineHeight: '1.4'
                }}>
                    <strong>Cómo instalar en iPhone / iPad:</strong><br />
                    1. En Safari, pulsa el botón <strong>Compartir</strong> (icono de cuadrado con flecha hacia arriba ⬆).<br />
                    2. Desliza hacia abajo y selecciona <strong>"Añadir a la pantalla de inicio"</strong>.
                </div>
            )}
        </div>
    );
}
