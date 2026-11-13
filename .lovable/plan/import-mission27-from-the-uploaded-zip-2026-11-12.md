# Import MISSION27 from the uploaded ZIP

The ZIP extracted cleanly: 148 files under `M27-Final/`, a complete TanStack Start + React Three Fiber game (same stack as this project). Nothing will be rebuilt from a description — the original files are copied in as-is.

## What gets imported (unchanged)
- All game code: `src/game/**` (store, world, collision, input, audio, missions, UI panels, Training, Lunar mission, Handbook, Activities, touch controls, 3D worlds/astronaut)
- NASA data and assets: `src/game/nasa/**` (EPIC frames, Shackleton DEM tiles, EMU model, regolith textures, CRaTER/EVA/terrain JSON, sources)
- `public/draco/*` decoder files, favicon, robots.txt
- Routes, styles, UI components, hooks, lib, tests, docs, README, BUILD_AND_REVIEW
- Dotfiles stored without the dot (`gitignore`, `prettierrc`, `prettierignore`) restored to their normal names

## Steps
1. Extract to a scratch folder, copy source files over the blank template (no `.git`, no `node_modules`, no build output).
2. Merge `package.json`: keep the game's dependencies (three, @react-three/fiber, drei, zustand, etc.) while keeping this project's pinned TanStack/Lovable build versions so the preview keeps working.
3. Install dependencies with bun.
4. Run the project's 15 existing tests (collision, touch controls, mission audit, etc.) and confirm the preview builds without errors.
5. Open the game in a headless browser at desktop and phone sizes to confirm the home screen, mission and touch controls load.

## Database note
The archive includes an unused database setup (mission/run/event tables and connection files). The game itself does not call it — progress lives in the browser. I'll keep those files in place but not turn on a backend unless you want saved progress online later.

## If something fails
I'll report build or test failures and fix only what's needed to run, without changing gameplay.
