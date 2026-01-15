import { useOrientation } from '../../hooks/useOrientation';

/**
 * 7-Segment LED Display Component
 * Creates real 7-segment digits like Velites/Rogue timers
 */

// 7-segment mapping for each digit
const segmentMap = {
    '0': [true, true, true, true, true, true, false],
    '1': [false, true, true, false, false, false, false],
    '2': [true, true, false, true, true, false, true],
    '3': [true, true, true, true, false, false, true],
    '4': [false, true, true, false, false, true, true],
    '5': [true, false, true, true, false, true, true],
    '6': [true, false, true, true, true, true, true],
    '7': [true, true, true, false, false, false, false],
    '8': [true, true, true, true, true, true, true],
    '9': [true, true, true, true, false, true, true]
};

function SevenSegmentDigit({ digit, size = 'md' }) {
    const segments = segmentMap[digit] || [false, false, false, false, false, false, false];

    const sizeConfig = {
        sm: { width: 35, height: 60, thickness: 5 },
        md: { width: 50, height: 85, thickness: 7 },
        lg: { width: 70, height: 120, thickness: 10 }
    };

    const config = sizeConfig[size] || sizeConfig.md;
    const { width, height, thickness } = config;

    const segmentStyle = (isActive) => ({
        position: 'absolute',
        background: isActive ? '#FF1a1a' : '#1a0000',
        boxShadow: isActive
            ? `0 0 ${thickness}px rgba(255, 26, 26, 0.8), 0 0 ${thickness * 2}px rgba(255, 26, 26, 0.4), inset 0 0 ${thickness / 2}px rgba(255, 100, 100, 0.3)`
            : 'none',
        transition: 'all 0.1s ease'
    });

    return (
        <div style={{
            position: 'relative',
            width: `${width}px`,
            height: `${height}px`,
            margin: '0 4px'
        }}>
            {/* Top horizontal (a) */}
            <div style={{
                ...segmentStyle(segments[0]),
                top: 0,
                left: `${thickness}px`,
                width: `${width - thickness * 2}px`,
                height: `${thickness}px`,
                clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)'
            }} />

            {/* Top right vertical (b) */}
            <div style={{
                ...segmentStyle(segments[1]),
                top: `${thickness}px`,
                right: 0,
                width: `${thickness}px`,
                height: `${height / 2 - thickness * 1.5}px`,
                clipPath: 'polygon(0% 10%, 50% 0%, 100% 10%, 100% 90%, 50% 100%, 0% 90%)'
            }} />

            {/* Bottom right vertical (c) */}
            <div style={{
                ...segmentStyle(segments[2]),
                bottom: `${thickness}px`,
                right: 0,
                width: `${thickness}px`,
                height: `${height / 2 - thickness * 1.5}px`,
                clipPath: 'polygon(0% 10%, 50% 0%, 100% 10%, 100% 90%, 50% 100%, 0% 90%)'
            }} />

            {/* Bottom horizontal (d) */}
            <div style={{
                ...segmentStyle(segments[3]),
                bottom: 0,
                left: `${thickness}px`,
                width: `${width - thickness * 2}px`,
                height: `${thickness}px`,
                clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)'
            }} />

            {/* Bottom left vertical (e) */}
            <div style={{
                ...segmentStyle(segments[4]),
                bottom: `${thickness}px`,
                left: 0,
                width: `${thickness}px`,
                height: `${height / 2 - thickness * 1.5}px`,
                clipPath: 'polygon(0% 10%, 50% 0%, 100% 10%, 100% 90%, 50% 100%, 0% 90%)'
            }} />

            {/* Top left vertical (f) */}
            <div style={{
                ...segmentStyle(segments[5]),
                top: `${thickness}px`,
                left: 0,
                width: `${thickness}px`,
                height: `${height / 2 - thickness * 1.5}px`,
                clipPath: 'polygon(0% 10%, 50% 0%, 100% 10%, 100% 90%, 50% 100%, 0% 90%)'
            }} />

            {/* Middle horizontal (g) */}
            <div style={{
                ...segmentStyle(segments[6]),
                top: `${height / 2 - thickness / 2}px`,
                left: `${thickness}px`,
                width: `${width - thickness * 2}px`,
                height: `${thickness}px`,
                clipPath: 'polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)'
            }} />
        </div>
    );
}

export default function SevenSegmentDisplay({ time, size = 'md', label = '' }) {
    const orientation = useOrientation();

    // Adjust size based on orientation
    const displaySize = orientation === 'landscape'
        ? (size === 'sm' ? 'md' : size === 'md' ? 'lg' : 'lg')
        : size;

    const characters = time.split('');

    return (
        <div style={{
            background: '#0a0a0a',
            borderRadius: '12px',
            padding: orientation === 'landscape' ? '24px' : '16px',
            border: '3px solid #1a1a1a',
            boxShadow: `
                inset 0 4px 12px rgba(0, 0, 0, 0.9),
                0 0 20px rgba(211, 47, 47, 0.15)
            `,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'fit-content',
            margin: '0 auto'
        }}>
            {label && (
                <div style={{
                    color: '#666',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    marginBottom: '12px',
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
                gap: '6px'
            }}>
                {characters.map((char, index) => {
                    if (char === ':') {
                        return (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: displaySize === 'lg' ? '16px' : displaySize === 'md' ? '12px' : '8px',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 4px'
                                }}
                            >
                                <div style={{
                                    width: displaySize === 'lg' ? '10px' : displaySize === 'md' ? '8px' : '6px',
                                    height: displaySize === 'lg' ? '10px' : displaySize === 'md' ? '8px' : '6px',
                                    borderRadius: '50%',
                                    background: '#FF1a1a',
                                    boxShadow: `
                                        0 0 8px rgba(255, 26, 26, 0.8),
                                        0 0 16px rgba(255, 26, 26, 0.4),
                                        inset 0 0 4px rgba(255, 100, 100, 0.5)
                                    `
                                }} />
                                <div style={{
                                    width: displaySize === 'lg' ? '10px' : displaySize === 'md' ? '8px' : '6px',
                                    height: displaySize === 'lg' ? '10px' : displaySize === 'md' ? '8px' : '6px',
                                    borderRadius: '50%',
                                    background: '#FF1a1a',
                                    boxShadow: `
                                        0 0 8px rgba(255, 26, 26, 0.8),
                                        0 0 16px rgba(255, 26, 26, 0.4),
                                        inset 0 0 4px rgba(255, 100, 100, 0.5)
                                    `
                                }} />
                            </div>
                        );
                    }

                    return <SevenSegmentDigit key={index} digit={char} size={displaySize} />;
                })}
            </div>
        </div>
    );
}
