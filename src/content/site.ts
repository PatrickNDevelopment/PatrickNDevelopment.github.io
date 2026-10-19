/** Site-wide facts. Only details the owner has confirmed are public appear here. */

export const SITE = {
  handle: 'PatrickNDevelopment',
  /** Confirmed GitHub account (portfolio decision D-005). */
  github: 'https://github.com/PatrickNDevelopment',
  /** The account's user site; this is where the build is meant to be served. */
  origin: 'https://patrickndevelopment.github.io',
  title: 'PatrickNDevelopment · tested web software',
  description:
    'Case studies of browser applications and small Python services built around exact arithmetic, traceable evidence and deterministic behaviour, each with its tests and an independent acceptance review.',
};

export const SKILLS: { area: string; items: string[]; evidence: string }[] = [
  {
    area: 'Frontend',
    items: ['TypeScript (strict)', 'React', 'Vite', 'accessible HTML and CSS', 'SVG'],
    evidence: 'All ten projects; SceneForge and SignalScope draw their own SVG.',
  },
  {
    area: 'Backend',
    items: ['Python', 'FastAPI', 'SQLite', 'SQLAlchemy and Alembic', 'Pydantic'],
    evidence:
      'Optional local services in RecruitRadar (SQLAlchemy and Alembic), SourceTrace, ScriptAudit and TopicPulse (SQLite with ordered migrations).',
  },
  {
    area: 'Testing',
    items: [
      'Vitest',
      'pytest',
      'Playwright',
      'golden vectors',
      'differential fuzzing',
      'reference models',
    ],
    evidence: 'Every project has a one-command verification script that fails loudly.',
  },
  {
    area: 'Data handling',
    items: [
      'zod and Pydantic schemas',
      'CSV import with line-level errors',
      'exact decimal money',
      'versioned local storage with recovery',
    ],
    evidence: 'ProfitLab, RecruitRadar, SourceTrace, SignalScope, TopicPulse.',
  },
  {
    area: 'Delivery',
    items: ['GitHub Actions CI', 'GitHub Pages', 'static builds under a sub-path'],
    evidence: 'ProfitLab, RecruitRadar and SourceTrace are published with CI and Pages.',
  },
];

export const APPROACH: { title: string; body: string }[] = [
  {
    title: 'Testing',
    body: 'Each project ships unit tests and browser tests of its main user journeys against the production build, and most start from a written specification. Where the logic matters most, a second implementation checks the first: a BigInt reference model for money, two independent engines held together by golden vectors and fuzzing, byte-for-byte golden SVG output, exact replay of an event ledger.',
  },
  {
    title: 'Independent acceptance',
    body: 'After each build, a separate review session that did not write the code re-runs everything from a clean clone, tries to break the main journeys, and fixes what it finds with regression tests. The findings are listed in each repository’s test report.',
  },
  {
    title: 'Data validation',
    body: 'Imported files, stored workspaces and API responses are treated as untrusted: strict schemas, size limits, line-numbered errors, and missing values kept missing instead of becoming zero.',
  },
  {
    title: 'Responsible AI',
    body: 'The code was implemented with Claude Code under my specification and review, and each repository says so in AI_ASSISTANCE.md. Inside the apps, AI is optional and off by default; where it exists it only suggests drafts that a person must accept, and nothing claims to verify truth or predict outcomes.',
  },
];
