# MISSION27 Lovable Prompts

This file records the prompts and prompt-like requirements that can be recovered
from this repository for the MISSION27 — Cosmic Explorer game.

## Human-created brief and design decisions

The following ideas and product choices came from the project team. They form the
human creative brief behind the Lovable prompts and should not be attributed to
AI-generated gameplay suggestions.

### Concept, scope, and gameplay

- The current game is a browser-based 3D astronaut mission trainer for ages 7–12.
  The player can visit a separate Earth Training area, then enter the lunar
  outpost to explore, operate stations, drive the rover, complete science tasks,
  and keep the crew and base systems safe.
- **MISSION27** is a 27-simulated-hour mission. The clock is accelerated so the
  full survival endpoint can be reached in a short play session, but the player
  can also finish early by completing all 16 objectives and resolving any active
  alert. The final report records the outcome, completed work, decisions, and XP.
- The current scope includes Earth training activities, lunar exploration,
  resource management, rover travel, lunar sample collection and analysis,
  Earth photography, NASA-data activities, crew cooperation, and emergency
  response. It does not depend on a merchandise store, live NASA telemetry, or a
  backend account system; saves and mission progress work in the browser.
- **START MISSION** enters the lunar outpost directly. **Earth Training** remains
  a separate mode with practice stations for life support, power, radiation,
  greenhouse, EVA, and repair skills.
- The lunar mission presents a tracked objective and destination marker. The
  player walks around the outpost, interacts with crew and equipment, opens
  activities, and can review the complete 16-task checklist. Task completion,
  retries, and saved progress are reflected in the mission report.
- Mission alerts are time-paced and queued so they do not overlap. The current
  alert takes priority over ordinary navigation, and the player must respond to
  it before a successful early completion can be reported. Alerts include crew,
  power, greenhouse, pressure, radiation, and other outpost emergencies.
- The rover supports keyboard driving with WASD or arrow keys, braking with
  Shift/STOP, and touch controls on compatible devices. Its map, camera views,
  speed setting, risk badge, and automatic safety assist support exploration
  without making speed a mission-failure condition.
- EVA tasks include collecting three lunar rock samples, reviewing their details,
  and analyzing them in the Science Lab. The Earth photography task requires the
  player to reach Earthrise Ridge, aim the field camera, focus, balance exposure,
  capture, and save the image with its archived EPIC reference.
- NASA sources are used as playable evidence: LOLA terrain affects elevation and
  slope, LEND supports the hydrogen-site choice, CRaTER provides a detector
  replay, DONKI and NOAA inform the radiation scenario, and other sources support
  greenhouse, water recovery, EVA, illumination, and operations activities.
  Archived measurements and published references are clearly distinguished from
  the game’s educational models.
- Mission XP is earned once per task or alert through the keyed reward ledger and
  is capped by the reward design at 800 XP. The HUD, task feedback, saved mission,
  retry flow, and final report use the same score rather than a separate visual
  cap.
- The current interaction goals remain accessibility and clarity: astronauts stay
  upright and above the ground, the world remains bright enough to read, and
  touch layouts use a D-pad without exposing keyboard labels.

### Visual direction and review

- The current game combines a friendly, stylized 3D lunar environment with a
  dark space-console interface. It is designed to feel like an approachable
  astronaut mission dashboard rather than a realistic military or industrial
  simulator.
- The interface uses a deep navy background with pale text, warm orange primary
  actions, and cool teal secondary controls. Additional yellow, green, pink,
  violet, and blue accents identify resources, crew roles, warnings, and science
  states where useful.
- Panels use translucent dark surfaces, soft borders, rounded corners, light
  backdrop blur, and restrained shadows. The main home screen adds a radial
  space vignette, subtle star-field atmosphere, logo sweep, and gentle entrance
  or floating animations.
- Typography is intentionally mixed: rounded display lettering for headings and
  player-facing instructions, a clean sans-serif for body text, an Exo-style logo
  treatment for **MISSION27**, and compact monospace labels for telemetry,
  mission codes, status readouts, and technical controls.
- Buttons are tactile and high-contrast, commonly using rounded pill shapes,
  colored fills, small lift/press feedback, and glow-like shadows. Mission and
  emergency states use clear status colors and readable alerts instead of relying
  on decoration alone.
- The astronaut reference look remains a white suit with light-blue bands and
  gloves and an orange visor rim. The rover is a bright, rounded, child-friendly
  educational vehicle with teal and yellow details, rather than a photorealistic
  NASA rover reproduction.
- The 3D world and interface are designed together: readable station labels,
  complete visible geometry, camera controls, rover-map and speed panels, and
  touch controls must remain usable over the scene on desktop, tablet, and phone
  screens. Reduced-motion settings disable decorative animation where possible.
- The team reviewed the running preview after each major change and directed
  fixes for readability, mesh visibility, camera behavior, rover controls,
  mobile layout, panel overlap, alert placement, and touch feedback.

### Attribution to confirm

The project still needs to record who authored the design YAML and who drew or
selected the dossier reference image. These credits remain open until the team
provides the relevant names or source links.

## Prompt 1 — Import the game from the uploaded ZIP

> Import MISSION27 from the uploaded ZIP. The ZIP contains a complete TanStack
> Start + React Three Fiber educational lunar exploration game. Copy the game
> source, routes, styles, tests, NASA data, public assets, documentation, and
> configuration into the existing Lovable project. Preserve the existing pinned
> TanStack/Lovable build tooling while merging the game's dependencies, including
> Three.js, React Three Fiber, Drei, and Zustand. Do not rebuild the game from a
> description and do not add a backend for progress unless explicitly requested;
> progress is stored in the browser.
>
> Exclude `.git`, `node_modules`, and build output when importing. Install the
> dependencies, run the existing tests, and confirm that the preview builds and
> loads at desktop and phone sizes. If something fails, make only the changes
> needed to build and run without changing gameplay, and report the change.

## Prompt 2 — Apply the field update from the ZIP

> Apply the complete MISSION27 field update from the uploaded ZIP to the existing
> Lovable project. Copy the updated game files and public reference assets while
> excluding `.git`, `node_modules`, and build output and preserving the pinned
> build tooling. Keep the existing mission, NASA-data, camera, rover-map, Earth
> photo, sample-gallery, touch-control, and retry features working.
>
> Refresh dependencies, run all tests, and confirm the preview builds without
> errors. Check the start screen, Moon mission, Ari's starting position, view
> controls, rover map, Earth camera, and phone portrait/landscape layout. Report
> which update-note checks were verified and which still require a physical-device
> playthrough. If something fails, fix only what is needed to build or run and
> explain what changed.

## Prompt 3 — Add the rover speed, risk, and XP update

> Apply the MISSION27 rover, speed, and XP update. Replace the toy-like rover
> with a six-wheel lunar field rover that has suspension, a solar panel, sensors,
> and an antenna. Increase the forward maximum from 4 to 8 world units per
> second, add a 20–100% speed dial defaulting to 65%, and keep Shift/STOP as a
> brake. Add Safe, Caution, and High Risk speed states at 20–65%, 66–85%, and
> 86–100%. At high risk, warn about tipping and loss of grip and automatically
> slow the rover during sustained high-risk driving or sharp turns. Speed must
> never fail the mission.
>
> Fix XP at the reward-source level, not by visually clamping the displayed score.
> Give every task and alert reward a stable key and store it in an `awarded`
> ledger so retries and reloads cannot pay twice. Recompute saved XP from the
> completed tasks and resolved alert outcomes. Scale the best alert rewards so
> they total 270 XP; with the 16 task rewards totaling 530 XP, a perfect mission
> must total exactly 800 XP. Keep the HUD, task messages, and final report on the
> same total. Ensure the speed dial does not cover mobile driving controls.
>
> Add tests for the 800 XP maximum, duplicate-reward prevention, old-save
> correction, speed-risk thresholds, and automatic slowdown. Run tests, TypeScript
> checking, and the production build, then check desktop, phone portrait, and
> phone landscape layouts. Keep the missions, NASA data, learning content,
> photos, camera, map, retries, and crew conflict unchanged.

## Prompt 4 — Fix rover map and speed-dial overlap

> Fix the rover HUD layout so the Rover Map and Speed Dial never overlap. Put
> them in one right-side flex column with the map above the dial, a 10px gap, and
> a height limit that ends before the touch controls, STOP, and Exit Rover. Keep
> mission alerts centered at the top and clear of this column.
>
> Let the map fold open and closed; it should start folded on phones and small
> screens and open on desktop. Keep a compact speed header visible with the
> percentage, Safe/Caution/High Risk badge, and an expand button. Hide only the
> optional tip on short landscape phone screens. Use solid dark panel backgrounds,
> truncate long labels cleanly, and fix any leftover broken `.compact-world` CSS.
>
> Verify the layout at desktop, tablet, phone portrait, and phone landscape, with
> an active Pressure Leak alert. Check the map open and folded states and confirm
> that the map, dial, alert, View button, touch buttons, and Exit Rover do not
> overlap. Do not change driving, speed rules, scoring, missions, or other
> gameplay.

## Prompt 5 — Mount the rover's solar panel and detail the attachments

> Fix the rover model only. The dark-blue solar panel is floating above the
> left equipment box. Mount it on a short support post from the rear-left box,
> add a small hinge block, tilt it gently by about 12 degrees, retain its size
> and color, and add a thin silver edge frame. Add a small base collar where
> the antenna meets the deck and a base plate under the camera mast. Do not move
> the wheels or suspension arms; they already connect correctly.
>
> Keep every part inside the rover's single moving group so it turns, drives, and
> stops together. Do not touch driving code, speed controls, or scoring. Change
> only `src/game/three/FriendlyRover.tsx`, run the existing tests, and inspect
> front, side, rear, and top views while parked and driving to confirm that no
> parts float.

## Shared Lovable constraints

These constraints apply across the prompts and should be repeated when asking
Lovable for future changes:

1. Preserve the existing TanStack Start / React / Three.js architecture and
   pinned Lovable build configuration.
2. Keep the game playable on desktop, tablet, and phone in portrait and
   landscape orientations.
3. Make gameplay changes narrowly; do not replace working systems with
   placeholders or rebuild from a description when source/assets are available.
4. Treat NASA content accurately: distinguish archived measurements, published
   parameters, reference assets, and educational/game models from live telemetry.
5. Validate with `npm test`, `npx tsc --noEmit`, and `npm run build` (or the
   equivalent Bun commands documented by the project).
6. Mission XP comes only from the per-key `awarded` ledger in `store.ts`. One
   entry is allowed per task or alert, and task XP plus best-alert XP must equal
   `MAX_MISSION_XP` as enforced by `xpAndSpeed.test.ts`.
7. Do not force-push, rebase, amend, or squash published history connected to
   Lovable.

## Game-generation brief

For a new Lovable project or a full regeneration, the recovered project brief is:

> Build MISSION27 — Cosmic Explorer, an interactive 3D educational lunar mission
> trainer for students aged 7–12. Players train as astronauts, explore a lunar
> base and surface, drive a rover, collect samples, photograph Earth, inspect
> NASA science references, manage life-support resources, respond to emergencies,
> cooperate with crew, and complete 16 objectives across a simulated 27-hour
> mission. Use a friendly space-training visual style, clear instructions,
> accessible controls, responsive desktop/mobile HUDs, browser save/continue,
> NASA source transparency, and an educational mission report with a maximum
> score of 800 XP. Implement the game in React, TypeScript, TanStack Start,
> React Three Fiber, Three.js, and Zustand, using the supplied assets and data.
> Include tests for movement, touch controls, missions, saves, NASA-source
> references, retries, Earth photography, XP accounting, and rover speed safety.

This final brief is a reconstruction from `README.md`, `BUILD_AND_REVIEW.md`,
`UPDATE_NOTES.md`, and the source tree; it is not a recovered verbatim Lovable
prompt.

