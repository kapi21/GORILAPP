import { useOrientation } from '../../hooks/useOrientation';

export default function DigitalDisplay({ time, size = 'md', label = '' }) {
    const orientation = useOrientation();

    // Size configurations
    const sizeConfig = {
        sm: {
            fontSize: orientation === 'landscape' ? '3rem' : '2rem',
            padding: 'var(--spacing-md)',
            letterSpacing: '0.1em'
        },
        md: {
            fontSize: orientation === 'landscape' ? '5rem' : '3.5rem',
            padding: 'var(--spacing-lg)',
            letterSpacing: '0.15em'
        },
        lg: {
            fontSize: orientation === 'landscape' ? '7rem' : '5rem',
            padding: 'var(--spacing-xl)',
            letterSpacing: '0.2em'
        }
    };

    const config = sizeConfig[size] || sizeConfig.md;

    return (
        <div style={{
            background: '#000000',
            borderRadius: 'var(--radius-lg)',
            padding: config.padding,
            border: '2px solid #1A1A1A',
            boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(211, 47, 47, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: orientation === 'landscape' ? '200px' : '150px'
        }}>
            {label && (
                <div style={{
                    color: '#D32F2F',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    marginBottom: 'var(--spacing-sm)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    opacity: 0.8
                }}>
                    {label}
                </div>
            )}

            <div style={{
                fontFamily: "'Courier New', 'Courier', monospace",
                fontSize: config.fontSize,
                fontWeight: 700,
                color: '#FF3333',
                textShadow: `
                    0 0 10px rgba(255, 51, 51, 0.8),
                    0 0 20px rgba(255, 51, 51, 0.6),
                    0 0 30px rgba(255, 51, 51, 0.4),
                    0 0 40px rgba(255, 51, 51, 0.2)
                `,
                letterSpacing: config.letterSpacing,
                lineHeight: 1,
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
            }}>
                {time}
            </div>
        </div>
    );
}
