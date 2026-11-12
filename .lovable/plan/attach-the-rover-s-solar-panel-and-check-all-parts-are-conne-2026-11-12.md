# Attach the rover's solar panel and check all parts are connected

## What's wrong
In the rover model, the dark blue solar panel sits about 0.3 units above the left equipment box, tilted, with nothing holding it. That gap is what makes it look like it's floating. I checked the other parts by their measurements: the wheels, suspension arms, camera mast, antenna, front cargo box and lights all touch the body. The wheel bottoms sit at ground level.

## Fix (rover model only)
1. **Solar panel:** mount it on a short support post that rises from the top of the rear-left equipment box. Add a small hinge block under the panel. Use a gentle tilt (about 12 degrees) so it looks like a working, sun-angled panel. Keep its size and colour, and add a thin silver frame around the edge.
2. **Antenna:** add a small base collar where the mast meets the deck so it looks bolted on.
3. **Camera mast:** add a small base plate on the deck.
4. **Wheels and suspension:** no changes to wheel position. The arms already link the body to the hubs.
5. Everything stays inside the rover's single moving group, so all parts move, turn and stop together. Driving code, speed controls and scoring are not touched.

## Testing
- Build and run the existing tests.
- Take screenshots of the rover from front, side, rear and above, both parked and while driving. Check visually that the panel is mounted and nothing floats.

## Technical details
Only `src/game/three/FriendlyRover.tsx` changes: a new panel group at roughly `[-0.68, 1.95, -0.58]` (the box top is about 1.89), plus a post, hinge, frame and base collars.
