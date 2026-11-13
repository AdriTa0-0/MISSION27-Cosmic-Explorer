<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Mission XP comes only from the per-key `awarded` ledger in store.ts (one entry per task/alert); task + best-alert XP must sum to MAX_MISSION_XP, enforced by xpAndSpeed.test.ts. Why: prevents duplicate rewards and over-cap scores.
- NASA lab data (OSDR OSD-766, RadLab) is fetched only through public read-only server functions in src/game/nasa/nasaLabs.functions.ts, validated by parsers in nasaLabs.ts (Horizons Sun data: horizons.ts, Earth Training only) and cached in memory plus the browser's last verified copy; never bundle invented fallback values. Why: archived NASA records must be real and clearly labelled cached/archived.
- src/start.ts registers no Supabase auth function middleware because no backend is connected. Why: the attacher throws on missing env vars and breaks every server function.
