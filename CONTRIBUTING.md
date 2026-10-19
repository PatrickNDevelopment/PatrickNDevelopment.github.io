# Contributing

1. `npm ci`, then `npm run verify` before you push.
2. Content changes go in `src/content/`. Every claim must come from the project's own README,
   `docs/test-report.md` or the portfolio registry. Do not add performance figures, users,
   employers or certifications that are not documented.
3. Add `repo`/`demo` links only after the repository and its Pages site are actually published and
   checked; the unit tests enforce the URL shape and that unpublished projects have none.
4. Screenshots must come from the implemented applications (`<project>/docs/screenshots/`), named
   `<slug>--<file>.png` in `public/screens/`; every bundled screenshot must be used.
5. Personal contact details (e-mail, LinkedIn, résumé) only with the owner's explicit approval.
6. Regenerate this site's own screenshots with `SHOTS=1 npx playwright test screens` after UI
   changes, and look at them.
