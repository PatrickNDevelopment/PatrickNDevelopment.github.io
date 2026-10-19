# Handoff

**State:** v0.1 on branch `phase/11a-build`, built and verified by the builder on 2026-10-19 (see
[test-report.md](test-report.md)). Not pushed, not published, no remote. Awaiting the independent
site audit (prompt 11B).

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
- No links for the seven unpublished projects.
- Not published; CI and Pages never run.

## Updating after a project is published

Set `status: 'published'`, `repo`, `demo`, `verified` and `commit` in `src/content/projects.ts`; run
`npm run verify` (the registry check must agree).

## Release blockers before publication

1. Independent site audit (11B).
2. Owner answers to the open questions in [implementation-report.md](implementation-report.md) and
   explicit approval to create the repository and enable Pages.

## Next action

Run prompt 11B on this branch.
