# Apply MISSION27 Field Update from the ZIP

The ZIP extracted cleanly (227 files). It is the same game with new and changed files; package dependencies are identical to the current project, so nothing new needs installing beyond a refresh.

## What changes (copied from the ZIP as-is)
- Updated game files: store, world, config, Lunar world, Lunar mission screen, Activities, Field Science, Report, compact-screen detection, NASA sources list, root page, styles.
- New files: camera system and camera controls, Earth photo camera, rover map, sample collection gallery, plus new tests (retry, Earth camera).
- New assets: `public/reference-assets/**` (sample photos, rover 3D model, textures, icons, data, video) and docs (ASSET_AUDIT, updated NASA_DATA), UPDATE_NOTES.md.
- Everything else already in the game stays as it is.

## Steps
1. Copy the update over the project, excluding `.git`, `node_modules` and build output; keep this project's pinned build tooling versions.
2. Refresh dependencies with bun.
3. Run all tests (notes say 22) and confirm the preview builds without errors.
4. Check in a headless browser at desktop and phone (portrait + landscape): start screen, enter the Moon mission, Ari near start, view controls, rover map, Earth camera opening, no sideways overflow on phone.
5. Report which UPDATE_NOTES checklist items were verified and which still need a real-device playthrough.

## If something fails
Fix only what's needed to build/run, without changing gameplay, and tell you what was changed.
