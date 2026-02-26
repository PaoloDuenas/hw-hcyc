import React from 'react';

const MoonPhaseVisual = ({ phase }) => {
    // Normalize scale for the shading path
    const scaleX = Math.cos((phase * Math.PI) / 180);

    return (
        <div className="flex flex-col items-center gap-4 py-6 bg-black/40 rounded-lg border border-white/5 my-4">
            <div className="relative w-32 h-32">
                {/* Glow behind the moon */}
                <div className="absolute inset-0 rounded-full blur-2xl bg-white/10"></div>

                {/* The Moon */}
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    <defs>
                        <radialGradient id="moonSurface">
                            <stop offset="0%" stopColor="#fdf5e6" />
                            <stop offset="90%" stopColor="#e6d5b0" />
                            <stop offset="100%" stopColor="#d4c2a0" />
                        </radialGradient>

                        <filter id="moonCrater">
                            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
                            <feDiffuseLighting in="noise" lightingColor="#fdf5e6" surfaceScale="2">
                                <feDistantLight azimuth="45" elevation="45" />
                            </feDiffuseLighting>
                        </filter>
                    </defs>

                    {/* Base Sphere (Dark Side) */}
                    <circle cx="50" cy="50" r="48" fill="#111" />

                    {/* Left half - Light up when Waning (phase > 180) */}
                    <path
                        d="M 50 2 A 48 48 0 0 0 50 98"
                        fill="url(#moonSurface)"
                        opacity={phase % 360 > 180 ? 1 : 0}
                    />

                    {/* Right half - Light up when Waxing (phase <= 180) */}
                    <path
                        d="M 50 2 A 48 48 0 0 1 50 98"
                        fill="url(#moonSurface)"
                        opacity={phase % 360 <= 180 ? 1 : 0}
                    />

                    {/* The moving shadow terminator line (creates the curve) */}
                    {/* It covers the light side and reveals the dark side, or vice versa depending on phase */}
                    <path
                        d="M 50 2 A 48 48 0 0 1 50 98 A 48 48 0 0 1 50 2"
                        fill={phase % 360 > 90 && phase % 360 < 270 ? "url(#moonSurface)" : "#111"}
                        transform={`translate(50, 0) scale(${scaleX}, 1) translate(-50, 0)`}
                    />

                    {/* Texture Overlay (Craters) */}
                    <circle cx="50" cy="50" r="48" fill="url(#moonSurface)" opacity="0.1" filter="url(#moonCrater)" />

                    {/* Craters details */}
                    <circle cx="65" cy="40" r="6" fill="#000" opacity="0.1" />
                    <circle cx="40" cy="65" r="8" fill="#000" opacity="0.15" />
                    <circle cx="55" cy="55" r="4" fill="#000" opacity="0.1" />
                </svg>
            </div>

            <div className="text-center font-serif italic text-bronze-light">
                {phase % 360 < 10 && "Luna Nueva"}
                {phase % 360 >= 10 && phase % 360 < 80 && "Luna Creciente"}
                {phase % 360 >= 80 && phase % 360 < 100 && "Cuarto Creciente"}
                {phase % 360 >= 100 && phase % 360 < 170 && "Gibosa Creciente"}
                {phase % 360 >= 170 && phase % 360 < 190 && "Luna Llena"}
                {phase % 360 >= 190 && phase % 360 < 260 && "Gibosa Menguante"}
                {phase % 360 >= 260 && phase % 360 < 280 && "Cuarto Menguante"}
                {phase % 360 >= 280 && phase % 360 < 350 && "Luna Menguante"}
                {phase % 360 >= 350 && "Luna Nueva"}
            </div>
        </div>
    );
};

export default MoonPhaseVisual;
