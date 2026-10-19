# Test report

## Build verification (prompt 11A), 2026-10-19

Environment: Windows 10, Node 24, Microsoft Edge (Playwright `msedge` channel), Windows PowerShell
5.1. Branch `phase/11a-build`.

`powershell -ExecutionPolicy Bypass -File scripts/verify.ps1` → **exit 0**:

| Step                                | Result                                                                                             |
| ----------------------------------- | -------------------------------------------------------------------------------------------------- |
| `npm ci`                            | 0 vulnerabilities                                                                                  |
| `format:check`, `lint`, `typecheck` | clean                                                                                              |
| `npm test` (Vitest)                 | 7 passed                                                                                           |
| `build`                             | 12 pages prerendered into `dist/` (home, 10 project pages, 404) plus sitemap, robots, `.nojekyll`  |
| `secrets`                           | no findings                                                                                        |
| `registry`                          | 10 projects match `portfolio-control/projects.json` (status, commit, demo URL)                     |
| `e2e` (Playwright)                  | 6 passed against `dist/` served like GitHub Pages; the screenshot spec is skipped unless `SHOTS=1` |

### Unit tests (`tests/content.test.ts`)

Exactly four featured projects in order; links only for published projects and only to their own
repository and Pages URL; unpublished project data never says "deployed" or "live demo"; every
screenshot comes from its project and every bundled screenshot is used; every case study has a
challenge, at least three choices and results, and every project a limitation, commit and date; each
rendered page has one `h1`, `lang`, Open Graph image and no `<script>`; the unpublished SceneForge
page states its status and has no repository link; head attributes are escaped.

### Playwright (`e2e/site.spec.ts`)

1. Link audit over all 12 pages: every internal link and `#anchor` resolves (HTTP 200, target id
   present); external links are only the GitHub profile and the three published repositories and
   demos.
2. Unpublished project page: status and "No public link yet", no repository link; ProfitLab's demo
   link points at its Pages URL.
3. Every page: one `h1`, no skipped heading level, every image has alt text and size and loads,
   description, Open Graph image and canonical URL, no scripts.
4. Unknown path returns status 404 with the 404 page and a working way back; `/projects/profit-lab`
   redirects (301) to the trailing-slash URL; sitemap has 11 URLs; robots names the sitemap.
5. Keyboard: the first Tab reaches "Skip to content", which moves to the main content; the brand link
   follows.
6. No horizontal scrolling at 320 and 375 px on any page; reduced motion turns smooth scrolling off.

### Screenshots (inspected)

`docs/screenshots/`: home, work, approach, case study (RecruitRadar), project page (TopicPulse, full
page) and 404 at 1280 px; home, work and case study (SourceTrace) at 375 px.

### Not verified

- The site is not published; CI and the Pages workflow have never run; external links were not
  fetched by the tests (they were checked against the registry's published list).
- No Firefox, Safari or screen-reader session.
