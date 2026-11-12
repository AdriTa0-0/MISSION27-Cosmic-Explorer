import { useState } from "react";
import archive from "../nasa/crater-events.json";
import { GameButton } from "./Button";

export function CraterReplay() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const record = archive.events[index];
  const detected = record.energyKev.map((value, i) =>
    record.amplitudes[i] > 0 ? value : 0,
  );
  const peak = Math.max(...detected);

  return (
    <details className="mb-3 rounded-xl bg-muted/60 p-3 text-xs">
      <summary className="cursor-pointer font-display text-secondary">
        Inspect CRaTER detector replay
      </summary>
      <p className="my-2">
        <a
          href={archive.source}
          target="_blank"
          rel="noreferrer"
          className="underline"
        >
          NASA LRO CRaTER archive
        </a>
        {" · "}
        {archive.date} · Event {record.index}. Select the channel with the
        strongest recorded signal.
      </p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {detected.map((value, i) => (
          <button
            type="button"
            key={i}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
            className={`rounded-lg border p-1.5 text-center ${selected === i ? "border-secondary" : "border-border"}`}
          >
            <span className="block font-mono">D{i + 1}</span>
            <span
              className="block h-1 overflow-hidden rounded bg-background"
              aria-hidden="true"
            >
              <span
                className="block h-full bg-secondary"
                style={{ width: `${(value / peak) * 100}%` }}
              />
            </span>
            <span className="text-[10px]">
              {value > 0 ? `${value.toFixed(1)} keV` : "No pulse"}
            </span>
          </button>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <p role="status">
          {selected === null
            ? "Calibrated detector energy in keV."
            : detected[selected] === peak
              ? "Correct. This detector recorded the most energy in this event."
              : "Compare the detected energy across channels."}
        </p>
        <GameButton
          variant="ghost"
          className="shrink-0 px-2 py-1 text-xs"
          onClick={() => {
            setIndex((current) => (current + 1) % archive.events.length);
            setSelected(null);
          }}
        >
          Next event
        </GameButton>
      </div>
    </details>
  );
}
