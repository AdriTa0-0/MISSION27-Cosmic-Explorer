import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getSunFromMoon } from "../nasa/nasaLabs.functions";
import { SOLAR_PASS, simulatedPower, type SunSeries } from "../nasa/horizons";
import { useNasa, SourceFooter } from "./NasaLabCards";
import { GameButton } from "./Button";
import { audio } from "../audio";

export function SolarGame({ done }: { done: (r: Record<string, unknown>) => void }) {
  const fn = useServerFn(getSunFromMoon);
  const env = useNasa<SunSeries>("nasa-horizons-sun", () => fn());
  const [idx, setIdx] = useState(0);
  const [az, setAz] = useState(180);
  const [el, setEl] = useState(10);
  const [msg, setMsg] = useState("");
  useEffect(() => setMsg(""), [az, el, idx]);
  if (!env) return <p className="rounded-xl bg-muted/60 p-3 text-sm">Asking NASA JPL Horizons where the Sun is…</p>;
  if (!env.data) return <div className="rounded-xl bg-muted/60 p-3 text-sm"><p>NASA Sun-position data could not be loaded, so this training can’t start. No numbers are shown because none were verified.</p><SourceFooter env={env} /></div>;
  const s = env.data, sun = s.points[Math.min(idx, s.points.length - 1)];
  const power = simulatedPower(az, el, sun.azimuth, sun.elevation);
  const pct = Math.round(power * 100);
  return <div className="space-y-3">
    <div className="rounded-xl bg-muted/60 p-3 text-sm">
      <p className="font-bold">NASA-calculated Sun position <span className="ml-1 rounded bg-secondary/20 px-1.5 py-0.5 text-[11px] font-semibold text-secondary">Archived calculation · not live</span></p>
      <p className="text-xs text-muted-foreground">Observer: {s.observer} on the Moon · Target: {s.target}. You train on Earth, but the numbers are for the Moon.</p>
      <label className="mt-2 block text-xs">Observation time
        <select className="ml-2 rounded bg-card px-2 py-1 font-mono" value={idx} onChange={(e) => setIdx(+e.target.value)}>
          {s.points.map((p, i) => <option key={p.time} value={i}>{p.time}</option>)}
        </select></label>
      <p className="mt-2 font-mono">Azimuth {sun.azimuth.toFixed(3)}° · Elevation {sun.elevation.toFixed(3)}°</p>
      <SourceFooter env={env} />
    </div>
    <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="space-y-2 text-sm">
        <label className="block">Panel turn (azimuth): <b className="font-mono">{az}°</b>
          <input aria-label="Panel azimuth" type="range" min={0} max={359} value={az} onChange={(e) => setAz(+e.target.value)} className="w-full accent-primary" /></label>
        <label className="block">Panel tilt (faces up at): <b className="font-mono">{el}°</b>
          <input aria-label="Panel elevation" type="range" min={0} max={90} value={el} onChange={(e) => setEl(+e.target.value)} className="w-full accent-primary" /></label>
      </div>
      <svg viewBox="-50 -50 100 100" className="mx-auto h-28 w-28" aria-label="Sky compass: Sun and panel direction">
        <circle r="46" className="fill-muted stroke-border" />
        <text y="-38" textAnchor="middle" className="fill-muted-foreground text-[8px]">N</text>
        {[[sun.azimuth, sun.elevation, "fill-warning"], [az, el, "fill-primary"]].map(([a, e, c], i) => { const r = 42 * (1 - (+e) / 90), A = (+a) * Math.PI / 180; return <circle key={i} cx={r * Math.sin(A)} cy={-r * Math.cos(A)} r={i ? 4 : 6} className={String(c)} />; })}
      </svg>
    </div>
    <div>
      <div className="flex justify-between text-xs"><span>Simulated power output</span><span className="font-mono font-bold">{pct}%</span></div>
      <div className="h-3 overflow-hidden rounded-full bg-muted"><div className={`h-full transition-all ${power >= SOLAR_PASS ? "bg-success" : power > 0.7 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${pct}%` }} /></div>
      <p className="mt-1 text-[11px] text-muted-foreground">Simulated power — a game calculation from the angle between panel and Sun, not a NASA measurement. Big yellow dot = Sun, small orange dot = your panel.</p>
    </div>
    {msg && <p className="text-sm text-warning">{msg}</p>}
    <div className="flex justify-end"><GameButton variant="primary" onClick={() => {
      if (power >= SOLAR_PASS) done({ sunTime: sun.time, panelAz: az, panelEl: el, simulatedPower: pct });
      else { audio.sfx("beep"); setMsg(`Only ${pct}% simulated power. Point the panel closer to the Sun (within about 10°).`); }
    }}>Lock panel angle</GameButton></div>
  </div>;
}
