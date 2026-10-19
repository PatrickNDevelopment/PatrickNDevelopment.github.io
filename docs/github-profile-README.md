# Proposal: GitHub profile README

To use it, the owner creates a public repository named `PatrickNDevelopment` (same as the account)
with this content as `README.md`. **Not created; needs explicit approval.** Links to projects that
are not yet published are deliberately absent; add them as each one is published.

---

```markdown
### Web software that shows its working

I build browser applications and small Python services where correctness is the feature: exact
money math, citations tied to the passage they quote, deterministic drawings, replayable workflows.
Every project ships its tests, a one-command verification script and an acceptance review by a
separate AI session that did not write the code. The specifications, code and tests are written with
AI assistance (Claude Code) under my direction and review; each repository says so in
`AI_ASSISTANCE.md`.

**Published projects**

- [ProfitLab](https://github.com/PatrickNDevelopment/profit-lab): marketplace unit economics with
  exact decimal arithmetic, checked against a BigInt reference model.
  [Live demo](https://patrickndevelopment.github.io/profit-lab/)
- [RecruitRadar](https://github.com/PatrickNDevelopment/recruit-radar): hiring-market intelligence
  with two independent scoring engines (TypeScript and Python) held together by golden vectors and
  differential fuzzing. [Live demo](https://patrickndevelopment.github.io/recruit-radar/)
- [SourceTrace](https://github.com/PatrickNDevelopment/source-trace): claim and citation review with
  exact passages, a human-only approval gate and an append-only audit trail.
  [Live demo](https://patrickndevelopment.github.io/source-trace/)

**Stack:** TypeScript, React, Vite, Python, FastAPI, SQLite, Vitest, pytest, Playwright, GitHub
Actions.
```
