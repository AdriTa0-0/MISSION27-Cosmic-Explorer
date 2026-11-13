# Add "Solar Energy Training – NASA Horizons" to Train on Earth only

## What players get
- An 8th station in the Earth Training room: **Solar Energy Lab** (new spot on the floor, own label, same style as the other stations).
- Walking up and opening it shows a card with real NASA JPL Horizons numbers: the Sun's elevation and azimuth as seen from a fixed spot on the Moon's surface (Apollo 11 site), for a short series of times, each with its date/time (UTC).
- A simple solar panel the player tilts (elevation slider) and turns (azimuth dial). A meter shows **simulated** power, calculated from how closely the panel faces the NASA Sun direction (cosine of the angle between them).
- The training completes once the player picks an orientation within ~10 degrees of the Sun (about 98%+ simulated output), with a short "what you learned" message.
- The card shows: NASA source link (Horizons API + docs), the exact request used, observation time, fetched time, the real values, and a clear "Simulated power — game calculation, not a NASA measurement" label. If NASA can't be reached it shows the last verified copy tagged "Cached copy"; if there's none, the real error and no numbers.
- The training checklist and counter become 8 items (e.g. "Training 3/8").

## What stays untouched
- Lunar Outpost: no new station, task or alert. The 16 lunar tasks and 800 XP scoring are not changed (training awards no mission XP).
- All existing stations, NASA cards (OSDR, RadLab, DONKI, EPIC), rover, controls.

## Technical details
- New `"solar"` ActivityKind, added to `TRAINING_STATIONS` only; Activities.tsx gets a `SolarGame` + META entry. The lunar mission never references it.
- Server function `getSunFromMoon` in `src/game/nasa/nasaLabs.functions.ts` (public, read-only) calls `https://ssd.jpl.nasa.gov/api/horizons.api` with `COMMAND='10'`, `EPHEM_TYPE='OBSERVER'`, `CENTER='coord@301'`, `COORD_TYPE='GEODETIC'`, `SITE_COORD='23.47,0.67,0'`, `QUANTITIES='4'` (azimuth/elevation), a fixed archived date range, `STEP_SIZE='1 h'`, `format=json`.
- Parser in `nasaLabs.ts` reads the `$$SOE…$$EOE` block, validates dates and numeric ranges (az 0–360, el −90–90), rejects anything else. Browser caches the last verified copy in localStorage, same pattern as the existing labs.
- Unit tests: parser against a real saved Horizons response fixture, rejection of malformed output, the power formula, and that `"solar"` is absent from lunar tasks and the 800 XP total.
- Verify: live API call, open station, complete it, checklist shows 8/8 progress; screenshots desktop, phone portrait and landscape. Report whether real NASA data came back.
