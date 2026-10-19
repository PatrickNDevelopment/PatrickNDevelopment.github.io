/**
 * Project facts for the site. Every statement here is taken from the project's own README,
 * docs/architecture.md, docs/test-report.md or the portfolio registry; links exist only for
 * repositories and demos that are actually published.
 */

export type Status = 'published' | 'accepted';

export interface Shot {
  file: string;
  alt: string;
  device: 'desktop' | 'mobile';
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  status: Status;
  featured: boolean;
  /** Only for published projects. */
  repo?: string;
  demo?: string;
  problem: string;
  features: string[];
  choices: string[];
  challenge?: { title: string; body: string };
  results: string[];
  stack: string[];
  limitations: string[];
  shots: Shot[];
  /** Date of the last recorded verification (ISO). */
  verified: string;
  commit: string;
}

const GH = 'https://github.com/PatrickNDevelopment';
const PAGES = 'https://patrickndevelopment.github.io';

export const PROJECTS: Project[] = [
  {
    slug: 'profit-lab',
    name: 'ProfitLab',
    tagline: 'Marketplace unit economics with exact decimal arithmetic and pass/fail gates.',
    status: 'published',
    featured: true,
    repo: `${GH}/profit-lab`,
    demo: `${PAGES}/profit-lab/`,
    problem:
      'A reseller deciding what to list needs projected profit per product after every fee, shipping cost and overhead share, and a clear yes/no against minimum profit and margin. Rounding drift or a blank cost silently treated as $0 makes a losing product look like a winner.',
    features: [
      'Editable product table with costs, prices, percentage and fixed fees, promoted-listing share and monthly units; sorting, filtering and bulk edit.',
      'Qualification gates (minimum net profit and margin); rows with missing inputs are marked incomplete and can never qualify or be ranked.',
      'Break-even price per product, optional markup-retention pricing, explicit overhead allocation.',
      'Scenarios compared side by side; CSV import with line-by-line validation; CSV and JSON export.',
      'Local persistence with schema validation, corruption recovery and a cross-tab notice.',
    ],
    choices: [
      'Money as decimal strings (decimal.js), each fee line rounded half-up to the cent, gates compared exactly: a displayed 15.00% that is really 14.996% must not pass.',
      'Break-even found by an exact scan of the one-cent band that per-line rounding can move.',
      'A blank cost means unknown, never zero; ranking only among qualifying rows.',
      'zod only at the persistence boundary; a small, fully tested CSV parser instead of a dependency.',
    ],
    challenge: {
      title: 'Proving the money math',
      body: 'The test suite re-implements the economics with BigInt integer cents, sharing no code with the decimal engine, and compares randomized scenarios and break-even cases against it. The independent review found break-even errors at high fee rates and CSV round-trip problems; each was fixed with a regression test.',
    },
    results: [
      '55 Vitest tests, including 1,500-scenario and 400 break-even BigInt-oracle suites.',
      '10 Playwright tests against the production build under /profit-lab/.',
      'Independent acceptance review: 9 defects found and fixed with regression tests.',
      'Published 2026-10-15: GitHub Actions CI green on Ubuntu, GitHub Pages deployed, live check passed.',
    ],
    stack: [
      'TypeScript',
      'React',
      'Vite',
      'decimal.js',
      'zod',
      'Vitest',
      'Playwright',
      'GitHub Actions',
    ],
    limitations: [
      'Projections only: no realized profit and no live marketplace data.',
      'Built-in fee tiers are illustrative examples, not an official fee schedule.',
      'Data stays in one browser (localStorage).',
    ],
    shots: [
      {
        file: 'profit-lab--desktop-products.png',
        alt: 'ProfitLab product table with qualification results',
        device: 'desktop',
      },
      {
        file: 'profit-lab--desktop-scenarios.png',
        alt: 'ProfitLab comparing two scenarios side by side',
        device: 'desktop',
      },
      {
        file: 'profit-lab--mobile-products.png',
        alt: 'ProfitLab product list on a phone',
        device: 'mobile',
      },
    ],
    verified: '2026-10-15',
    commit: '03fd70e',
  },
  {
    slug: 'recruit-radar',
    name: 'RecruitRadar',
    tagline: 'Hiring-market intelligence from public job postings, with an explainable score.',
    status: 'published',
    featured: true,
    repo: `${GH}/recruit-radar`,
    demo: `${PAGES}/recruit-radar/`,
    problem:
      'Public job postings are noisy: the same company appears under several names, roles are reposted, and a single number hides why a company looks active. A recruiter needs normalized postings, careful de-duplication and a score whose every part can be checked.',
    features: [
      'Radar of companies with role counts, role mix, locations, sources and signal age, plus a priority score with per-component breakdown and coverage.',
      'Missing information is listed and left out of the score, never counted as zero.',
      'CSV import with line-by-line errors, merge review for look-alike company names (never merged automatically), CSV exports with evidence.',
      'Connected mode (local FastAPI backend) refreshes public Greenhouse, Lever and Ashby boards with a recorded refresh history; failed refreshes never delete data.',
      'Local-data mode runs fully in the browser; this is what the published demo uses.',
    ],
    choices: [
      'The scoring and identity logic is one pure function, implemented twice and independently: Python for the backend and TypeScript for the browser, from one written spec.',
      'A third, standard-library-only oracle generates golden vectors; a seeded differential fuzzer compares all three implementations.',
      'FastAPI with SQLAlchemy 2 and Alembic on SQLite; Host guard, total provider deadline and busy-database handling added after review.',
    ],
    challenge: {
      title: 'Two implementations that must agree',
      body: 'The first differential fuzz run found 212 mismatches that the hand-written vectors had missed. Each was resolved from the spec text and recorded as a decision. The independent review later found that the Python and TypeScript CSV importers disagreed on eight input classes; they are now held to shared vectors and a second differential fuzz.',
    },
    results: [
      '706 Vitest and 1,578 pytest tests; ruff and mypy --strict clean.',
      'Golden vectors (47 analysis, 173 normalization) and differential fuzz: 948 analysis cases and 610 CSV cases, 0 mismatches.',
      '20 Playwright tests under /recruit-radar/.',
      'Independent acceptance review: 12 findings fixed with regression tests.',
      'Published 2026-10-15; the first CI run failed on a Linux file-permission lint, was fixed, then went green.',
    ],
    stack: [
      'TypeScript',
      'React',
      'Vite',
      'Python',
      'FastAPI',
      'SQLAlchemy',
      'Alembic',
      'SQLite',
      'pytest',
      'Vitest',
      'Playwright',
    ],
    limitations: [
      'The static demo cannot refresh from job boards; that needs the local backend.',
      'Scores are fixed-weight heuristics with no semantic title matching.',
      'Provider payload shapes come from documentation and a one-off live check; automated tests use synthetic payloads.',
    ],
    shots: [
      {
        file: 'recruit-radar--desktop-radar.png',
        alt: 'RecruitRadar radar of companies with priority scores',
        device: 'desktop',
      },
      {
        file: 'recruit-radar--desktop-company.png',
        alt: 'RecruitRadar company detail with score breakdown',
        device: 'desktop',
      },
      {
        file: 'recruit-radar--mobile-radar.png',
        alt: 'RecruitRadar radar on a phone',
        device: 'mobile',
      },
    ],
    verified: '2026-10-15',
    commit: '95a5478',
  },
  {
    slug: 'source-trace',
    name: 'SourceTrace',
    tagline: 'Claim and citation review with exact passages and a human-only approval gate.',
    status: 'published',
    featured: true,
    repo: `${GH}/source-trace`,
    demo: `${PAGES}/source-trace/`,
    problem:
      'Research notes drift away from their sources: a quote gets paraphrased, a citation points at the wrong paragraph, and nobody can say who approved a claim. Reviewers need every claim tied to the exact passage that bears on it, and a record of every decision.',
    features: [
      'Sources from pasted text, Markdown or text files, or text PDFs via the optional local backend; each stored with a SHA-256 content hash.',
      'Exact passages selected by mouse or keyboard; locators store code-point offsets and a context hash, so a changed source can never silently re-point a citation.',
      'A review state machine only a person can drive; approval is refused with precise reasons, and refused attempts are recorded in an append-only audit trail.',
      'Heuristic checks, labelled as heuristics: unsupported claims, mismatched citations, quotes or dates missing from the cited passage, duplicates.',
      'Traceable evidence report export (Markdown and JSON); optional opt-in AI assistant that can only suggest drafts.',
    ],
    choices: [
      'All review logic in one TypeScript engine so the static demo is fully usable; the backend only stores snapshots, extracts PDF text and brokers optional AI calls.',
      'Offsets in Unicode code points, not UTF-16 units or bytes; source text is immutable.',
      'Anything duplicated between TypeScript and Python is specified, covered by golden vectors and fuzzed.',
      'PDF extraction runs in an isolated, time-limited process because PDFs are untrusted input.',
    ],
    challenge: {
      title: 'An audit trail that cannot break the workspace',
      body: 'The independent review found that unbounded audit growth could make a saved workspace impossible to load, that the Markdown report rendered markup from sources, and that the TypeScript and Python JSON layers disagreed on deep nesting and huge integers. All were fixed with regression tests; the audit trail of a claim is now capped at 500 events.',
    },
    results: [
      '221 Vitest and 51 pytest tests; ruff and mypy --strict clean.',
      '218 hand-derived and golden vectors, fuzz seeds with 0 mismatches.',
      '29 Playwright tests under /source-trace/.',
      'Independent acceptance review: 7 defects fixed with regression tests.',
      'Published 2026-10-15: CI green on the first run (three jobs), Pages deployed, live check passed.',
    ],
    stack: [
      'TypeScript',
      'React',
      'Vite',
      'zod',
      'Python',
      'FastAPI',
      'SQLite',
      'pypdf',
      'Vitest',
      'pytest',
      'Playwright',
    ],
    limitations: [
      'It does not verify truth; its checks are heuristics.',
      'Text-only PDFs (no OCR); one workspace per browser; the local backend has no authentication.',
      'The AI assistant was tested only with a fake provider and mocked transport.',
    ],
    shots: [
      {
        file: 'source-trace--desktop-review.png',
        alt: 'SourceTrace side-by-side review of a claim and its cited passage',
        device: 'desktop',
      },
      {
        file: 'source-trace--desktop-sources.png',
        alt: 'SourceTrace list of sources with provenance',
        device: 'desktop',
      },
      {
        file: 'source-trace--mobile-review.png',
        alt: 'SourceTrace review stacked on a phone',
        device: 'mobile',
      },
    ],
    verified: '2026-10-15',
    commit: '98f4c51',
  },
  {
    slug: 'scene-forge',
    name: 'SceneForge',
    tagline: 'A deterministic procedural SVG studio for hand-drawn looking diagrams.',
    status: 'accepted',
    featured: true,
    problem:
      'Explainer videos need simple diagrams (stick figures, arrows, regions) that look hand-drawn, can be edited, and come out identical every time they are exported, so a revision does not change the drawing everywhere else.',
    features: [
      'Eight templates (for example siege, trade route, alliance formation, timeline) with your own faction names and colours.',
      'Canvas editor with drag, an inspector with labelled inputs, and full keyboard control.',
      'Movement and draw-on animation with a time slider; playback respects reduced-motion settings.',
      'Undo and redo (200 steps), strict scene JSON import, static or animated SVG export, presets.',
      'Visual QA: off-canvas objects, safe-area violations, label overlap and colour contrast.',
    ],
    choices: [
      'One model and one renderer: the canvas and the export come from the same SVG node tree.',
      'Determinism by construction: seeded random streams keyed by seed, style version, object id and stroke, so editing one object never changes another.',
      'Every edit is a pure, clamped function from scene to scene; history is a list of immutable scenes.',
      'Golden SVG tests pin the exact output.',
    ],
    challenge: {
      title: 'Identical output, every time',
      body: 'Hand-drawn jitter normally means randomness. Here every stroke comes from a seeded generator keyed by a stable object id, and golden tests compare exported SVG byte for byte. The independent review found six defects, including dashed arrows drawn solid and an infinite loop when duplicating objects with long ids; each was fixed with a regression test.',
    },
    results: [
      '40 Vitest tests including golden SVG tests.',
      '15 Playwright tests against the production build.',
      'Independent acceptance review on 2026-10-18: 6 defects fixed with regression tests; full verification re-run with exit code 0.',
    ],
    stack: ['TypeScript', 'React', 'Vite', 'zod', 'SVG', 'Vitest', 'Playwright'],
    limitations: [
      'Not yet published; CI has not run on GitHub yet.',
      'Illustrations, not maps; label sizes in visual QA are estimates because fonts differ by machine.',
      'Arrows and regions move as a whole (no point editing).',
    ],
    shots: [
      {
        file: 'scene-forge--desktop-editor.png',
        alt: 'SceneForge editor with a hand-drawn scene, object list and inspector',
        device: 'desktop',
      },
      {
        file: 'scene-forge--desktop-gallery.png',
        alt: 'SceneForge template and preset gallery',
        device: 'desktop',
      },
      {
        file: 'scene-forge--mobile-editor.png',
        alt: 'SceneForge editor on a phone',
        device: 'mobile',
      },
    ],
    verified: '2026-10-18',
    commit: '6dd1697',
  },
  {
    slug: 'workflow-observatory',
    name: 'Workflow Observatory',
    tagline: 'A state-machine studio: approvals, retries, idempotency keys, replay and comparison.',
    status: 'accepted',
    featured: false,
    problem:
      'Approval and job pipelines fail in subtle ways: a step skips its approval, a retry repeats a side effect, a replay gives a different answer. This simulator makes those rules executable and inspectable.',
    features: [
      'Workflow designer with live validation, revisions, approver roles, retry policies and failure destinations.',
      'Deterministic runtime: commands produce an event ledger; forbidden moves and approval bypasses are refused and recorded.',
      'Simulated jobs on a controllable clock with injectable faults; retries reuse the same idempotency key so side effects are not repeated.',
      'Replay, step-through, fork from a snapshot, side-by-side comparison and an invariant checker.',
    ],
    choices: [
      'Event sourcing with two checks: re-executing the commands must reproduce the stored ledger exactly, and folding the ledger alone must give the same state.',
      'Everything that looks like infrastructure is explicitly simulated in the page; no queue or network.',
    ],
    results: [
      '37 Vitest tests, including an exhaustive transition matrix and tamper detection; 8 Playwright tests.',
      'Independent acceptance review on 2026-10-19: 5 defects fixed with regression tests, including stale approvals after a reject-and-resubmit loop.',
    ],
    stack: ['TypeScript', 'React', 'Vite', 'zod', 'Vitest', 'Playwright'],
    limitations: [
      'Not yet published.',
      'Simulation only: no real queue or distributed execution; roles are labels, not identities.',
    ],
    shots: [
      {
        file: 'workflow-observatory--run-desktop.png',
        alt: 'Workflow Observatory run view with workflow diagram and simulation controls',
        device: 'desktop',
      },
    ],
    verified: '2026-10-19',
    commit: 'e506494',
  },
  {
    slug: 'signal-scope',
    name: 'SignalScope',
    tagline: 'Educational historical event studies with no look-ahead.',
    status: 'accepted',
    featured: false,
    problem:
      'Event studies are easy to get wrong by using information before it was public. SignalScope only uses an event from the first trading session after its publication and always shows the baseline and sample size.',
    features: [
      'CSV import of prices, probabilities and events with provenance and access level.',
      'Cumulative abnormal returns against a constant-mean baseline, exclusion reasons, overlap flags and sample-size badges.',
      'Indicators (volatility, RSI, volume shocks) and lagged correlations labelled as co-movement, never causation.',
    ],
    choices: [
      'Hand-built SVG charts; daily data with publication dates kept separate from event dates.',
      'Hand-computed reference values in the tests for RSI, volatility, volume z-scores and CAR.',
    ],
    results: [
      '54 Vitest tests and 15 Playwright tests.',
      'Independent acceptance review on 2026-10-18: 8 defects fixed, including a same-day probability leak into rule decisions.',
    ],
    stack: ['TypeScript', 'React', 'Vite', 'zod', 'SVG', 'Vitest', 'Playwright'],
    limitations: [
      'Not yet published. Descriptive and historical only: not investment advice, no forecasts or trading.',
      'Daily data only; sample and example data are synthetic.',
    ],
    shots: [
      {
        file: 'signal-scope--study-desktop.png',
        alt: 'SignalScope event study with mean abnormal return chart',
        device: 'desktop',
      },
    ],
    verified: '2026-10-18',
    commit: '7d9f0c8',
  },
  {
    slug: 'script-audit',
    name: 'ScriptAudit',
    tagline:
      'Four deterministic audits for video scripts, with suggestions accepted one at a time.',
    status: 'accepted',
    featured: false,
    problem:
      'A script draft needs checking for unsupported claims, loose narrative threads, hard-to-say sentences and packaging issues, with every change reviewable and reversible.',
    features: [
      'Grounding, narrative, spoken-readability and packaging audits with the reason for each finding.',
      'Suggestions accepted or rejected one at a time with a side-by-side diff; every change is a revision.',
      'Optional local backend for an opt-in AI explanation broker with a usage ledger.',
    ],
    choices: [
      'All audits run in the browser as transparent rules; the optional FastAPI backend only brokers AI explanations.',
      'AI rewrites are filtered so they cannot add numbers, superlatives, attributions or links.',
    ],
    results: [
      '64 Vitest and 31 pytest tests; 13 Playwright tests.',
      'Independent acceptance review on 2026-10-18: 9 defects fixed with regression tests.',
    ],
    stack: [
      'TypeScript',
      'React',
      'Vite',
      'zod',
      'Python',
      'FastAPI',
      'SQLite',
      'Vitest',
      'pytest',
      'Playwright',
    ],
    limitations: [
      'Not yet published. Rule-based and English-only; it does not verify facts or predict performance.',
      'The AI broker was tested only with a fake provider.',
    ],
    shots: [
      {
        file: 'script-audit--audits-desktop.png',
        alt: 'ScriptAudit audit findings next to the script',
        device: 'desktop',
      },
    ],
    verified: '2026-10-18',
    commit: '5b91084',
  },
  {
    slug: 'topic-pulse',
    name: 'TopicPulse',
    tagline: 'Explainable topic scoring from public counts, relative to each channel.',
    status: 'accepted',
    featured: false,
    problem:
      'Raw view counts favour big channels. TopicPulse scores topics from rates relative to each channel’s own recent median and shows exactly which videos feed each part of a score.',
    features: [
      'Synthetic sample channels or CSV import with a data-quality report.',
      'Topic clusters with visible evidence; five weighted score components with a full breakdown.',
      'Opportunity cards you approve, defer or reject; optional local backend for the YouTube Data API with a quota ledger and 30-day retention.',
    ],
    choices: [
      'All analysis in the browser; the backend exists only for the official API, its quota and retention rules.',
      'The API key stays server-side and is kept out of logs (a review finding).',
    ],
    results: [
      '37 Vitest and 21 pytest tests; 7 Playwright tests.',
      'Independent acceptance review on 2026-10-19: 10 defects fixed, every cluster score recomputed by hand.',
    ],
    stack: [
      'TypeScript',
      'React',
      'Vite',
      'zod',
      'Python',
      'FastAPI',
      'SQLite',
      'Vitest',
      'pytest',
      'Playwright',
    ],
    limitations: [
      'Not yet published. The live YouTube API path is untested with a real key.',
      'Scores describe observed public counts; they are not forecasts.',
    ],
    shots: [
      {
        file: 'topic-pulse--clusters-desktop.png',
        alt: 'TopicPulse topic clusters with score breakdown',
        device: 'desktop',
      },
    ],
    verified: '2026-10-19',
    commit: '6b3f427',
  },
  {
    slug: 'recruit-sim',
    name: 'RecruitSim',
    tagline: 'Branching recruiting practice with a transparent rubric.',
    status: 'accepted',
    featured: false,
    problem:
      'New recruiters need to practise difficult conversations (fee terms, discriminatory requests, consent) safely, with feedback they can trace back to specific choices.',
    features: [
      'Two authored branching scenarios with fictional participants and visible consequences.',
      'A six-dimension rubric showing the exact choices behind each band; no overall grade.',
      'Readiness checklist computed only from recorded choices; history export.',
    ],
    choices: [
      'Scenarios are validated data; a test requires every explanation to name a rubric dimension.',
      'Browser-only, no AI and no backend.',
    ],
    results: [
      '21 Vitest tests and 14 Playwright tests.',
      'Independent acceptance review on 2026-10-19: 8 defects fixed with regression tests.',
    ],
    stack: ['TypeScript', 'React', 'Vite', 'zod', 'Vitest', 'Playwright'],
    limitations: ['Not yet published. Authored branches only; not legal advice; English only.'],
    shots: [
      {
        file: 'recruit-sim--play-desktop.png',
        alt: 'RecruitSim conversation step with answer choices',
        device: 'desktop',
      },
    ],
    verified: '2026-10-19',
    commit: '01bee76',
  },
  {
    slug: 'story-atlas',
    name: 'StoryAtlas',
    tagline: 'An explorer for a fictional world, with a spoiler filter and content warnings.',
    status: 'accepted',
    featured: false,
    problem:
      'Readers and writers of a long story need a map of characters, events and places that never spoils what they have not read yet.',
    features: [
      'Relationship map with an equivalent table, timeline, atlas, glossary and chapter explorer.',
      'A spoiler filter applied to every reading page; content warnings that keep summaries collapsed.',
      'Editing with strict integrity rules; JSON import and export.',
    ],
    choices: [
      'The world is one validated JSON document with integrity checks on load, import and every edit.',
      'The bundled world is original placeholder fiction written for the demo.',
    ],
    results: [
      '17 Vitest tests and 10 Playwright tests.',
      'Independent acceptance review on 2026-10-19: fixes for spoiler leaks, integrity gaps and routing, each with a regression test.',
    ],
    stack: ['TypeScript', 'React', 'Vite', 'zod', 'SVG', 'Vitest', 'Playwright'],
    limitations: [
      'Not yet published. The map uses a simple circular layout suited to small casts.',
    ],
    shots: [
      {
        file: 'story-atlas--map-desktop.png',
        alt: 'StoryAtlas relationship map of the sample world',
        device: 'desktop',
      },
    ],
    verified: '2026-10-19',
    commit: '0a792af',
  },
];

export const featured = PROJECTS.filter((p) => p.featured);
export const secondary = PROJECTS.filter((p) => !p.featured);

export const STATUS_LABEL: Record<Status, string> = {
  published: 'Published',
  accepted: 'Accepted locally · not yet published',
};
