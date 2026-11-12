import { useState } from "react";
import {
  EARTH_TARGET_LONGITUDE,
  EPIC_FRAMES,
  longitudeDistance,
} from "../nasa/earth";
import { LEND_PRIORITY, LEND_TARGETS } from "../nasa/operations";
import { lolaReading } from "../nasa/terrain";
import { stationById } from "../world";
import { GameButton } from "./Button";

export function TerrainSurveyGame({ done }: { done: () => void }) {
  const [scanned, setScanned] = useState(false);
  const [target, setTarget] = useState<string | null>(null);
  const { x, z } = stationById.crater;
  const reading = lolaReading(x, z);

  return (
    <div className="space-y-4">
      <section className="rounded-xl bg-muted/60 p-3">
        <h3 className="font-display">LRO LOLA · Shackleton elevation scan</h3>
        {scanned ? (
          <p className="mt-1 font-mono text-sm text-secondary">
            {reading.elevation.toFixed(1)} m elevation ·{" "}
            {reading.slope.toFixed(1)}° slope · 5 m source grid
          </p>
        ) : (
          <GameButton
            variant="ghost"
            className="mt-2"
            onClick={() => setScanned(true)}
          >
            Scan survey point
          </GameButton>
        )}
      </section>
      {scanned && (
        <>
          <p className="text-sm">
            Use the archived LEND measurements to prioritize a separate
            follow-up survey. Select the site with the stronger neutron
            suppression, a clue that hydrogen may be present.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {LEND_TARGETS.map((site) => (
              <button
                key={site.name}
                type="button"
                aria-pressed={target === site.name}
                onClick={() => setTarget(site.name)}
                className={`rounded-xl border p-3 text-left ${target === site.name ? "border-secondary bg-secondary/15" : "border-border bg-muted/60"}`}
              >
                <span className="block font-display">{site.name}</span>
                <span className="font-mono text-xs">
                  {site.low}–{site.high}% fewer neutrons
                </span>
              </button>
            ))}
          </div>
          {target && target !== LEND_PRIORITY.name && (
            <p className="text-sm text-warning" role="status">
              Compare the two ranges and pick the larger suppression.
            </p>
          )}
          <div className="flex justify-end">
            <GameButton
              variant="primary"
              disabled={target !== LEND_PRIORITY.name}
              onClick={done}
            >
              Send survey results
            </GameButton>
          </div>
        </>
      )}
    </div>
  );
}
