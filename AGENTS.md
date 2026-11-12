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
