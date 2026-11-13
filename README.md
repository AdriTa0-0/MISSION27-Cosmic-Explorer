# MISSION27 · Lunar Outpost

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Use Node.js 22.12 or later and npm. Open a terminal in the extracted project folder, then run:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Choose **Start Mission**, use **WASD** to move and drag the scene to look around. See [NASA data in MISSION27](docs/NASA_DATA.md) for the in-game locations and data credits.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS

## Collision and phone controls update

- Solid footprints now cover modules, tunnels, power equipment, crates, landing gear area, sample rocks, scattered rocks, marker poles and the rover. Movement uses small collision steps and slides along obstacles. Rover exits require clear ground.
- Laptop: WASD or arrows to move, Shift to run, drag the scene to look, Enter to interact. Existing buttons and activities are unchanged.
- Touch device: hold the directional pad to walk/drive, hold RUN with another finger to run/boost, drag the uncovered scene to look, and tap the interaction prompt. Touch controls appear on devices with a coarse pointer, including tablets. Landscape gives more room; portrait is also supported.
- Controls clear on app backgrounding, interruption, and modal opening. Training has the same touch controls. Mission HUD adapts to narrow/short screens.
- This ZIP remains the existing browser game source, not a Unity project. Use `npm install` then `npm run dev` as before; use `npm run build` for deployment. Phones must open the hosted URL (or a reachable LAN development server), not the ZIP directly.

## Compact phone HUD
On narrow screens and coarse-pointer devices up to 1100px wide, exploration displays only the mission clock, Tasks, Status, Menu and one destination/alert line. Tap Tasks for the full checklist and emergency instructions; Status opens the operations console and resource details. Landscape and portrait layouts reserve bottom corners for movement controls. Desktop retains the expanded HUD.
Mobile rendering caps pixel density at 1, disables real-time shadows, reduces background stars and removes HUD blur/animation. Terrain data, collisions, tasks and mission rules are unchanged. Actual frame rates require testing on target phones.
