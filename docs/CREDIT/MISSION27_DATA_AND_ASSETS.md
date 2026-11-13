# MISSION27 — NASA Data and Asset Provenance

This document explains which NASA sources, third-party assets, supplied project
assets, and game-authored models are used by MISSION27 — Cosmic Explorer. It also
records where each feature appears in the game and what is simulated rather than
measured.

## How to read this document

MISSION27 is an educational game, not a live lunar telemetry system. The project
uses a mixture of archived observations, published research and experiment
parameters, reference assets, and game models. A source appearing in the game
does not mean that the game is receiving live data or reproducing NASA software.

| Label | Meaning in MISSION27 |
|---|---|
| Archived observation | A historical measurement or image bundled with the game. |
| Published reference | A NASA or scientific publication used to inform a mechanic, explanation, or comparison. |
| Supplied asset | A file provided with the team/project archive and retained in the build. |
| Game model | A simplified rule, visual, or value created for play and learning. |
| Reference-only asset | Bundled for context or attribution but not used as the active gameplay model. |

## NASA sources in the game

| Source | Type | Where to see it | What it does in play |
|---|---|---|---|
| [LRO LOLA](https://science.nasa.gov/mission/lro/data-products/) and the supplied Shackleton DEM | Archived terrain data | Start Mission → Shackleton Survey Point, northwest of the outpost | Two processed elevation tiles shape the terrain. The scanner reads elevation and estimates slope from the 5 m source grid; grades affect walking and rover speed. |
| [NASA DONKI SEP record](https://kauai.ccmc.gsfc.nasa.gov/DONKI/view/SEP/30717/1) | Archived space-weather event | Command Module during the H15:30 solar-particle alert | Replays the 11 May 2024 STEREO-A event associated with an X5.8 flare. Crew shelter decisions change the simulated exposure index. |
| [NOAA SWPC report 132](https://www.spaceweatherlive.com/en/archive/2024/05/11/rsga.html) | Archived supporting observation | Solar-particle alert | The separately labelled GOES proton peak of 116 pfu above 10 MeV scales the game’s exposure model; it is not presented as a DONKI measurement. |
| [LRO CRaTER calibrated energy](https://pds-ppi.igpp.ucla.edu/data/LRO-L-CRAT-3-CDR-CALIBRATED-V1.0/DATA/2009/2009183/) | Archived detector data | Radiation activity → Inspect CRaTER detector replay | Players inspect four archive rows from 2 July 2009 and identify the detector with the highest recorded energy. Zero pulse amplitude is shown as “No pulse.” |
| [Lunar south-pole environment](https://www.nasa.gov/reference/moonbase-environment/) | Published reference | Power Station and power-failure activity | A simulated low Sun is compared with a terrain-derived horizon. Illumination affects scene lighting, reserve gain, and the load-planning budget. |
| [ECLSS water-recovery demonstration](https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/) | Published experiment result | Habitat panel and Water meter | The ISS 98% demonstration value sets the game’s recovery fraction. Low base power stops recycling and drains the water reserve faster. |
| [NASA OSDR OSD-269](https://osdr.nasa.gov/bio/repo/data/studies/OSD-269) | Published experiment parameters | Greenhouse crop-stress alert at H07:00 | Players restore red-romaine lighting to approximately 200 µmol/m²/s using the experiment’s 12:3:1 red/blue/green ratio. Water and nutrient ranges are game parameters. |
| [LRO LEND study](https://ntrs.nasa.gov/api/citations/20140005994/downloads/20140005994.pdf) | Published research | Second step at Shackleton Survey Point | Players compare neutron-suppression ranges for Shoemaker and Cabeus and choose a follow-up hydrogen survey target. |
| [NASA EMU 3D model](https://science.nasa.gov/3d-resources/extravehicular-mobility-unit/) | NASA reference model | Airlock suit check | Players rotate the EMU while checking oxygen, cooling, and battery. The model and Draco decoder files ship with the game. |
| [NASA EVA database, record 32](https://data.nasa.gov/dataset/extra-vehicular-activity-eva-us-and-russia) | Historical mission record | Airlock battery selection | Apollo 17 EVA duration of 7 h 12 min is used as a benchmark for illustrative battery runtimes for a 390-minute sortie. |
| [JPL Lunar Surface Operations Simulator](https://robotics.jpl.nasa.gov/what-we-do/research-tasks/lunar-surface-operations-simulator-lsos/) | Design reference | Walking/driving across grades and base-power checks | The relationship between terrain, rover travel, and base power is inspired by the published operations concept. MISSION27’s code and parameters are its own educational simulation. |
| [NASA DSCOVR EPIC](https://epic.gsfc.nasa.gov/about/api) | Archived Earth imagery | Earthrise Ridge → Photograph Earth | The field camera uses an archived 10 May 2024 EPIC frame. The player must aim, focus, balance exposure, capture, and save the rendered scene. |

All eleven source categories remain represented in the game. The Handbook and
Operations Console expose the source links and explain whether each item is an
archived observation, reference, asset, or model.

## Asset provenance and integration

### Terrain, Earth, and surface materials

- `textures/shackleton-local-h16.bin` and
  `textures/shackleton-regional-h16.bin` are supplied Shackleton DEM tiles. The
  source is the NASA Moon Trek Site04 Shackleton Rim DEM,
  `Site04_final_adj_5mpp_surf.tif`; credit Barker et al.,
  [Improved LOLA Elevation Maps for South Pole Landing Sites](https://doi.org/10.1016/j.pss.2020.105119).
  The supplied tiles contain interpolated values. The game resizes and blends
  them and levels the base pad; the scanner reports values from the corresponding
  local window.
- `textures/moon-regolith-color.jpg`, `textures/moon-regolith-normal.webp`, and
  `textures/moon-regolith-rough.jpg` use Poly Haven’s [Moon 02](https://polyhaven.com/a/moon_02)
  material, licensed CC0 and supplied with the team archive.
- `textures/earth-disc.png` is a supplied Earth sky-disc asset matching the
  [2012 Blue Marble Suomi NPP VIIRS composite](https://science.nasa.gov/photojournal/earth/).
  Its size, bearing, and placement are illustrative.
- `textures/starfield.hdr` and the star sparkle effects are visual styling, not
  scientific measurements.
- The EPIC files listed below are archived DSCOVR images used by the Earth camera;
  they are not live images from the Moon.

### Models and gameplay props

- `models/lunar_rover.glb` is retained as a reference asset. The active driving
  rover is a rounded, procedural, child-friendly model created for MISSION27; it
  is not a NASA rover model.
- The EMU model is used separately in the Airlock activity and is credited to
  NASA/Michael D. Carbajal as described in the in-game source panel.
- `props/*` contains supplied reference illustrations for rover orientation,
  astronaut training, lunar terrain, suit inspection, and related activities.
- `video/galaxy.mp4` is a bundled visual reference/presentation asset.

### Sample collection

The five sample images and metadata are used by the sample panels and gallery:

- `samples/sample_1.jpg`
- `samples/sample_2.jpg`
- `samples/sample_3.jpg`
- `samples/sample_4.jpg`
- `samples/sample_5.jpg`
- `data/samples.json`

These are historical Apollo reference images, not samples returned from Shackleton.
They do not prove that a simulated basalt/highland site is the same numbered Apollo
specimen. NASA’s Apollo 11 catalogue identifies sample 10009 as microbreccia and
the contingency sample account identifies 10026 as regolith breccia:

- [Apollo 11 preliminary science report](https://ntrs.nasa.gov/api/citations/19780010031/downloads/19780010031.pdf)
- [Apollo 11 contingency sample account](https://nasa.gov/wp-content/uploads/static/history/alsj/a11/a11ContingencySample.html)
- [Lunar sample compendium — 10009](https://www.lpi.usra.edu/lunar/samples/atlas/compendium/10009.pdf)
- [Lunar sample compendium — 10026](https://www.lpi.usra.edu/lunar/samples/atlas/compendium/10026.pdf)

Exact source photograph IDs for the remaining companion images are not independently
confirmed; the relevant cards state that limitation. General NASA educational links
explain the subject but are not presented as exact-photo provenance.

### Reference data and interface assets

The following bundled JSON files support dialogue, handbook content, scenarios,
story, NASA fallbacks, terrain, storm replay, and EPIC references:

`data/dialogue.json`, `data/epic-2024-05-10.json`, `data/handbook.json`,
`data/moon-terrain.json`, `data/nasa-fallback.json`, `data/samples.json`,
`data/scenarios.json`, `data/shackleton-rim-profile.json`, `data/storm-record.json`,
and `data/story.json`.

The supplied SVG interface icons include navigation, mission state, life-support
resources, power, radiation, settings, sound, warnings, and save/restart actions.
They are presentation assets, not NASA scientific data. The full set is retained
under `public/reference-assets/icons/`.

## What is simulated

The following are game mechanics or educational approximations:

- mission alert timing and resolution outcomes;
- radiation shielding and exposure penalties;
- solar-array output, reserve gain, and resource consumption;
- suit-runtime calculations and battery choices;
- water and nutrient ranges in the greenhouse;
- the compressed Sun path and terrain-based illumination;
- rover speed effects and the map’s non-georeferenced coordinate display;
- Earth-camera viewpoint, apparent size, focus, exposure, and the captured JPEG;
- the 27-hour mission clock and early completion rules.

The rover map shades the loaded LOLA-derived height field and plots game
coordinates; it is not a georeferenced traverse plan. LSOS is a design reference,
not imported executable code or numerical simulation software.

## Task and launch audit

The source contains all 16 mission objectives, including Earth photography and the
two-stage LOLA/LEND survey. The **All 16 tasks** view exposes the full checklist
and lets the player choose a green destination marker; emergency destinations take
priority. Completing a tracked objective restores automatic guidance.

To complete Earth photography, choose **Photograph Earth**, finish Airlock checks
if required, travel to Earthrise Ridge, aim the 3D camera at Earth, focus, balance
exposure, and capture/save the image. This is a rendered scene using archived
imagery, not a live lunar photograph.

The first crew-conflict alert is scheduled at H01:00 (30 seconds of active play),
power follows at H04:00, and the DONKI radiation replay occurs at H15:30 after
earlier alerts clear. Activities show short science explanations and links beside
the relevant gameplay.

## Attribution and limitations

MISSION27 is an independent team project for the NASA Space Apps Challenge. It is
not affiliated with or endorsed by NASA. NASA names, links, datasets, and models
are used for educational context and attribution. The project does not claim live
telemetry, NASA certification, physical-device performance, or that its simplified
models reproduce real lunar operations.
