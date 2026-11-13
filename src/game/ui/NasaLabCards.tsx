import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getPlantStudy, getRadlabSeries } from "../nasa/nasaLabs.functions";
import type { Envelope, PlantStudy, RadSeries } from "../nasa/nasaLabs";

export function useNasa<T>(key: string, fn: () => Promise<Envelope<T>>) {
  const [env, setEnv] = useState<Envelope<T> | null>(null);
  useEffect(() => {
    let alive = true;
    fn().then((r) => {
      if (r.data && !r.error) localStorage.setItem(key, JSON.stringify(r));
      else if (!r.data) {
        const saved = localStorage.getItem(key);
        if (saved) { const prev = JSON.parse(saved) as Envelope<T>; r = { ...prev, cached: true, error: r.error }; }
      }
      if (alive) setEnv(r);
    }).catch((e) => {
      const saved = localStorage.getItem(key);
      const error = e instanceof Error ? e.message : String(e);
      if (alive) setEnv(saved ? { ...(JSON.parse(saved) as Envelope<T>), cached: true, error } : { source: "NASA", sourceUrls: [], retrievedAt: "", observedRange: "", cached: false, error, data: null });
    });
    return () => { alive = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return env;
}

export function SourceFooter({ env }: { env: Envelope<unknown> }) {
  return <div className="mt-2 space-y-1 text-[11px] text-muted-foreground">
    <p>{env.retrievedAt ? `Last retrieved from NASA: ${new Date(env.retrievedAt).toLocaleString()}` : "Not yet retrieved from NASA"}
      {env.cached && <span className="ml-2 rounded bg-warning/20 px-1.5 py-0.5 font-semibold text-warning">Cached copy</span>}</p>
    {env.error && <p className="text-destructive">NASA request problem: {env.error}</p>}
    <p className="flex flex-wrap gap-x-3">{env.sourceUrls.map((s) => <a key={s.url} href={s.url} target="_blank" rel="noreferrer" className="text-secondary underline">{s.label}</a>)}</p>
  </div>;
}

export function NasaPlantStudy({ onApply, applied }: { onApply: (t: { red: number; blue: number; label: string }) => void; applied: string | null }) {
  const fn = useServerFn(getPlantStudy);
  const env = useNasa<PlantStudy>("m27-nasa-osd766", () => fn());
  if (!env) return <div className="rounded-xl bg-muted/60 p-3 text-xs">Loading NASA study OSD-766…</div>;
  const s = env.data;
  return <section aria-label="NASA experiment record" className="rounded-xl border border-border bg-muted/60 p-3 text-sm">
    <p className="text-[11px] font-semibold uppercase tracking-wide text-secondary">NASA experiment record · {env.source}</p>
    {s ? <>
      <h4 className="font-display">{s.title}</h4>
      {s.missionDates && <p className="text-xs">Grown on the ISS (VEG-05 tomatoes): {s.missionDates}</p>}
      <p className="text-xs text-muted-foreground">Study released {s.releaseDate} · {s.fileCount} data files listed (not downloaded)</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {s.treatments.map((t) => <button key={t.label} type="button" onClick={() => onApply(t)}
          className={`rounded-lg border px-2 py-1 text-xs ${applied === t.label ? "border-primary bg-primary/20" : "border-border"}`}>
          {t.label}{t.name ? ` · “${t.name}”` : ""} — try in simulation</button>)}
      </div>
      {s.observations.length > 0 && <div className="mt-2"><p className="text-xs font-semibold">What NASA observed (quoted from the study):</p>
        <ul className="list-disc pl-4 text-xs">{s.observations.map((o) => <li key={o}>{o}</li>)}</ul></div>}
    </> : <p className="text-xs">The NASA study could not be loaded, so no experiment values are shown.</p>}
    <SourceFooter env={env} />
  </section>;
}

export function RadLabChart() {
  const fn = useServerFn(getRadlabSeries);
  const env = useNasa<RadSeries>("m27-nasa-radlab", () => fn());
  const [hover, setHover] = useState<number | null>(null);
  if (!env) return <div className="rounded-xl bg-muted/60 p-3 text-xs">Loading NASA RadLab measurements…</div>;
  const r = env.data;
  return <section aria-label="NASA RadLab archived measurements" className="mb-3 rounded-xl border border-border bg-muted/60 p-3 text-sm">
    <p className="text-[11px] font-semibold uppercase tracking-wide text-secondary">Archived measurements · {env.source}</p>
    {r ? (() => {
      const vs = r.points.map((p) => p.v); const lo = Math.min(...vs), hi = Math.max(...vs), span = hi - lo || 1;
      const W = 300, H = 90; const x = (i: number) => (i / (r.points.length - 1 || 1)) * W; const y = (v: number) => H - ((v - lo) / span) * (H - 10) - 5;
      const h = hover ?? r.points.length - 1; const p = r.points[h];
      return <>
        <p className="text-xs">{r.instrument} ({r.instrumentId}) · {r.spacecraft} · absorbed dose rate in {r.unit}</p>
        <p className="text-xs text-muted-foreground">Observed {env.observedRange} · {r.points.length} readings</p>
        <svg viewBox={`0 0 ${W} ${H}`} className="mt-1 h-24 w-full touch-none" role="img" aria-label={`Dose rate from ${lo.toFixed(2)} to ${hi.toFixed(2)} ${r.unit}`}
          onPointerMove={(e) => { const b = e.currentTarget.getBoundingClientRect(); setHover(Math.max(0, Math.min(r.points.length - 1, Math.round(((e.clientX - b.left) / b.width) * (r.points.length - 1))))); }}>
          <polyline fill="none" stroke="var(--secondary)" strokeWidth="1.5" points={r.points.map((q, i) => `${x(i)},${y(q.v)}`).join(" ")} />
          <circle cx={x(h)} cy={y(p.v)} r="3" fill="var(--warning)" />
        </svg>
        <p className="font-mono text-xs">{p.t} UTC · {p.v.toFixed(2)} {r.unit} <span className="text-muted-foreground">(range {lo.toFixed(2)}–{hi.toFixed(2)})</span></p>
      </>;
    })() : <p className="text-xs">No RadLab readings could be loaded, so no measurements are shown.</p>}
    <SourceFooter env={env} />
  </section>;
}
