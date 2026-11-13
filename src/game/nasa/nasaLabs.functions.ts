import { createServerFn } from "@tanstack/react-start";
import { HORIZONS_DOCS, HORIZONS_QUERY, horizonsUrl, parseHorizonsSun, type SunSeries } from "./horizons";
import { OSDR_FILES_URL, OSDR_META_URL, OSDR_STUDY_PAGE, RADLAB_DOCS, RADLAB_QUERY, RADLAB_UNIT_DOC, parseOsdr, parseRadlab, radlabUrl, type Envelope, type PlantStudy, type RadSeries } from "./nasaLabs";

const TTL = 6 * 3600_000;
const cache: Record<string, { at: number; env: Envelope<unknown> }> = {};

async function getJson(url: string) {
  const res = await fetch(url, { signal: AbortSignal.timeout(25_000), headers: { accept: "application/json" } });
  const text = await res.text();
  if (!res.ok) throw new Error(`NASA returned HTTP ${res.status}: ${text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 160)}`);
  try { return JSON.parse(text); } catch { throw new Error(`NASA response was not JSON: ${text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 160)}`); }
}

async function cached<T>(key: string, base: Omit<Envelope<T>, "retrievedAt" | "cached" | "data" | "error">, load: () => Promise<T>): Promise<Envelope<T>> {
  const hit = cache[key];
  if (hit && Date.now() - hit.at < TTL) return hit.env as Envelope<T>;
  try {
    const env: Envelope<T> = { ...base, retrievedAt: new Date().toISOString(), cached: false, data: await load() };
    cache[key] = { at: Date.now(), env };
    return env;
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    console.error(`[nasa ${key}]`, error);
    if (hit) return { ...(hit.env as Envelope<T>), cached: true, error };
    return { ...base, retrievedAt: "", cached: false, error, data: null };
  }
}

export const getPlantStudy = createServerFn({ method: "GET" }).handler(() =>
  cached<PlantStudy>("osdr766", { source: "NASA Open Science Data Repository (OSDR) · OSD-766",
    sourceUrls: [{ label: "OSD-766 study page", url: OSDR_STUDY_PAGE }, { label: "Metadata API", url: OSDR_META_URL }, { label: "Files API", url: OSDR_FILES_URL }],
    observedRange: "ISS VEG-05 flight experiment" },
    async () => { const [m, f] = await Promise.all([getJson(OSDR_META_URL), getJson(OSDR_FILES_URL)]); return parseOsdr(m, f); }));

export const getRadlabSeries = createServerFn({ method: "GET" }).handler(() =>
  cached<RadSeries>("radlab", { source: "NASA OSDR RadLab data API",
    sourceUrls: [{ label: "RadLab API request", url: radlabUrl() }, { label: "API documentation", url: RADLAB_DOCS }, { label: "Dose rate unit", url: RADLAB_UNIT_DOC }],
    observedRange: `${RADLAB_QUERY.start} to ${RADLAB_QUERY.end} (UTC, end exclusive)` },
    async () => parseRadlab(await getJson(radlabUrl()))));

export const getSunFromMoon = createServerFn({ method: "GET" }).handler(() =>
  cached<SunSeries>("horizons-sun", { source: "NASA/JPL Horizons API · Sun seen from the Moon",
    sourceUrls: [{ label: "Horizons API request", url: horizonsUrl() }, { label: "API documentation", url: HORIZONS_DOCS }, { label: "Horizons system", url: "https://ssd.jpl.nasa.gov/horizons/" }],
    observedRange: `${HORIZONS_QUERY.start} to ${HORIZONS_QUERY.stop} UTC, every ${HORIZONS_QUERY.step}` },
    async () => parseHorizonsSun(await getJson(horizonsUrl()))));
