import React, { useState, useEffect } from 'react';
import Mechanism from './components/Mechanism';
import MoonPhaseVisual from './components/MoonPhaseVisual';
import { calculatePositions } from './engine/astronomy';
import { Play, Pause, RotateCcw, Info, Compass, CalendarCheck } from 'lucide-react';

function App() {
  const [days, setDays] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setDays(prev => prev + (speed * 0.25));
      }, 16);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const positions = calculatePositions(days);
  const currentYear = Math.floor(days / 365.25);

  return (
    <div className="museum-frame flex flex-col items-center bg-background/90 text-ivory">
      <header className="text-center mb-10 md:mb-16 space-y-4 px-4 w-full">
        <h1 className="text-4xl sm:text-5xl md:text-7xl bronze-glow text-bronze-light font-bold drop-shadow-md tracking-tight">Fragmentos de Anticitera</h1>
        <div className="flex items-center justify-center gap-2 md:gap-4 text-bronze-gold italic text-sm sm:text-lg md:text-xl">
          <span className="h-[2px] w-12 sm:w-24 bg-gradient-to-r from-transparent via-bronze-gold to-transparent"></span>
          <p className="tracking-widest text-center">Primera Computadora del Mundo <br className="sm:hidden" />• 150 a.C.</p>
          <span className="h-[2px] w-24 bg-gradient-to-r from-transparent via-bronze-gold to-transparent"></span>
        </div>
      </header>

      <main className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 md:gap-16 relative">
        {/* Antikythera Core Visual */}
        <div className="sticky top-4 z-50 w-full max-w-[95vw] lg:max-w-[650px] bg-[#1a1510]/95 lg:bg-white/5 p-2 md:p-4 lg:p-8 rounded-3xl lg:rounded-full shadow-[0_15px_30px_rgba(0,0,0,0.6)] lg:shadow-[0_0_80px_rgba(220,179,107,0.15)] backdrop-blur-xl border border-bronze-mid/30 transition-all">
          <Mechanism positions={positions} />
        </div>

        {/* Dashboard (Museum Catalog Style) */}
        <aside className="parchment-panel w-full max-w-lg p-6 md:p-10 rounded-xl border-double border-[4px] md:border-[6px] border-bronze-mid/40 shadow-2xl bg-[#fdfaf3] text-[#2a1b10] z-10 relative">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8 border-b-2 border-bronze-dark/30 pb-4">
            <h2 className="text-2xl md:text-3xl flex items-center gap-3 font-bold text-bronze-dark font-serif text-center sm:text-left">
              <Compass className="text-bronze-mid w-6 h-6 md:w-8 md:h-8" />
              Panel de Control
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="metallic-button p-3 rounded-full shadow-lg text-ivory flex items-center gap-2 hover:scale-105 transition-transform"
                title={isPlaying ? "Pausar" : "Reproducir Automáticamente"}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                <span className="text-sm font-semibold hidden sm:inline">{isPlaying ? "Pausar" : "Auto"}</span>
              </button>
              <button
                onClick={() => setDays(0)}
                className="metallic-button p-3 rounded-full shadow-lg hover:scale-105 transition-transform"
                title="Reiniciar"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-10">
            {/* ETAPA SOLAR (ESTACIONES) */}
            <div className="bg-gradient-to-r from-[#f4ebd0] to-transparent p-6 border-l-8 border-bronze-mid rounded-r-lg shadow-sm">
              <div className="flex items-center gap-3 mb-2 text-bronze-dark/80">
                <CalendarCheck size={18} />
                <h3 className="text-sm uppercase tracking-[0.2em] font-semibold">Estación del Año</h3>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-4xl font-serif italic text-bronze-dark font-bold drop-shadow-sm">{positions.solarStage.name}</span>
                <div className="text-right text-bronze-dark">
                  <p className="text-xs uppercase opacity-70">Día de simulación</p>
                  <p className="text-xl font-bold bg-white/50 px-2 py-1 rounded inline-block mt-1 shadow-inner">{positions.solarStage.dayOfYear}</p>
                </div>
              </div>
              <div className="w-full h-3 bg-bronze-dark/20 mt-4 rounded-full overflow-hidden shadow-inner border border-bronze-dark/10">
                <div
                  className="h-full bg-gradient-to-r from-bronze-mid to-bronze-gold rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${positions.solarStage.progress * 100}%` }}
                ></div>
              </div>
            </div>

            {/* FASE LUNAR VISUAL */}
            <div className="bg-white/40 p-6 rounded-xl border border-bronze-mid/20 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Compass size={100} />
              </div>
              <h3 className="text-sm uppercase tracking-widest text-center mb-2 font-semibold text-bronze-dark relative z-10">Fase Lunar Actual</h3>
              <div className="relative z-10">
                <MoonPhaseVisual phase={positions.phase} />
              </div>
            </div>

            {/* CONTROL DE TIEMPO (MANIVELA) */}
            <div className="bg-[#f0e6d2] p-6 rounded-xl border border-bronze-mid/30 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm uppercase tracking-widest font-bold text-bronze-dark">Manivela Manual</label>
                <span className="text-xs font-bold bg-white/50 text-bronze-dark px-3 py-1 rounded shadow-inner border border-bronze-dark/20">Total Días: {Math.floor(days)}</span>
              </div>
              <p className="text-xs text-bronze-dark/70 mb-4 italic">Desliza para avanzar al futuro o retroceder al pasado.</p>
              <input
                type="range"
                min="0"
                max="1095"
                step="0.1"
                value={days}
                onChange={(e) => setDays(parseFloat(e.target.value))}
                className="w-full h-8 cursor-grab active:cursor-grabbing mb-4"
              />
              <div className="flex justify-center">
                <p className="text-center px-6 py-2 bg-bronze-dark text-ivory rounded-full text-lg font-serif italic shadow-md drop-shadow">
                  Año Ficticio: {Math.abs(150 - currentYear)} {150 - currentYear > 0 ? 'a.C.' : 'd.C.'}
                </p>
              </div>
            </div>

            {/* METONIC SECTION */}
            <div className="p-4 border-t-2 border-bronze-dark/20">
              <details className="cursor-pointer group">
                <summary className="text-sm font-bold uppercase tracking-widest text-bronze-dark flex items-center gap-2 select-none group-hover:text-bronze-mid transition-colors">
                  <Info size={18} /> ¿Qué es el ciclo de Metón?
                </summary>
                <div className="mt-4 p-4 bg-white/50 rounded-lg text-sm leading-relaxed text-bronze-dark/90 border border-bronze-mid/20 shadow-inner">
                  <p>Es un ciclo astronómico de 19 años tras el cual las fases de la luna caen en los mismos días del año solar. 19 años solares equivalen casi exactamente a 235 meses lunares. El mecanismo lo utiliza para mantener la precisión matemática perfecta.</p>
                  <div className="mt-3 flex items-center justify-between text-xs font-bold uppercase tracking-tighter bg-bronze-dark/10 p-2 rounded">
                    <span>Progreso del ciclo actual</span>
                    <span className="bg-white px-2 py-1 rounded text-bronze-dark shadow-sm">{Math.floor((days / (19 * 365.25)) * 100)}%</span>
                  </div>
                </div>
              </details>
            </div>
          </div>

          <footer className="mt-12 pt-6 border-t border-bronze-dark/20 text-xs italic text-center text-bronze-dark/60 tracking-widest uppercase">
            Diseño Restaurado por Paolo Dueñas
          </footer>
        </aside>
      </main>
    </div>
  );
}

export default App;
