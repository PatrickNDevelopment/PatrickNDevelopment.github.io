# Handoff

**State:** v0.1 on branch `phase/11a-build`, built on 2026-10-19 and accepted by the independent site
audit (prompt 11B) the same day: 4 P1 and 7 P2 defects fixed with regression tests (see
[site-audit.md](site-audit.md) and [test-report.md](test-report.md)). Published 2026-10-19 with the
owner's approval (D-007): https://github.com/PatrickNDevelopment/PatrickNDevelopment.github.io
(branch `main`), live at https://patrickndevelopment.github.io/.

## Run

```powershell
npm ci
npm run dev          # builds, then serves http://localhost:5182/
npm run verify       # full gate (or scripts\verify.ps1 / scripts/verify.sh)
SHOTS=1 npx playwright test screens   # regenerate docs/screenshots
```

## What works (covered by tests)

Static home page, ten project pages (four full case studies), 404 page, sitemap, robots, metadata;
link audit, heading, image, keyboard, mobile and 404/redirect tests; content guards; local registry
consistency check.

## What is absent

- No personal contact details beyond the GitHub profile (none authorized).

## Updating after a project is published

Set `status: 'published'`, `repo`, `demo`, `verified` and `commit` in `src/content/projects.ts`; run
`npm run verify` (the registry check must agree).

## Publication

CI and the Pages deployment were green on the first run. A live check found every page at HTTP
200, unknown paths at 404, the trailing-slash redirect, the canonical URL and every outbound
repository and demo link resolving.

## Next action

Keep `src/content/` in step with the projects (the registry check helps); the final
cross-portfolio audit (prompt 13) is next.
