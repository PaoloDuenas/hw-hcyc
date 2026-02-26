/**
 * Antikythera Astronomical Engine
 * Updated with Solar Stages and Localization
 */

export const CYCLES = {
  SOLAR_YEAR: 365.24219,
  LUNAR_MONTH: 29.53059,
  METONIC_YEARS: 19,
  METONIC_MONTHS: 235,
  SAROS_MONTHS: 223,
  CALLIPPIC_YEARS: 76,
  EXELIGMOS_MONTHS: 669,
};

export const SEASONS = [
  { name: "Primavera", start: 80 }, // Spring Equinox
  { name: "Verano", start: 172 },    // Summer Solstice
  { name: "Otoño", start: 264 },      // Autumn Equinox
  { name: "Invierno", start: 355 }    // Winter Solstice
];

export function getSolarStage(days) {
  const dayOfYear = days % 365.25;
  let currentSeason = SEASONS[3]; // Default to Winter
  
  for (let i = 0; i < SEASONS.length; i++) {
    if (dayOfYear >= SEASONS[i].start) {
      currentSeason = SEASONS[i];
    } else {
      break;
    }
  }

  // Calculate progress within season
  const nextSeasonIndex = (SEASONS.indexOf(currentSeason) + 1) % 4;
  const nextStart = SEASONS[nextSeasonIndex].start;
  const progress = ((dayOfYear - currentSeason.start + 365.25) % 365.25) / 91.25; // Roughly 91 days per season

  return {
    name: currentSeason.name,
    progress: Math.min(progress, 1),
    dayOfYear: dayOfYear.toFixed(0)
  };
}

export function calculatePositions(days) {
  const sunRotation = (days / CYCLES.SOLAR_YEAR) * 360;
  const siderealMoonRotation = (days / 27.32166) * 360;
  const lunarPhase = (days / CYCLES.LUNAR_MONTH) * 360;
  
  const totalLunations = days / CYCLES.LUNAR_MONTH;
  const metonicProgress = totalLunations / CYCLES.METONIC_MONTHS;
  const metonicRotation = (metonicProgress * 5 * 360);
  
  const sarosProgress = totalLunations / CYCLES.SAROS_MONTHS;
  const sarosRotation = (sarosProgress * 3 * 360);

  return {
    sun: sunRotation % 360,
    moon: siderealMoonRotation % 360,
    phase: lunarPhase % 360,
    metonic: metonicRotation,
    saros: sarosRotation,
    days: days,
    solarStage: getSolarStage(days)
  };
}
