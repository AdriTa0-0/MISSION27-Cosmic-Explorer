# MISSION27 Rover, Speed and XP update

## What the ZIP contains
The ZIP reads fully (235 files). Only 7 game files differ from your current game: the rover model, the rover controls and their tests, the game rules file, the Moon world scene, the mission screen and the end report. Packages are identical. Nothing is missing, so I won't need placeholders.

## What the ZIP already does
- New six-wheel lunar rover with suspension, solar panel, sensors and antenna. The face is gone.
- Faster top speed (4 to 8), with a speed dial from 20 to 100% that starts at 65%, and Shift/Stop to brake.
- The HUD and report show "/ 800 XP".

## Gaps I will fix on top of the ZIP
1. **XP is only capped in the ZIP, not fixed.** Its own notes say rewards can still add up past 800 and are just stopped at 800. That's the "visual cap" you asked me not to use. The real cause: the 16 tasks are worth 530 XP and the 6 alerts are worth up to 430, so a perfect run reaches about 960 to 980.
   - Each reward gets an ID (task or alert). The game remembers which IDs it has paid, so no reward can pay twice, even after retries or reloading a save.
   - Alert rewards are scaled so the best answers add up to exactly 270. That makes 530 + 270 = 800. Each alert keeps its own ranking (fast beats slow, safe beats risky).
   - Saved games get recalculated from the tasks and alerts they've actually finished, so old saves showing more than 800 are corrected.
   - The HUD, task messages and end report all read the same total.
2. **Speed-risk levels are missing.** I'll add a badge to the speed dial: Safe (20–65%), Caution (66–85%) and High Risk (86–100%). At High Risk, a warning about tipping and losing grip appears. If you keep driving that fast (especially while turning), the rover slows itself down. The mission never fails because of speed.
3. **Mobile:** I'll check that the speed dial doesn't cover the GO/BACK/LEFT/RIGHT/STOP buttons when the phone is upright or sideways.

## Unchanged
All 16 tasks, the missions, the NASA data and pictures, sample photos, the Earth camera, the rover map, retries, the crew conflict, controls, learning content and finishing early.

## Verification
- Install packages, run all tests and the full build, and fix any errors.
- New tests for: the 800 maximum on a perfect run, no double rewards, corrected old saves, the speed-level limits, and the automatic slowdown.
- Check the preview on desktop and on a phone, upright and sideways. I'll look at the rover's appearance, driving, the speed dial, the warnings, the touch buttons, and the final XP in the HUD and report.

## Technical notes
- `store.ts`: add `awarded: string[]` on Mission. `awardOnce(key, xp)` replaces direct `addXp` calls in `completeObjective` and `resolveEmergency`. Add an `EMERGENCY_XP` table that sums to 270 at best outcomes. When loading a save, recompute `xp` from `done` and the resolved log.
- `roverControls.ts`: add `speedRisk(setting)`, which returns safe, caution or high, plus an assist that limits speed under sustained high-risk driving or sharp turns.
- `LunarMission.tsx`: show the risk badge and warning, and position the dial so it doesn't overlap the touch pad.
