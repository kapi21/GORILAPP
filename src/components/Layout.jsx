import { Dumbbell, Calendar, TrendingUp, User, Timer } from 'lucide-react';

export default function Layout({ children, currentView, onNavigate }) {
    const navItems = [
        { id: 'workouts', label: 'Rutinas', icon: Dumbbell },
        { id: 'timer', label: 'Timer', icon: Timer },
        { id: 'history', label: 'Historial', icon: Calendar },
        { id: 'progress', label: 'Progreso', icon: TrendingUp },
        { id: 'profile', label: 'Perfil', icon: User }
    ];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Header Pro Sport Glassmorphism */}
            <header style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                background: 'linear-gradient(180deg, rgba(20, 14, 14, 0.88) 0%, rgba(10, 10, 10, 0.82) 100%)',
                backdropFilter: 'blur(16px) saturate(180%)',
                WebkitBackdropFilter: 'blur(16px) saturate(180%)',
                borderBottom: '1px solid rgba(211, 47, 47, 0.35)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), 0 1px 0 rgba(255, 255, 255, 0.05) inset',
                overflow: 'hidden'
            }}>
                {/* Línea láser inferior con brillo neón carmesí */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(211, 47, 47, 0.2) 15%, #D32F2F 50%, rgba(211, 47, 47, 0.2) 85%, transparent 100%)',
                    boxShadow: '0 0 10px rgba(211, 47, 47, 0.8)'
                }} />

                {/* Silueta deportiva de Gorila traslúcida en segundo plano */}
                <img
                    src="/Gorilapp-solo-gorila.png"
                    alt=""
                    aria-hidden="true"
                    style={{
                        position: 'absolute',
                        right: '-20px',
                        top: '-18px',
                        height: '115px',
                        opacity: 0.12,
                        filter: 'contrast(160%)',
                        pointerEvents: 'none',
                        userSelect: 'none',
                        transform: 'rotate(-4deg)'
                    }}
                />

                <div className="container" style={{ position: 'relative', zIndex: 2, padding: '10px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {/* Logo + Tipografía deportiva */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                position: 'relative',
                                width: '44px',
                                height: '44px',
                                borderRadius: '12px',
                                background: 'linear-gradient(135deg, rgba(211, 47, 47, 0.35) 0%, rgba(18, 18, 18, 0.95) 100%)',
                                border: '1px solid rgba(211, 47, 47, 0.55)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 0 16px rgba(211, 47, 47, 0.35)',
                                overflow: 'hidden',
                                flexShrink: 0
                            }}>
                                <img
                                    src="/Gorilapp-solo-gorila.png"
                                    alt="GorilApp"
                                    style={{
                                        height: '36px',
                                        width: '36px',
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0 0 6px rgba(255, 68, 68, 0.6))'
                                    }}
                                />
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{
                                        fontFamily: "'Montserrat', sans-serif",
                                        fontWeight: 900,
                                        fontSize: '1.35rem',
                                        letterSpacing: '1px',
                                        background: 'linear-gradient(180deg, #FFFFFF 30%, #ff8a80 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        textTransform: 'uppercase',
                                        lineHeight: 1.1
                                    }}>
                                        GORILAPP
                                    </span>
                                    <span style={{
                                        background: 'rgba(211, 47, 47, 0.25)',
                                        color: '#ff8a80',
                                        border: '1px solid rgba(211, 47, 47, 0.6)',
                                        borderRadius: '4px',
                                        fontSize: '0.62rem',
                                        fontWeight: 900,
                                        padding: '1px 5px',
                                        letterSpacing: '0.5px'
                                    }}>
                                        PRO
                                    </span>
                                </div>
                                <div style={{
                                    fontSize: '0.68rem',
                                    color: 'var(--text-secondary)',
                                    fontWeight: 700,
                                    letterSpacing: '0.8px',
                                    textTransform: 'uppercase',
                                    opacity: 0.85
                                }}>
                                    GYM TRACKER · IRON PERFORMANCE
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ flex: 1, paddingBottom: 'calc(85px + env(safe-area-inset-bottom, 0px))' }}>
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'var(--bg-card)',
                borderTop: '1px solid var(--border)',
                paddingTop: 'var(--spacing-sm)',
                paddingBottom: 'calc(var(--spacing-sm) + env(safe-area-inset-bottom, 0px))',
                boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.3)',
                zIndex: 100
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    {navItems.map(item => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => onNavigate(item.id)}
                                className="btn-icon"
                                style={{
                                    background: isActive ? 'var(--gradient-primary)' : 'transparent',
                                    color: isActive ? 'white' : 'var(--text-secondary)',
                                    border: 'none',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: 'var(--spacing-sm)',
                                    borderRadius: 'var(--radius-md)',
                                    minWidth: '60px',
                                    transition: 'all var(--transition-base)'
                                }}
                            >
                                <Icon size={24} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
