> Current controls, timing, rover design and validation are described in UPDATE_NOTES.md.

> Latest update: see UPDATE_NOTES.md for current controls, retries, camera and validation.

# MISSION27 — build and review

This archive contains the complete browser-game source, not a Unity project.

## Run on your laptop
1. Extract the ZIP. Open a terminal inside M27-Final (where package.json is).
2. Install Node.js 22.12+ (Node 24 recommended).
3. Run `npm ci`.
4. Run `npm run dev`. Open the URL printed by Vite.

## Build
Run `npm test`, `npx tsc --noEmit`, then `npm run build`.
This project's existing TanStack Start / Nitro configuration creates `.output` with a Cloudflare Worker server and public assets. Deploy the complete output using the existing Lovable workflow or a compatible Cloudflare/Nitro deployment. Do not upload only the source ZIP or treat `.output/public` as a complete standalone static website. Hosting and publishing are separate from this source delivery.

## Show the NASA integration to judges
- Home > Handbook > NASA Data: all eleven source categories, source links, where to play each feature, and whether it is archived data, an asset or a reference-based model.
- In mission: desktop OPS CONSOLE / mobile Status > NASA DATA. Includes current source-grid terrain elevation and slope, simulated Sun/horizon conditions, and recovery model.
- Tasks > Photograph Earth: complete EVA preparation, follow the green marker to Earthrise Ridge, interact, aim the 3D field camera, focus, balance exposure and capture. Completion saves the picture and its EPIC source reference.
- Tasks > Scan Shackleton: scan LOLA values and choose a hydrogen survey site using LEND ranges.
- Airlock: rotate NASA's EMU model, use the historical EVA duration to compare illustrative battery runtimes.
- Greenhouse emergency: tune lighting to OSD-269 protocol parameters.
- Solar particle emergency: DONKI event replay with optional CRaTER detector exercise. NOAA's proton peak is a separately credited observation; CRaTER readings are from a different date.
- Habitat and Power: recycling and terrain/illumination influence resource simulation.
- Crew conflict remains a cooperation task.

## Audit results and boundaries
15 automated tests passed; TypeScript checking and production build passed. Tests cover collision movement, interrupted touch controls, route matching, objective/source counts, Earth-photo completion logging, pause behavior, reference constants, and one-time storage rewards.
Asset checks passed for two DEM tiles, five EPIC images with matching metadata, EMU GLB and three Draco decoder files.
Added NASA source evidence views; fixed repeatable storage reward; updated commander's directions for phone controls. Prior compact phone HUD, collisions and loading improvements are retained.

NASA data is not all live telemetry: some features use embedded archived measurements; others use published experiment parameters or educational models. LSOS is a design reference, not imported NASA simulation code. See docs/NASA_DATA.md for provenance, transformations and limitations. The exact original upstream DEM was supplied by the team; this review validates packaged tiles, not a fresh comparison against the original TIFF.

The complete mission has not been manually played through on physical phones or desktops in this workspace. No guaranteed frame rate, zero-loading-time claim or claim of NASA endorsement is made. Before submitting, test portrait and landscape on your phone, all minigames, save/continue and the full 27-hour simulation on the deployed URL.
