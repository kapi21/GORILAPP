import { useState, useEffect } from 'react';
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
            {/* Header */}
            <header style={{
                background: 'var(--gradient-primary)',
                padding: 'var(--spacing-lg)',
                boxShadow: 'var(--shadow-md)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div className="container">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                        <img
                            src="/logo.png"
                            alt="GorilApp Logo"
                            style={{
                                height: '45px',
                                width: '45px',
                                objectFit: 'contain'
                            }}
                        />
                        <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>
                            GorilApp
                        </h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ flex: 1, paddingBottom: '80px' }}>
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
                padding: 'var(--spacing-sm) 0',
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
