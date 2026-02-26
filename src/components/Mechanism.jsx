import React from 'react';
import { motion } from 'framer-motion';

const SunIcon = ({ color }) => (
    <g filter="url(#glow)">
        <circle r="12" fill={color} />
        {/* Sun Rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
            <line
                key={angle}
                x1="0" y1="-12" x2="0" y2="-18"
                stroke={color}
                strokeWidth="2"
                transform={`rotate(${angle})`}
            />
        ))}
    </g>
);

const MoonIcon = ({ phase }) => {
    // Simple visual moon sphere for the pointer
    return (
        <g filter="url(#glow)">
            <circle r="10" fill="#222" stroke="#e6e6e6" strokeWidth="1" />
            <path
                d="M 0 -10 A 10 10 0 0 1 0 10"
                fill="#e6e6e6"
                transform={`scale(${Math.cos((phase * Math.PI) / 180)}, 1)`}
            />
        </g>
    );
};

const OrnatePointer = ({ rotation, color, length, type = 'sun', phase = 0 }) => {
    return (
        <g transform={`rotate(${rotation}, 200, 200)`}>
            {/* Ornate Arm */}
            <path
                d={`M 197 200 L 199 ${200 - length} L 201 ${200 - length} L 203 200 Z`}
                fill={color}
                filter="url(#pointerShadow)"
            />
            {/* Ornate End */}
            <g transform={`translate(200, ${200 - length})`}>
                {type === 'sun' ? <SunIcon color={color} /> : <MoonIcon phase={phase} />}
            </g>
        </g>
    );
};

const Mechanism = ({ positions }) => {
    return (
        <div className="relative w-full aspect-square max-w-[650px] flex items-center justify-center p-2 md:p-8">
            <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)] md:drop-shadow-[0_45px_45px_rgba(0,0,0,0.8)]">
                <defs>
                    <filter id="metallic">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
                        <feSpecularLighting in="blur" surfaceScale="5" specularConstant="1" specularExponent="30" lightingColor="#white" result="specOut">
                            <fePointLight x="-5000" y="-10000" z="20000" />
                        </feSpecularLighting>
                        <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
                        <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litGraphic" />
                    </filter>

                    <filter id="pointerShadow">
                        <feDropShadow dx="3" dy="3" stdDeviation="3" floodOpacity="0.8" />
                    </filter>

                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    <radialGradient id="bronzeHub">
                        <stop offset="0%" stopColor="#f2d08a" />
                        <stop offset="60%" stopColor="#8c6a4a" />
                        <stop offset="100%" stopColor="#3d2b1f" />
                    </radialGradient>
                </defs>

                {/* Outer Zodiac Ring */}
                <circle cx="200" cy="200" r="185" fill="#15100a" stroke="#8c6a4a" strokeWidth="15" filter="url(#metallic)" />

                {/* ZODIAC INSCRIPTIONS - Fixing the 'line' issue by ensuring stroke="none" */}
                <path id="zodiacPath" d="M 200 40 A 160 160 0 1 1 200 360 A 160 160 0 1 1 200 40" fill="none" stroke="none" />
                <text fontSize="11" fontFamily="Cinzel" fill="#d4af37" fontWeight="bold">
                    <textPath href="#zodiacPath" startOffset="3%">ΚΡΙΟΣ (Aries)</textPath>
                    <textPath href="#zodiacPath" startOffset="28%">ΤΑΥΡΟΣ (Taurus)</textPath>
                    <textPath href="#zodiacPath" startOffset="53%">ΔΙΔΥΜΟΙ (Gemini)</textPath>
                    <textPath href="#zodiacPath" startOffset="78%">ΚΑΡΚΙΝΟΣ (Cancer)</textPath>
                </text>

                {/* Inner Mechanics */}
                <g opacity="0.3" filter="url(#metallic)">
                    <motion.circle cx="200" cy="200" r="90" fill="none" stroke="#8c6a4a" strokeWidth="18" strokeDasharray="3,4" animate={{ rotate: positions.sun }} />
                    <motion.circle cx="200" cy="110" r="55" fill="none" stroke="#43b3ae" strokeWidth="12" strokeDasharray="2,3" animate={{ rotate: -positions.moon }} />
                </g>

                {/* CENTRAL BRAZEN HUB */}
                <circle cx="200" cy="200" r="30" fill="url(#bronzeHub)" stroke="#1a110a" strokeWidth="2" filter="url(#metallic)" />

                {/* ORNATE POINTERS */}
                <OrnatePointer rotation={positions.sun} color="#dcb36b" length={165} type="sun" />
                <OrnatePointer rotation={positions.moon} color="#faf3e0" length={130} type="moon" phase={positions.phase} />

                {/* Center Cap */}
                <circle cx="200" cy="200" r="10" fill="#2a1b10" stroke="#000" />
                <circle cx="200" cy="200" r="4" fill="#d4af37" />
            </svg>
        </div>
    );
};

export default Mechanism;
