# Real NASA data for Plant Lab (OSDR-766) and Radiation Lab (RadLab)

## Current state (checked)
- The greenhouse activity ("Balance the Crops") cites NASA OSDR OSD-269 lettuce values stored in the game; nothing is fetched live.
- The Radiation Shelter activity has no NASA measurement data.
- Both NASA sources respond today: OSDR returns OSD-766 metadata and a file list (571 files, so only the list is read, never the files). RadLab redirects `/radlab/api` to `/radlab/api/`; its exact query format is read from that documentation page before coding.

## What players will see
**Plant Lab (greenhouse activity)**
- A "NASA Study: OSD-766 (VEG-05 tomatoes)" card with the study title, mission, dates and the lighting treatments exactly as NASA lists them (e.g. 90:10 and 50:50 red:blue).
- If the study record does not contain those treatments or observations, the card says so instead of showing invented values.
- Players pick a treatment and apply it to the existing slider game. The card is labelled "NASA experiment record", and the game result is labelled "Simulated greenhouse (gameplay)".

**Radiation Lab (radiation activity)**
- A small interactive chart of real archived dose-rate readings for a short date range (a few days) from one spacecraft/instrument documented by RadLab.
- Shows units (as returned, e.g. µGy/day or µGy/h), timestamps, instrument name, and a hover/tap readout.
- Labelled "Archived measurements", never "live".

**Both cards** show the observation date(s), the "last retrieved from NASA" time, a "Cached copy" tag when NASA is unreachable, the actual error text if something fails, and clickable official NASA links.

## Unchanged
16 tasks, 800 XP scoring and its tests, rover, crew conflict, DONKI replay, other NASA cards, mission completion, mobile layout. The NASA cards are read-only and award no XP.

## Technical details
- `src/game/nasa/osdr.functions.ts` and `src/game/nasa/radlab.functions.ts`: `createServerFn` GET handlers that fetch from NASA with a timeout, validate with zod (only needed fields kept), and cache in memory for 6 hours. On failure they return the last good copy with `cached: true` and the error message.
- Fallback chain: in-memory cache, then the browser's last verified copy in localStorage, then a clear error. No made-up data is bundled; no database needed.
- Returned shape: `{ source, sourceUrls, retrievedAt, observedRange, cached, error?, data }`.
- UI: `src/game/ui/NasaPlantStudy.tsx` and `src/game/ui/RadLabChart.tsx` (plain SVG chart, no new packages), inserted into `GreenhouseGame` and `RadiationGame` in `Activities.tsx`. Applying a treatment only sets starting slider values/target note; how the activity is won stays the same.
- Tests: zod parsers against small trimmed real response samples; a check that a failed fetch returns cached/error and never fake records.
- Verification: call both server functions, report record IDs, fields, dates and URLs; Playwright screenshots of both cards on desktop and phone.
