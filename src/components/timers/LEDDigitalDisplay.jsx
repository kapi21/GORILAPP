import { useOrientation } from '../../hooks/useOrientation';

/**
 * LED-style 7-segment display digit component
 * Inspired by Rogue fitness timer displays
 */
export default function LEDDigitalDisplay({ time, size = 'md', label = '' }) {
    const orientation = useOrientation();

    // Size configurations
    const sizeConfig = {
        sm: {
            digitWidth: orientation === 'landscape' ? '60px' : '40px',
            digitHeight: orientation === 'landscape' ? '100px' : '70px',
            colonSize: orientation === 'landscape' ? '50px' : '35px',
            fontSize: orientation === 'landscape' ? '80px' : '60px',
            padding: 'var(--spacing-md)'
        },
        md: {
            digitWidth: orientation === 'landscape' ? '90px' : '60px',
            digitHeight: orientation === 'landscape' ? '150px' : '100px',
            colonSize: orientation === 'landscape' ? '70px' : '50px',
            fontSize: orientation === 'landscape' ? '120px' : '80px',
            padding: 'var(--spacing-lg)'
        },
        lg: {
            digitWidth: orientation === 'landscape' ? '120px' : '80px',
            digitHeight: orientation === 'landscape' ? '200px' : '140px',
            colonSize: orientation === 'landscape' ? '90px' : '65px',
            fontSize: orientation === 'landscape' ? '160px' : '110px',
            padding: 'var(--spacing-xl)'
        }
    };

    const config = sizeConfig[size] || sizeConfig.md;

    // Split time into individual characters
    const characters = time.split('');

    return (
        <div style={{
            background: '#0a0a0a',
            borderRadius: 'var(--radius-lg)',
            padding: config.padding,
            border: '3px solid #1a1a1a',
            boxShadow: `
                inset 0 4px 12px rgba(0, 0, 0, 0.9),
                0 0 30px rgba(211, 47, 47, 0.2),
                0 0 60px rgba(211, 47, 47, 0.1)
            `,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: orientation === 'landscape' ? '250px' : '180px'
        }}>
            {label && (
                <div style={{
                    color: '#666',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    marginBottom: 'var(--spacing-sm)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    fontFamily: 'Montserrat, sans-serif'
                }}>
                    {label}
                </div>
            )}

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: "'Orbitron', 'Courier New', monospace",
                fontWeight: 700
            }}>
                {characters.map((char, index) => {
                    if (char === ':') {
                        return (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    height: config.digitHeight
                                }}
                            >
                                <div style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: '#FF1a1a',
                                    boxShadow: `
                                        0 0 10px rgba(255, 26, 26, 0.8),
                                        0 0 20px rgba(255, 26, 26, 0.6),
                                        0 0 30px rgba(255, 26, 26, 0.4),
                                        inset 0 0 5px rgba(255, 100, 100, 0.5)
                                    `
                                }} />
                                <div style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: '#FF1a1a',
                                    boxShadow: `
                                        0 0 10px rgba(255, 26, 26, 0.8),
                                        0 0 20px rgba(255, 26, 26, 0.6),
                                        0 0 30px rgba(255, 26, 26, 0.4),
                                        inset 0 0 5px rgba(255, 100, 100, 0.5)
                                    `
                                }} />
                            </div>
                        );
                    }

                    return (
                        <div
                            key={index}
                            style={{
                                width: config.digitWidth,
                                height: config.digitHeight,
                                background: '#0d0d0d',
                                border: '2px solid #1a1a1a',
                                borderRadius: '6px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: config.fontSize,
                                color: '#FF1a1a',
                                fontWeight: 900,
                                textShadow: `
                                    0 0 5px rgba(255, 26, 26, 1),
                                    0 0 10px rgba(255, 26, 26, 0.8),
                                    0 0 20px rgba(255, 26, 26, 0.6),
                                    0 0 30px rgba(255, 26, 26, 0.4),
                                    0 0 40px rgba(255, 26, 26, 0.2)
                                `,
                                boxShadow: 'inset 0 2px 8px rgba(0, 0, 0, 0.8)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Subtle scanline effect */}
                            <div style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.1) 50%)',
                                backgroundSize: '100% 4px',
                                pointerEvents: 'none'
                            }} />

                            {char}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
