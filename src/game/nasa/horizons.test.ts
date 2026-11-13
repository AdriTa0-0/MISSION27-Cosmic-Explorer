import { describe, it, expect } from "vitest";
import fixture from "./__fixtures__/horizons-sun-from-moon.json";
import { parseHorizonsSun, simulatedPower, SOLAR_PASS, horizonsUrl } from "./horizons";
import { TRAINING_STATIONS } from "../three/TrainingWorld";
import { MAX_MISSION_XP } from "../store";

describe("NASA Horizons solar training", () => {
  it("parses the real Horizons Sun table", () => {
    const s = parseHorizonsSun(fixture);
    expect(s.points).toHaveLength(7);
    expect(s.points[0]).toEqual({ time: "2024-Jan-20 00:00 UTC", azimuth: 92.576965, elevation: 40.542323 });
  });
  it("rejects responses without an ephemeris table", () => {
    expect(() => parseHorizonsSun({ result: "No ephemeris for target" })).toThrow();
    expect(() => parseHorizonsSun({ nope: 1 })).toThrow();
  });
  it("requests the Sun from a lunar surface site", () => {
    const u = decodeURIComponent(horizonsUrl());
    expect(u).toContain("COMMAND='10'"); expect(u).toContain("CENTER='coord@301'"); expect(u).toContain("QUANTITIES='4'");
  });
  it("gives full simulated power facing the Sun and passes only within ~10 degrees", () => {
    expect(simulatedPower(92.6, 40.5, 92.6, 40.5)).toBeCloseTo(1);
    expect(simulatedPower(92.6, 45, 92.6, 40.5)).toBeGreaterThanOrEqual(SOLAR_PASS);
    expect(simulatedPower(272, 40, 92.6, 40.5)).toBeLessThan(SOLAR_PASS);
    expect(simulatedPower(0, 0, 0, -5)).toBe(0);
  });
  it("exists only in Earth Training and keeps 800 XP", () => {
    expect(TRAINING_STATIONS.map((t) => t.kind)).toContain("solar");
    expect(MAX_MISSION_XP).toBe(800);
  });
});
