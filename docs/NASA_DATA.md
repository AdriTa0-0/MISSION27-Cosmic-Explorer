# NASA data in MISSION27

## Play the data features

| Source | Where to see it | Effect in play |
| --- | --- | --- |
| [LRO LOLA](https://science.nasa.gov/mission/lro/data-products/) | Start Mission, then visit Shackleton Survey Point northwest of the outpost | Two processed Shackleton elevation tiles shape the terrain. The field scan reads elevation and estimates slope from the 5 m source grid. Grades affect walking and rover speed. |
| [NASA DONKI](https://kauai.ccmc.gsfc.nasa.gov/DONKI/view/SEP/30717/1) and [NOAA SWPC report 132](https://www.spaceweatherlive.com/en/archive/2024/05/11/rsga.html) | Command Module during the solar particle alert at H15:30, after earlier alerts are cleared | The May 11, 2024 STEREO-A event and linked X5.8 flare drive the replay. The separately recorded GOES proton peak of 116 pfu above 10 MeV scales the simulated safety penalty. Sending crew to shelter reduces the exposure index. |
| [LRO CRaTER calibrated energy](https://pds-ppi.igpp.ucla.edu/data/LRO-L-CRAT-3-CDR-CALIBRATED-V1.0/DATA/2009/2009183/) | Expand **Inspect CRaTER detector replay** during the radiation activity | Step through four archive rows from July 2, 2009 and identify the detector with the highest recorded energy. Channels with zero pulse amplitude are displayed as “No pulse.” The readings are detector energy in keV from a separate observation date. |
| [Lunar south pole environment](https://www.nasa.gov/reference/moonbase-environment/) | Power Station, including the power failure activity | A simulated low Sun is compared with the horizon computed from the terrain. Direct illumination changes scene lighting, reserve gain and the load-planning budget. |
| [ECLSS water recovery demonstration](https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/) | Habitat panel and Water meter | The ISS 98% demonstration value sets the game’s recovery fraction. Low base power stops recycling and the water reserve falls faster. |
| [NASA OSDR OSD-269](https://osdr.nasa.gov/bio/repo/data/studies/OSD-269) | Greenhouse during the crop stress alert at H07:00 | Restore red romaine lighting to approximately 200 µmol/m²/s. The light panel displays the experiment’s 12:3:1 red, blue and green channel ratio. Water and nutrient ranges are game parameters. |
| [LRO LEND study](https://ntrs.nasa.gov/api/citations/20140005994/downloads/20140005994.pdf) | Second step at Shackleton Survey Point | Compare the published ranges for neutron suppression at Shoemaker and Cabeus to choose a follow-up hydrogen survey target. |
| [NASA EMU 3D model](https://science.nasa.gov/3d-resources/extravehicular-mobility-unit/) | Airlock suit check | Rotate NASA/Michael D. Carbajal’s EMU model while checking oxygen, cooling and battery. The model and decoder ship with the game. |
| [NASA EVA database, record 32](https://data.nasa.gov/dataset/extra-vehicular-activity-eva-us-and-russia) | Airlock battery selection | The first Apollo 17 EVA’s 7 h 12 min is the benchmark used to calculate the game's illustrative battery runtimes for a 390-minute sortie. |
| [JPL Lunar Surface Operations Simulator](https://robotics.jpl.nasa.gov/what-we-do/research-tasks/lunar-surface-operations-simulator-lsos/) | Walk or drive across grades and check base power | The coupling between terrain, rover travel and base power follows the operations described by LSOS. The code and operating parameters are MISSION27’s simulation. |
| [NASA DSCOVR EPIC](https://epic.gsfc.nasa.gov/about/api) | Earthrise Ridge, northeast of the outpost | Aim the 3D field camera, focus and capture a simulated lunar view using an archived May 10, 2024 EPIC image. The captured picture and source frame are recorded. |

## Asset provenance and simulation choices

- The Shackleton DEM windows and EPIC frames were supplied in the team's second game archive. The elevation source is the NASA Moon Trek Site04 Shackleton Rim DEM, `Site04_final_adj_5mpp_surf.tif`. Credit Barker et al., [Improved LOLA Elevation Maps for South Pole Landing Sites](https://doi.org/10.1016/j.pss.2020.105119). The supplied tiles contain interpolated values. The game resizes and blends the tiles and levels the base pad. The field scanner reports source-grid measurements from the corresponding local window.
- The regolith color, normal and roughness maps are from Poly Haven’s [Moon 02](https://polyhaven.com/a/moon_02), CC0, supplied by the team. The separate Earth sky disc was supplied by the team and matches NASA’s [2012 Blue Marble, Suomi NPP VIIRS composite](https://science.nasa.gov/photojournal/earth/). Its size and bearing are set for the opening view and are illustrative. The EPIC frames in the camera activity are archived DSCOVR observations.
- Mission alert times, radiation shielding effects, array output, resource changes and suit runtime are game mechanics. The illumination uses a compressed Sun path and the game’s rescaled terrain.
- MISSION27 is a team project for the NASA Space Apps Challenge.

## Task and launch audit (updated)

The uploaded source already contained all 16 mission objectives, including Earth photography and the two-stage LOLA/LEND survey. No missing objective definition was found. The previous HUD exposed only three unfinished tasks at a time; the new All 16 tasks button exposes the complete checklist and lets the player choose a green destination marker. Emergency destinations remain higher priority. Completing a tracked objective restores automatic guidance.

Earth photography: open All 16 tasks, choose Photograph Earth, finish Airlock checks if needed, travel to Earthrise Ridge, and use the interaction prompt. Aim at Earth, focus, balance exposure, then capture and save. This is a rendered scene using archived imagery, not a live photograph from the Moon.

All eleven source categories listed above remain represented. LSOS is a design reference, not an imported executable or numerical dataset. ECLSS, illumination, EVA battery endurance and shielding include game models; they should not be presented as direct measurements of this fictional base. This update preserves the existing datasets and does not fabricate additional NASA records.

Startup now preloads lunar textures on the home screen, removes the artificial launch timeout, displays loading progress until the scene mounts and renders, and holds the mission timer during loading. Initial asset download and GPU compilation still depend on the device and connection.

## Field update: sample photographs and camera

The five photographs and metadata from the supplied companion project are now bundled
under `public/reference-assets/samples` and `public/reference-assets/data/samples.json`.
Collection opens the related comparison cards; Tasks → Review collected samples reopens them.
They are historical Apollo reference images, not samples returned from Shackleton and not
proof that a simulated basalt/highland site is the same numbered Apollo specimen.
NASA's Apollo 11 catalogue identifies 10009 as microbreccia and its contingency sample
account identifies 10026 as regolith breccia:
- https://ntrs.nasa.gov/api/citations/19780010031/downloads/19780010031.pdf
- https://nasa.gov/wp-content/uploads/static/history/alsj/a11/a11ContingencySample.html
- https://www.lpi.usra.edu/lunar/samples/atlas/compendium/10009.pdf
- https://www.lpi.usra.edu/lunar/samples/atlas/compendium/10026.pdf

Exact source photograph IDs for the remaining companion images are not independently
confirmed; those cards state this. General NASA educational links explain the subject,
not an invented exact-photo provenance.

Earth photography now captures the rendered scene as JPEG. The viewfinder reads the
same bearing/altitude used to render Earth, requires centering, focus and balanced
exposure, and stores the captured image with the mission. The camera mode swaps the ordinary Blue Marble sky disc for an archived EPIC frame; the lunar viewpoint, apparent size and exposure/focus controls are
educational game approximations, not a live NASA lunar camera.

The rover map shades the loaded LOLA-derived height field and plots actual game
coordinates. It is not a georeferenced traverse plan. All 70 companion assets are
preserved. The companion rover GLB is retained as a reference asset; the current driving rover is a rounded procedural educational model. Its embedded origin says Sketchfab; do not call it
a verified NASA model. Existing NASA EMU suit viewing remains available separately.

## Young Explorer pacing and attribution
The first crew-conflict alert is now H01:00 (30 active seconds), and power is H04:00.
The NASA CCMC DONKI radiation replay remains H15:30, after earlier alerts clear.
Its event ID and linked X5.8 flare were checked against the official DONKI record.
The associated separate NOAA GOES observation remains explicitly labelled.
Activities now show short NASA-science explanations and source links alongside play.
Star sparkle and the rounded rover design are artistic styling, not scientific data.
All objectives plus no active alert ends the mission early; players need not wait for
incidents that have not happened yet.
