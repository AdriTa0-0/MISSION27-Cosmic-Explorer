import { describe, expect, it } from "vitest";
import meta from "./__fixtures__/osd766-meta.sample.json";
import files from "./__fixtures__/osd766-files.sample.json";
import rad from "./__fixtures__/radlab.sample.json";
import { parseOsdr, parseRadlab } from "./nasaLabs";

describe("NASA lab parsers (trimmed real responses)", () => {
  it("reads the VEG-05 90:10 and 50:50 lighting treatments from OSD-766", () => {
    const s = parseOsdr(meta, files);
    expect(s.treatments.map((t) => t.label)).toEqual(["90:10 red:blue", "50:50 red:blue"]);
    expect(s.missionDates).toBe("12/14/2022 – 3/24/2023 (101 days)");
    expect(s.fileCount).toBe(571);
  });
  it("refuses a study record without lighting treatments instead of inventing them", () => {
    const bad = { study: { "OSD-766": { studies: [{ title: "x", description: "no lights here", factors: [] }] } } };
    expect(() => parseOsdr(bad, files)).toThrow(/lighting treatments/);
  });
  it("reads RadLab timestamps and absorbed dose rates", () => {
    const r = parseRadlab(rad);
    expect(r.points[0]).toEqual({ t: "2023-01-01T00:59:59", v: 8.003333333333334 });
    expect(r.instrumentId).toBe("CRaTER-D1D2");
  });
  it("rejects a RadLab reply without readings", () => {
    expect(() => parseRadlab({ columns: ["timestamp", "absorbed_dose_rate"], data: [] })).toThrow(/no absorbed dose/);
  });
});
