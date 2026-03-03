import React from 'react';

// ─── Phase name ───────────────────────────────────────────────────────────────
function getPhaseName(t) {
  if (t < 15 || t >= 345)  return 'Luna Nueva';
  if (t < 80)   return 'Luna Creciente';
  if (t < 100)  return 'Cuarto Creciente';
  if (t < 165)  return 'Gibosa Creciente';
  if (t < 195)  return 'Luna Llena';
  if (t < 260)  return 'Gibosa Menguante';
  if (t < 280)  return 'Cuarto Menguante';
  return 'Luna Menguante';
}

// ─── Phase mask parameters ────────────────────────────────────────────────────
// Returns the three values needed to build the SVG <mask> for the lit region.
// Uses a rectangle (base half) + ellipse (terminator) approach:
//   - baseX: x-start of the lit half (50=right for waxing, 0=left for waning)
//   - rx: terminator ellipse half-width (r·|cos t|, 0 at quarters, r at new/full)
//   - terminatorFill: 'white' adds area (gibbous), 'black' subtracts (crescent)
// No structural discontinuities: rx passes through 0 smoothly at t=90°/270°,
// and the baseX flip at t=180° is invisible because rx=r → mask is all-white.
function getPhaseInfo(t) {
  const T  = ((t % 360) + 360) % 360;
  const rx = Math.abs(Math.cos((T * Math.PI) / 180)) * 46;
  const baseX          = T <= 180 ? 50 : 0;
  const terminatorFill = (T > 90 && T < 270) ? 'white' : 'black';
  return { rx, baseX, terminatorFill };
}

// ─── Component ────────────────────────────────────────────────────────────────
const MoonPhaseVisual = ({ phase }) => {
  const t    = ((phase % 360) + 360) % 360;
  const name = getPhaseName(t);
  const illum = Math.round(((1 - Math.cos(t * Math.PI / 180)) / 2) * 100);
  const { rx, baseX, terminatorFill } = getPhaseInfo(t);
  const isNewMoon = illum < 3;

  return (
    <div className="flex flex-col items-center gap-2 py-2">

      {/* ── Moon disc ─────────────────────────────────────────── */}
      <div className="relative flex items-center justify-center">

        {/* Glow halo — grows with illumination */}
        <div style={{
          position: 'absolute',
          width:  '160px',
          height: '160px',
          borderRadius: '50%',
          background: `radial-gradient(circle,
            rgba(220,210,160,${illum * 0.0025}) 20%,
            transparent 70%)`,
          filter: 'blur(18px)',
          pointerEvents: 'none',
        }} />

        <svg
          viewBox="0 0 100 100"
          width="124"
          height="124"
          style={{ display: 'block', overflow: 'visible' }}
        >
          <defs>
            {/* ── Hard clip: nothing leaves the moon disc ── */}
            <clipPath id="mc">
              <circle cx="50" cy="50" r="46" />
            </clipPath>

            {/* ── Lit surface: strong off-centre radial → 3D sphere ──
                The focal point is at upper-left (28%,20%) to simulate
                sunlight hitting from that direction.               */}
            <radialGradient id="litSphere" cx="34%" cy="28%" r="72%" fx="26%" fy="19%">
              <stop offset="0%"    stopColor="#ffffff" />
              <stop offset="12%"   stopColor="#f6f1e4" />
              <stop offset="38%"   stopColor="#d8c898" />
              <stop offset="65%"   stopColor="#a88848" />
              <stop offset="85%"   stopColor="#785828" />
              <stop offset="100%"  stopColor="#3e2c10" />
            </radialGradient>

            {/* ── Dark (night) side: deep with faint earthshine ── */}
            <radialGradient id="nightSide" cx="60%" cy="55%" r="65%">
              <stop offset="0%"   stopColor="#201830" />
              <stop offset="55%"  stopColor="#100c1c" />
              <stop offset="100%" stopColor="#050308" />
            </radialGradient>

            {/* ── Limb darkening: deepens the sphere's outer edge ── */}
            <radialGradient id="limbDark" cx="50%" cy="50%" r="50%">
              <stop offset="50%"  stopColor="rgba(0,0,0,0)"    />
              <stop offset="78%"  stopColor="rgba(0,0,0,0.28)" />
              <stop offset="94%"  stopColor="rgba(0,0,0,0.65)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0.82)" />
            </radialGradient>

            {/* ── Surface texture: fractal noise, properly clipped ── */}
            <filter id="moonTex" x="-2%" y="-2%" width="104%" height="104%">
              <feTurbulence type="fractalNoise"
                baseFrequency="0.50" numOctaves="5" seed="17" result="n" />
              <feColorMatrix type="saturate" values="0" in="n" result="gray" />
              <feComponentTransfer in="gray" result="faint">
                <feFuncA type="linear" slope="0.10" />
              </feComponentTransfer>
              <feComposite in="faint" in2="SourceAlpha" operator="in" result="clipped" />
              <feBlend in="SourceGraphic" in2="clipped" mode="overlay" />
            </filter>

            {/* ── Phase mask: 3-shape composition ────────────────────
                1. Black circle: base (everything dark)
                2. White rect: the lit half-plane (right=waxing, left=waning)
                3. Terminator ellipse: white adds area (gibbous), black subtracts (crescent)
                rx passes through 0 at quarters — no structural discontinuities. */}
            <mask id="phaseMask">
              <circle cx="50" cy="50" r="46" fill="black" />
              <rect x={baseX} y="0" width="50" height="100" fill="white" />
              <ellipse cx="50" cy="50" rx={rx} ry="46" fill={terminatorFill} />
            </mask>
          </defs>

          {/* ─── All content hard-clipped to the moon circle ─── */}
          <g clipPath="url(#mc)">

            {/* 1 ─ Night side base */}
            <circle cx="50" cy="50" r="46" fill="url(#nightSide)" />

            {/* 2 ─ Lit sphere with phase mask */}
            <circle cx="50" cy="50" r="46"
              fill="url(#litSphere)"
              mask="url(#phaseMask)" />

            {/* 3 ─ Surface texture on lit region */}
            <circle cx="50" cy="50" r="46"
              fill="url(#litSphere)"
              filter="url(#moonTex)"
              mask="url(#phaseMask)"
              opacity="0.55" />

            {/* 4 ─ New moon: faint earthshine only */}
            {isNewMoon && (
              <circle cx="50" cy="50" r="46"
                fill="rgba(50,65,110,0.14)" />
            )}

            {/* 5 ─ Maria (dark volcanic plains) on lit side */}
            {!isNewMoon && (
              <g opacity="0.75" style={{ mixBlendMode: 'multiply' }}
                 mask="url(#phaseMask)">
                {/* Mare Imbrium */}
                <ellipse cx="38" cy="39" rx="10" ry="7"
                  fill="rgba(0,0,0,0.22)" transform="rotate(-22,38,39)" />
                {/* Mare Serenitatis */}
                <ellipse cx="56" cy="41" rx="6" ry="5.5"
                  fill="rgba(0,0,0,0.18)" transform="rotate(8,56,41)" />
                {/* Mare Tranquillitatis */}
                <ellipse cx="60" cy="53" rx="7" ry="5"
                  fill="rgba(0,0,0,0.15)" transform="rotate(-6,60,53)" />
                {/* Mare Crisium */}
                <ellipse cx="68" cy="39" rx="4" ry="3"
                  fill="rgba(0,0,0,0.20)" transform="rotate(-18,68,39)" />
                {/* Oceanus Procellarum */}
                <ellipse cx="34" cy="51" rx="9" ry="13"
                  fill="rgba(0,0,0,0.13)" transform="rotate(4,34,51)" />
              </g>
            )}

            {/* 6 ─ Craters with bright rim */}
            {!isNewMoon && (
              <g mask="url(#phaseMask)">
              {[
                { cx: 64, cy: 35, r: 4.5 },
                { cx: 37, cy: 64, r: 6.0 },
                { cx: 55, cy: 57, r: 3.0 },
                { cx: 42, cy: 29, r: 3.5 },
                { cx: 71, cy: 63, r: 2.5 },
                { cx: 29, cy: 47, r: 3.0 },
                { cx: 51, cy: 77, r: 3.5 },
                { cx: 47, cy: 21, r: 2.2 },
              ].map((c, i) => (
                <g key={i}>
                  {/* Shadow floor */}
                  <circle cx={c.cx} cy={c.cy} r={c.r}
                    fill="rgba(0,0,0,0.28)" />
                  {/* Bright far rim (lit by sun) */}
                  <circle cx={c.cx} cy={c.cy} r={c.r}
                    fill="none"
                    stroke="rgba(240,230,190,0.30)"
                    strokeWidth="0.8" />
                  {/* Near rim shadow */}
                  <circle cx={c.cx + c.r * 0.2} cy={c.cy + c.r * 0.2} r={c.r * 0.5}
                    fill="rgba(0,0,0,0.18)" />
                </g>
              ))}
              </g>
            )}

            {/* 7 ─ Limb darkening — the essential 3D edge effect */}
            <circle cx="50" cy="50" r="46" fill="url(#limbDark)" />

            {/* 8 ─ Specular glare on lit side (simulates sun reflection) */}
            {illum > 10 && (
              <ellipse cx="33" cy="29" rx="9" ry="6"
                fill="rgba(255,255,240,0.11)"
                transform="rotate(-30,33,29)" />
            )}
          </g>

          {/* Moon edge ring — just outside clip but visually crisp */}
          <circle cx="50" cy="50" r="46"
            fill="none"
            stroke="rgba(140,128,100,0.32)"
            strokeWidth="0.9" />
        </svg>
      </div>

      {/* ── Phase info ────────────────────────────────────────── */}
      <div className="text-center space-y-0.5">
        <p className="font-serif italic text-sm font-bold text-bronze-light leading-tight">{name}</p>
        <p className="text-[9px] uppercase tracking-[0.18em] text-bronze-light/45">{illum}% iluminada</p>
      </div>
    </div>
  );
};

export default MoonPhaseVisual;
