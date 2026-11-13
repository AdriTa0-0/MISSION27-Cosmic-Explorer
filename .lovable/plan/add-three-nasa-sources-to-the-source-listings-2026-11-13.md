# Add three NASA sources to the source listings

Both "Operations Console → NASA Data & Sources" and "Handbook → NASA Data & Sources" read the same shared source list, so adding three entries there updates both screens at once with the existing card design.

## New entries (appended; the 11 existing sources stay untouched)

1. **NASA OSDR-766 – Space-Grown Tomato Experiment**
   - Type: "NASA experiment record"
   - Try it: Greenhouse activity (NASA Plant Lab card)
   - What it does: shows the real OSD-766 study details (VEG-05 tomatoes, 90:10 and 50:50 red:blue LED treatments, mission dates, file counts). Picking a treatment only sets starting slider values; crop growth and scores are a game simulation.
   - Link: https://osdr.nasa.gov/bio/repo/data/studies/OSD-766

2. **NASA RadLab – Radiation Dosimetry Database**
   - Type: "Archived measurements"
   - Try it: Radiation Safety activity (NASA Radiation Lab chart)
   - What it does: charts real archived hourly CRaTER dose-rate readings (µGy/hour) from Jan 2023. Shelter choices and safety scores are simulated.
   - Link: https://visualization.osdr.nasa.gov/radlab/gui/data-api/

3. **NASA JPL Horizons – Solar Position Data**
   - Type: "NASA calculation"
   - Try it: Train on Earth → Solar Energy Lab
   - What it does: shows NASA-calculated Sun azimuth and elevation seen from the Moon's Apollo 11 site. The panel power meter is a game calculation, not a NASA measurement.
   - Link: https://ssd.jpl.nasa.gov/horizons/

## Checks
- Open each link to confirm it loads.
- Update the existing test that expects 11 sources to expect 14.
- Look at both sections on desktop and phone to confirm the cards read cleanly.

Nothing else changes: no gameplay, missions, scoring or controls.

## Technical
- Edit only `src/game/nasa/sources.json` (append 3 objects, same fields) and the count in `src/game/mission-audit.test.ts`.
