# Earth Training: remove grey ball, show "Life Support Lab" label

## Changes
1. **Remove the grey ball** — it is the "hanging model moon" sphere above the room centre (in front of Instructor Sam). Delete only that object.
2. **Label the top-left monitor "Life Support Lab"** — that monitor is the Life Support station. Its label exists but sits so far left that it falls off-screen or gets cut off at the edge, so it looks unlabelled. Keep the same label style (rounded dark pill, same font and size, ✓ when done), and move only this label a little toward the room centre and slightly lower so it stays fully on screen above its monitor.

## Not changed
Other labels, stations, positions, gameplay, tasks, scoring, training progress.

## Check
Screenshots of the training room at desktop (1280 wide), your current size (859 wide), phone portrait and landscape: grey ball gone, "Life Support Lab" fully visible above the top-left monitor, other labels unchanged.

## Technical details
- `src/game/three/TrainingWorld.tsx`: remove the `sphereGeometry` model-moon mesh at `[0, 5, 0]`.
- Add an optional per-station `labelOffset` used by `Station`'s `<Html>` position; set it only on the `leak` entry.
