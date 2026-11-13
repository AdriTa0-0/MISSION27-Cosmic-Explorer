// NASA/JPL Horizons: Sun azimuth/elevation seen from a lunar surface site. Pure parser, no invented data.
import { z } from "zod";

export const HORIZONS_API = "https://ssd.jpl.nasa.gov/api/horizons.api";
export const HORIZONS_DOCS = "https://ssd-api.jpl.nasa.gov/doc/horizons.html";
// Apollo 11 landing site (east longitude, latitude, km altitude) on body 301 = Moon. Fixed archived window.
export const HORIZONS_QUERY = { site: "Apollo 11 landing site (0.67° N, 23.47° E)", siteCoord: "23.47,0.67,0", start: "2024-01-20 00:00", stop: "2024-01-20 06:00", step: "1 h" };
export const horizonsUrl = () => {
  const q = new URLSearchParams({ format: "json", COMMAND: "'10'", OBJ_DATA: "'NO'", MAKE_EPHEM: "'YES'", EPHEM_TYPE: "'OBSERVER'",
    CENTER: "'coord@301'", COORD_TYPE: "'GEODETIC'", SITE_COORD: `'${HORIZONS_QUERY.siteCoord}'`,
    START_TIME: `'${HORIZONS_QUERY.start}'`, STOP_TIME: `'${HORIZONS_QUERY.stop}'`, STEP_SIZE: `'${HORIZONS_QUERY.step}'`, QUANTITIES: "'4'" });
  return `${HORIZONS_API}?${q.toString()}`;
};

export interface SunPoint { time: string; azimuth: number; elevation: number }
export interface SunSeries { observer: string; target: string; apiVersion: string; points: SunPoint[] }

const schema = z.object({ result: z.string(), signature: z.object({ source: z.string(), version: z.string() }).optional() });
const ROW = /^\s*(\d{4}-[A-Za-z]{3}-\d{2} \d{2}:\d{2})(?:\s+[*CNAmrsite]{1,3})?\s+(-?\d+\.\d+)\s+(-?\d+\.\d+)\s*$/;

export function parseHorizonsSun(json: unknown): SunSeries {
  const r = schema.parse(json);
  const a = r.result.indexOf("$$SOE"), b = r.result.indexOf("$$EOE");
  if (a < 0 || b < a) throw new Error(`Horizons returned no ephemeris table: ${r.result.slice(0, 160).replace(/\s+/g, " ")}`);
  if (!/Target body name:\s*Sun/i.test(r.result)) throw new Error("Horizons response target is not the Sun");
  const points: SunPoint[] = [];
  for (const line of r.result.slice(a + 5, b).split("\n")) {
    if (!line.trim()) continue;
    const m = line.match(ROW);
    if (!m) throw new Error(`Unexpected Horizons row: ${line.trim().slice(0, 80)}`);
    const az = +m[2], el = +m[3];
    if (!(az >= 0 && az <= 360 && el >= -90 && el <= 90)) throw new Error("Horizons azimuth/elevation out of range");
    points.push({ time: `${m[1]} UTC`, azimuth: az, elevation: el });
  }
  if (points.length === 0) throw new Error("Horizons ephemeris table was empty");
  return { observer: HORIZONS_QUERY.site, target: "Sun (body 10)", apiVersion: r.signature?.version ?? "unknown", points };
}

/** Simulated panel output (game calculation, not NASA data): cosine of angle between panel normal and Sun direction. */
export function simulatedPower(panelAz: number, panelEl: number, sunAz: number, sunEl: number): number {
  if (sunEl <= 0) return 0;
  const v = (az: number, el: number) => { const A = az * Math.PI / 180, E = el * Math.PI / 180; return [Math.cos(E) * Math.sin(A), Math.cos(E) * Math.cos(A), Math.sin(E)]; };
  const p = v(panelAz, panelEl), s = v(sunAz, sunEl);
  return Math.max(0, p[0] * s[0] + p[1] * s[1] + p[2] * s[2]);
}
export const SOLAR_PASS = Math.cos(10 * Math.PI / 180);
