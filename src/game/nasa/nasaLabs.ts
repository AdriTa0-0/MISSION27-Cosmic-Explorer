// Pure parsers for NASA OSDR OSD-766 and NASA RadLab responses. No invented data.
import { z } from "zod";

export const OSDR_META_URL = "https://osdr.nasa.gov/osdr/data/osd/meta/766";
export const OSDR_FILES_URL = "https://osdr.nasa.gov/osdr/data/osd/files/766";
export const OSDR_STUDY_PAGE = "https://osdr.nasa.gov/bio/repo/data/studies/OSD-766";
export const RADLAB_API = "https://visualization.osdr.nasa.gov/radlab/api/";
export const RADLAB_DOCS = "https://visualization.osdr.nasa.gov/radlab/gui/data-api/";
export const RADLAB_UNIT_DOC = "https://visualization.osdr.nasa.gov/radlab/gui/knowledgebase/absorbed_dose_rate";
// Short, fixed archived window keeps the download tiny (72 hourly rows).
export const RADLAB_QUERY = { instrument: "CRaTER-D1D2", start: "2023-01-01", end: "2023-01-04" };
export const radlabUrl = () =>
  `${RADLAB_API}?instrument=${RADLAB_QUERY.instrument}&timestamp%3E=${RADLAB_QUERY.start}&timestamp%3C${RADLAB_QUERY.end}&absorbed_dose_rate&format=json`;

export interface Envelope<T> { source: string; sourceUrls: { label: string; url: string }[]; retrievedAt: string; observedRange: string; cached: boolean; error?: string | undefined; data: T | null }

export interface PlantStudy {
  id: string; title: string; description: string; submissionDate: string; releaseDate: string;
  missionDates: string | null; factors: string[];
  treatments: { label: string; red: number; blue: number; name: string | null }[];
  observations: string[]; fileCount: number; fileCategories: Record<string, number>;
}

const metaSchema = z.object({ study: z.object({ "OSD-766": z.object({ studies: z.array(z.object({
  identifier: z.string().optional(), title: z.string(), description: z.string(),
  submissionDate: z.string().optional().default(""), publicReleaseDate: z.string().optional().default(""),
  factors: z.array(z.object({ factorName: z.string() })).default([]),
})).min(1) }) }) });
const filesSchema = z.object({ studies: z.object({ "OSD-766": z.object({ file_count: z.number(), study_files: z.array(z.object({ category: z.string() })) }) }) });

export function parseOsdr(meta: unknown, files: unknown): PlantStudy {
  const s = metaSchema.parse(meta).study["OSD-766"].studies[0];
  const f = filesSchema.parse(files).studies["OSD-766"];
  const desc = s.description.replace(/\s+/g, " ").trim();
  const treatments: PlantStudy["treatments"] = [];
  for (const m of desc.matchAll(/(\d{1,3})%R:(\d{1,3})%B(?:\s+as the\s+[“"]([^”"]+)[”"])?/g)) {
    treatments.push({ label: `${m[1]}:${m[2]} red:blue`, red: +m[1], blue: +m[2], name: m[3] ?? null });
  }
  if (treatments.length === 0) throw new Error("NASA study record did not list the red:blue lighting treatments");
  const dates = desc.match(/between\s+([\d/]+)\s*-\s*([\d/]+)\s*\((\d+) days\)/);
  const sentences = desc.split(/(?<=\.)\s+/);
  const observations = sentences.filter((x) => /fruit|stress/i.test(x) && !/were planned|were also saved/i.test(x)).slice(0, 3);
  const cats: Record<string, number> = {};
  for (const x of f.study_files) cats[x.category] = (cats[x.category] ?? 0) + 1;
  return { id: "OSD-766", title: s.title, description: desc, submissionDate: s.submissionDate, releaseDate: s.publicReleaseDate,
    missionDates: dates ? `${dates[1]} – ${dates[2]} (${dates[3]} days)` : null,
    factors: s.factors.map((x) => x.factorName), treatments, observations, fileCount: f.file_count, fileCategories: cats };
}

export interface RadSeries { instrument: string; instrumentId: string; spacecraft: string; unit: string; points: { t: string; v: number }[] }

const radSchema = z.object({ columns: z.array(z.string()), data: z.array(z.array(z.union([z.string(), z.number(), z.null()]))) });
export function parseRadlab(json: unknown): RadSeries {
  const r = radSchema.parse(json);
  const ti = r.columns.indexOf("timestamp"), vi = r.columns.indexOf("absorbed_dose_rate"), ii = r.columns.indexOf("instrument_id"), ni = r.columns.indexOf("instrument");
  if (ti < 0 || vi < 0) throw new Error("RadLab response is missing timestamp or absorbed_dose_rate");
  const points = r.data.filter((row) => typeof row[vi] === "number" && typeof row[ti] === "string").map((row) => ({ t: row[ti] as string, v: row[vi] as number }));
  if (points.length === 0) throw new Error("RadLab returned no absorbed dose rate readings for this range");
  return { instrument: String(r.data[0][ni] ?? "CRaTER"), instrumentId: String(r.data[0][ii] ?? RADLAB_QUERY.instrument),
    spacecraft: "Lunar Reconnaissance Orbiter (LRO), Moon orbit", unit: "µGy/hour", points };
}
