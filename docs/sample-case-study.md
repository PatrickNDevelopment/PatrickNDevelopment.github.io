# Sample case study: ProfitLab

This is the long-form version of the ProfitLab case study shown at `/projects/profit-lab/`, kept as
the model for future case studies. Sources: the ProfitLab README, `docs/architecture.md`,
`docs/test-report.md` and the portfolio registry (published 2026-10-15, commit 03fd70e).

## The problem

A reseller deciding what to list needs projected profit per product after every fee, shipping cost
and share of overhead, and a clear yes or no against a minimum profit and margin. Two things make a
losing product look like a winner: floating-point drift around the threshold, and a blank cost that
silently becomes $0.

## What was built

A browser-only analyzer (no backend, no live marketplace data):

- an editable product table with costs, prices, percentage and fixed fees, promoted-listing share and
  monthly units;
- qualification gates (default minimum $5.00 net and 15 % margin); incomplete rows can never qualify
  or be ranked;
- a break-even price per product, optional markup-retention pricing and explicit overhead
  allocation;
- scenarios compared side by side, CSV import with line-by-line validation, CSV and JSON export, and
  local persistence with corruption recovery.

## Engineering choices

| Choice                                                           | Why                                                       |
| ---------------------------------------------------------------- | --------------------------------------------------------- |
| Decimal strings (decimal.js), never JavaScript floats, for money | Exact cents; no drift at the gate                         |
| Each fee line rounded half-up to the cent                        | Matches how fees are charged; reproducible with integers  |
| Exact gate comparison (`net ≥ min% × price`)                     | A displayed 15.00 % that is really 14.996 % must not pass |
| Blank cost = unknown = incomplete                                | Unknown must never become $0                              |
| Break-even by scanning the price band cent rounding can affect   | Exact answer without a solver, even at high fee rates     |
| zod only at the persistence boundary                             | Validates untrusted storage, keeps hot paths simple       |

## The hard part: proving the money math

A second implementation of the economics uses BigInt integer cents and shares no code with the
decimal engine. Randomized suites (1,500 scenarios and 400 break-even cases after the review)
compare the two. The independent acceptance review still found nine defects (among them break-even
errors at high fee rates and CSV round-trip problems); each was fixed with a regression test.

## Results

- 55 Vitest tests and 10 Playwright tests against the production build under `/profit-lab/`.
- Clean-clone verification with exit code 0; verification scripts shown to fail loudly.
- Published: GitHub Actions CI green on Ubuntu, GitHub Pages deployed, live check passed (5 qualify,
  2 fail, 1 incomplete on the sample, no console errors).

## Candid limitations

Projections only; built-in fee tiers are illustrative, not an official schedule; data stays in one
browser; tested in Chromium-based browsers only.

## How it was made

Directed and reviewed by the owner; specification, code, tests and documentation written with Claude
Code (AI). Accepted by a separate Claude Code session that did not write the code and re-ran every
check from a clean clone; that is an AI review, not a human code audit.
