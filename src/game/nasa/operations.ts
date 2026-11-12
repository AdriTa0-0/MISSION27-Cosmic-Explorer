import { terrainHeight } from "./terrain";
import evaRecord from "./eva-record.json";

// NASA CCMC DONKI event 2024-05-11T04:07:00-SEP-001 and linked X5.8 flare.
export const DONKI_STORM = {
  id: "2024-05-11T04:07:00-SEP-001",
  instrument: "STEREO-A",
  flare: "X5.8",
  peakUtc: "01:23 UTC",
  detectedUtc: "04:07 UTC",
  url: "https://kauai.ccmc.gsfc.nasa.gov/DONKI/view/SEP/30717/1",
};

// NOAA SWPC 0511RSGA, report 132, 11 May 2024. GOES is a separate observation.
export const PROTON_PEAK_PFU = 116;
export const STORM_SCALE = "S2";
export const STORM_SAFETY_LOSS = (0.06 * PROTON_PEAK_PFU) / 100;

export const SOLAR_BEARING = (70 * Math.PI) / 180;
export function sunElevation(missionMinutes: number) {
  // A compressed, illustrative polar lighting window.
  return 3.5 + 2.5 * Math.cos((missionMinutes / (27 * 60)) * Math.PI * 2);
}

const SOLAR_HORIZON = (() => {
  let horizon = 0;
  for (let d = 5; d < 720; d += 4) {
    const x = 22 + d * Math.sin(SOLAR_BEARING);
    const z = -10 - d * Math.cos(SOLAR_BEARING);
    horizon = Math.max(
      horizon,
      (Math.atan2(terrainHeight(x, z) - 2, d) * 180) / Math.PI,
    );
  }
  return horizon;
})();

export function solarTelemetry(missionMinutes: number) {
  const elevation = sunElevation(missionMinutes);
  const directSun = elevation > SOLAR_HORIZON;
  return {
    elevation,
    horizon: SOLAR_HORIZON,
    directSun,
    budget: directSun ? 10 : 8,
  };
}

// NASA ISS Water Recovery System / Brine Processor demonstration.
export const WATER_RECOVERY = 0.98;

// NASA OSDR study OSD-269, Veggie red romaine lettuce protocol.
export const VEGGIE_LIGHT = 200;
export const VEGGIE_LED_RATIO = [12, 3, 1] as const;

// NASA EVA dataset record 32, Apollo 17's first surface EVA.
export const APOLLO_EVA_RECORD = evaRecord;
const [evaHours, evaMinutes] = APOLLO_EVA_RECORD.duration
  .split(":")
  .map(Number);
export const APOLLO_EVA_MINUTES = evaHours * 60 + evaMinutes;

// LEND study, NASA NTRS 20140005994. Published suppression ranges are preserved.
export const LEND_TARGETS = [
  { name: "Shoemaker", low: 5.5, high: 6.3 },
  { name: "Cabeus", low: 14.4, high: 14.9 },
];
export const LEND_PRIORITY = LEND_TARGETS.reduce((best, site) =>
  site.low > best.low ? site : best,
);
