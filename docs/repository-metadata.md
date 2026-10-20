# Repository descriptions, topics and pinning (recommendations)

Descriptions are short, factual and avoid claims the code does not support. Descriptions and topics of the ten app repositories were applied at publication (2026-10-19). Apply changes with
`gh repo edit <repo> --description "…" --add-topic …` only after the owner approves; the site repository
is published last.

| Repository                    | Status        | Description                                                                                                                                                       | Topics                                                                 |
| ----------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| profit-lab                    | published     | Marketplace unit-economics analyzer with exact decimal math, break-even prices and pass/fail gates. Projections only.                                             | unit-economics, decimal, react, typescript, vite, playwright           |
| recruit-radar                 | published     | Hiring-market intelligence from public job postings: normalization, de-duplication and an explainable score; TypeScript and Python engines held equal by fuzzing. | job-postings, fastapi, differential-testing, react, typescript, python |
| source-trace                  | published     | Claim and citation review: exact passages, human-only approval, append-only audit trail. Does not verify truth.                                                   | citations, provenance, audit-trail, fastapi, react, typescript         |
| scene-forge                   | published     | Deterministic procedural SVG studio for hand-drawn looking diagrams, with golden-output tests.                                                                    | svg, procedural-generation, deterministic, react, typescript           |
| workflow-observatory          | published     | Browser-only state-machine studio: approvals, simulated retries, idempotency keys, event ledger, replay. Simulation only.                                         | state-machine, event-sourcing, idempotency, react, typescript          |
| signal-scope                  | published     | Educational historical event studies with no look-ahead. Not investment advice.                                                                                   | event-study, time-series, svg-charts, react, typescript                |
| script-audit                  | published     | Four deterministic audits for video scripts, suggestions accepted one at a time.                                                                                  | editorial-tools, writing, react, typescript, fastapi                   |
| topic-pulse                   | published     | Explainable topic scoring from public counts relative to each channel's median. No forecasts.                                                                     | youtube-data-api, analytics, explainability, react, typescript         |
| recruit-sim                   | published     | Branching recruiting practice with fictional people and a transparent rubric.                                                                                     | education, branching-scenarios, react, typescript                      |
| story-atlas                   | published     | Fictional-world explorer with relationship map, timeline, spoiler filter and content warnings.                                                                    | worldbuilding, data-visualization, react, typescript                   |
| PatrickNDevelopment.github.io | not published | Portfolio site: statically rendered case studies of verified projects.                                                                                            | portfolio, static-site, react, typescript                              |

## Pinning (up to six)

- **First:** profit-lab, recruit-radar and source-trace (published, with live demos and green CI).
- **Next:** scene-forge, then workflow-observatory, once each is published and its first CI run is
  green.
- **Last slot:** one specialist project for the target role (signal-scope for data or fintech,
  topic-pulse or script-audit for applied AI, recruit-sim for UX or edtech, story-atlas for creative
  frontend).

All ten app repositories are published; pinning is done by the owner on the GitHub profile page.
