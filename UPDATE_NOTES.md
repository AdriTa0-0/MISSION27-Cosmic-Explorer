# MISSION27 — Young Explorer update

Built from the uploaded 27.zip. Import the complete source and public assets into the
existing Lovable project. Reload the preview and start a new mission to see the new
crew-conflict timing. Existing saves retain their completed tasks and incident history.

## Current changes
- Rover: a rounded white/teal/yellow educational buggy, matching the astronauts. The
  yellow hood, lamps and smile mark the front (+Z). This is an original game illustration,
  not a NASA rover model. The friend's GLB remains bundled as a reference asset.
- Driving: arrows or WASD. Forward limit 4 game metres/second; reverse limit 2.
  Acceleration is gentle; releasing buttons brakes to a stop in under half a second.
  Reversing brakes before engaging reverse. Left/right turn consistently, even at rest.
  Shift or the mobile STOP button brakes; there is no rover turbo. Mobile arrows are
  larger and labelled GO/BACK/LEFT/RIGHT with pressed feedback.
- Camera follows behind the rover by default. Drag to look freely; View → Follow behind
  rover restores follow mode. Manual zoom, 360 rotation and bird's-eye remain available.
- Removed ALL camera-driven mesh hiding. Astronauts, buildings, consoles and rover
  retain their complete geometry. No collision-triggered zoom. An object can naturally
  obstruct a low-angle view; rotate or elevate the camera using View to see around it.
- Brighter background stars plus 72 gently glowing sparkles. Twinkling stops for the
  operating system's reduced-motion setting. This is visual styling, not measured data.
- Crew conflict is the first alert at H01:00 (30 seconds of active play). Power follows
  at H04:00. Alerts queue rather than overlap. Other alert timing remains unchanged.
- Complete all 16 tasks and resolve any current alert to finish immediately. The last
  reading panel can be closed first. You do not need to wait for H27:00. The existing
  27-simulated-hour survival endpoint remains; the clock runs for 13.5 active minutes.
- Training station labels have a consistent size and clearer layering above consoles.
  The large training checklist is collapsed by default so it cannot cover the Life
  Support Lab label. Expand it with Choose a practice station.
- Clear NASA science cards and links appear in relevant activities. Technical event
  values remain available without presenting simplified gameplay as real telemetry.

## DONKI — already integrated, not added a second time
NASA CCMC record 2024-05-11T04:07:00-SEP-001 (11 May 2024, STEREO-A; linked X5.8 flare)
is used in the existing solar particle event replay. See:
- Command Module → Radiation Shelter during the solar particle alert (H15:30, after
  earlier alerts clear). It displays the event ID, source link and event times.
- Handbook → NASA Data & Sources, or Operations Console → NASA Data & Sources.
- src/game/nasa/operations.ts stores the archived event metadata; Activities.tsx displays
  it; store.ts schedules the alert and records the response in the decision log.

NASA source: https://kauai.ccmc.gsfc.nasa.gov/DONKI/view/SEP/30717/1
The separate NOAA GOES 116 pfu observation scales the game exposure model; it is not
represented as a DONKI measurement. This is an archived replay, not a live API feed.
If you finish the mission before the scheduled storm, that incident does not have to
occur; its reference remains accessible in the Handbook and Operations Console.

## Retained
Sample-photo panels and gallery; EPIC Earth viewfinder and saved photo; LOLA terrain;
rover map; compact mobile HUD; two checkpoint retries; task checkmarks; final XP score;
crew cooperation; NASA sources; the full 70-file companion asset collection.

## Build and validation
Node 22.12+ or 24. Use the supplied bun.lock with `bun install --frozen-lockfile`, then
`bun run dev` / `bun run build`. Alternatively `npm install`, `npm run dev` / `npm run build`.
Checks: `npx tsc --noEmit`, `npm test`, `npm run build`.
33 tests pass, including braking/reverse, touch cancellation, early completion,
active-alert blocking, earlier crew conflict, retries, collisions and Earth capture.
TypeScript and production build are checked. No physical-device or rendered gameplay
verification is claimed; test the preview on a phone and laptop after importing.

## Preview checks
1. Walk around crew, modules and consoles: no disappearing mesh pieces.
2. Enter the rover: its nose points away from the following camera. Up forward, Down
   reverse, Left/Right turn. Release to stop; Shift/STOP brakes. Check touch too.
3. Rotate the camera freely; use Follow behind rover to return. Test obstacles and hills.
4. Check brighter stars, normal/bird's-eye views and reduced-motion mode.
5. Training: read Life Support Lab above its device with the checklist closed.
6. New mission: crew conflict after 30 active seconds; reading/menu time is paused.
7. Finish all 16 tasks: completion report immediately after any active alert is resolved
   and the last panel closes. Check final XP and photo.
8. Review NASA sources in activities, Handbook and Operations, including DONKI.
