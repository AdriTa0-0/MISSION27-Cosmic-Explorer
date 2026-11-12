import { useState } from "react";
import { useGame } from "../store";
import { speedRisk } from "../roverControls";

const INFO = {
  safe: { label: "Safe", cls: "bg-success/20 text-success border-success/60", tip: "Stable and easy to steer." },
  caution: { label: "Caution", cls: "bg-warning/20 text-warning border-warning/60", tip: "Harder to stop. Slow down for turns and slopes." },
  high: { label: "⚠ High Risk", cls: "bg-destructive/20 text-destructive border-destructive/60", tip: "Unstable! The rover could tip or skid. Safety assist slows it on turns and slopes." },
} as const;

/** Compact, collapsible speed dial. Display only — speed rules live in roverControls.ts. */
export function RoverSpeedDial({ defaultOpen = true }: { defaultOpen?: boolean }) {
  const setting = useGame((s) => s.roverSpeedSetting);
  const setSetting = useGame((s) => s.setRoverSpeedSetting);
  const [open, setOpen] = useState(defaultOpen);
  const pct = Math.round(setting * 100);
  const info = INFO[speedRisk(setting)];
  return (
    <section className="rover-dial" aria-label="Rover driving speed control">
      <button type="button" className="rover-dial-head" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="min-w-0 truncate">Speed <strong>{pct}%</strong></span>
        <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-bold ${info.cls}`} role="status" aria-live="polite">{info.label}</span>
        <span className="shrink-0" aria-hidden>{open ? "−" : "+"}</span>
      </button>
      {open && <div className="px-2.5 pb-2.5">
        <label htmlFor="rover-speed" className="sr-only">Set rover maximum speed</label>
        <div className="flex justify-between text-[11px]"><span>Gentle 20%</span><span>Fast 100%</span></div>
        <input id="rover-speed" aria-label="Set rover maximum speed" type="range" min="20" max="100" step="5" value={pct} onChange={(e) => setSetting(Number(e.target.value) / 100)} className="w-full accent-cyan-400" />
        <p className="rover-dial-tip">{info.tip}</p>
      </div>}
    </section>
  );
}
