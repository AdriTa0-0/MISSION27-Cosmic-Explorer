# Fix the Rover Map / Speed Dial overlap

## About the 27.3 ZIP
All of its files match the current game exactly, including the layout fix I had started. There's nothing new to import, and nothing failed to read.

## Layout (already started, will finish and check)
- **One right-side column:** the Rover Map sits at the top right, and the Speed Dial sits directly below it with a 10px gap. Because they're stacked in the same column, they can't overlap each other. The column also has a height limit, so it stops before the touch buttons, STOP and Exit Rover.
- **Rover Map:** you can fold or open it with the "Rover map −/+" button. It starts folded on phones and small screens, and open on desktop.
- **Speed Dial:** a compact header always shows the speed %, the Safe/Caution/High Risk badge and a −/+ button. Opening it shows the slider and a one-line tip. On short, sideways phone screens the tip is hidden.
- **Readability:** solid dark backgrounds, so the Moon no longer shows through. Long labels get cut off neatly instead of spilling out, and the panels stack in a consistent order.
- **Mission alerts:** these stay centred at the top, clear of the right column.

## Verification
Check on desktop (1280 wide and your 978-wide window), tablet, and a phone upright and sideways, with a Pressure Leak alert showing.

On every screen, I'll take a screenshot with the map open and with it folded. I'll also measure each panel's edges to confirm that none of the map, dial, alert, View button, touch buttons or Exit Rover overlap. If anything still overlaps, I'll fix it and test again.

## Not changed
Rover driving, speed rules, scoring, missions and all other features stay the same. Only the layout and styling change.

## Technical notes
- New `ui/RoverSpeedDial.tsx` (display only; uses `speedRisk` and `setRoverSpeedSetting` from the store).
- The `.rover-stack` flex column in `styles.css` replaces the separately positioned map and dial. `RoverMap` gets `defaultOpen={!compact}`.
- Fix the leftover broken `.compact-world` CSS line, if there is one, and give the tests a short time limit per screen so they don't hang.
