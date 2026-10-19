// Regression tests for the independent acceptance audit (prompt 11B): colour contrast of the design
// tokens, AI-assistance wording, meta descriptions and numeric facts against the portfolio registry.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PROJECTS } from '../src/content/projects';
import { APPROACH, SITE, SKILLS } from '../src/content/site';
import { render, routes, summary } from '../src/render';

const css = readFileSync(join(process.cwd(), 'src', 'styles.css'), 'utf8');

/** Custom properties of the first `:root { ... }` block after `from`. */
function tokens(from: number): Record<string, string> {
  const start = css.indexOf(':root {', from);
  const block = css.slice(start, css.indexOf('}', start));
  return Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]),
  );
}
const light = tokens(0);
const dark = { ...light, ...tokens(css.indexOf('prefers-color-scheme: dark')) };

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m) as [number, number];
  return (x + 0.05) / (y + 0.05);
}

const HEADER_GOLD = '#f2c14e';
const HEADER_NAVY = '#1d3b53';

describe('colour contrast of the design tokens (WCAG AA)', () => {
  for (const [scheme, t] of [
    ['light', light],
    ['dark', dark],
  ] as const) {
    it(`${scheme}: text tokens reach 4.5:1 on every page background`, () => {
      const backgrounds = ['bg', 'surface', 'surface-2'];
      for (const fg of ['ink', 'muted', 'accent', 'gold']) {
        for (const bg of backgrounds) {
          const ratio = contrast(t[fg] as string, t[bg] as string);
          expect(ratio, `${scheme} --${fg} on --${bg}: ${ratio.toFixed(2)}`).toBeGreaterThanOrEqual(
            4.5,
          );
        }
      }
      expect(contrast(t['ok'] as string, t['ok-bg'] as string)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(t['pending'] as string, t['pending-bg'] as string)).toBeGreaterThanOrEqual(
        4.5,
      );
      expect(contrast(t['accent-ink'] as string, t['accent'] as string)).toBeGreaterThanOrEqual(
        4.5,
      );
      // focus ring is a non-text indicator: 3:1 against the page
      expect(contrast(t['focus'] as string, t['bg'] as string)).toBeGreaterThanOrEqual(3);
    });
  }

  it('navy bands (hero, case-study header) use gold for eyebrow text and focus rings', () => {
    expect(contrast(HEADER_GOLD, HEADER_NAVY)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(HEADER_GOLD, dark['navy'] as string)).toBeGreaterThanOrEqual(4.5);
    // the default light focus colour would fail on navy, so the override must exist
    expect(contrast(light['focus'] as string, HEADER_NAVY)).toBeLessThan(3);
    expect(css).toMatch(/\.case-head \.eyebrow\s*\{\s*color: #f2c14e;/);
    expect(css).toMatch(
      /\.hero :focus-visible,\s*\.case-head :focus-visible\s*\{\s*outline-color: #f2c14e;/,
    );
  });
});

describe('AI-assisted work is described as such', () => {
  const sitewide = JSON.stringify({ PROJECTS, APPROACH, SKILLS, SITE });

  it('makes no hand-made claims and no owner-authored specification claim', () => {
    expect(sitewide).not.toMatch(
      /hand[- ](written|built|coded|computed|crafted|derived)|(computed|derived|coded) by hand/i,
    );
    expect(sitewide).not.toMatch(/under my specification|specified and reviewed by the owner/i);
  });

  it('every rendered page says the code was written with Claude Code and reviews are AI sessions', () => {
    for (const r of routes()) {
      const out = render(r, { css: '/a.css', sizes: {} });
      expect(out, r.path).toContain('Claude Code');
      expect(out, r.path).toMatch(/not human audits|not a human code audit/);
    }
    const home = render(routes()[0]!, { css: '/a.css', sizes: {} });
    expect(home).toContain('a separate Claude Code session that did not write the code');
  });
});

describe('meta descriptions', () => {
  it('are cut at a word boundary with an ellipsis, never mid-word', () => {
    expect(summary('short text')).toBe('short text');
    const long = `${'word '.repeat(80)}end`;
    const s = summary(long);
    expect(s.length).toBeLessThanOrEqual(300);
    expect(s.endsWith('word…')).toBe(true);
    for (const r of routes()) {
      expect(r.description.length, r.path).toBeLessThanOrEqual(300);
      expect(r.description, r.path).toMatch(/[.…]$/);
    }
  });
});

const registryPath = join(process.cwd(), '..', 'portfolio-control', 'projects.json');
describe.skipIf(!existsSync(registryPath))('numbers match the portfolio registry', () => {
  it('every count in "Tested results" appears in that project’s registry test summary', () => {
    const registry = JSON.parse(readFileSync(registryPath, 'utf8')) as {
      projects: { slug: string; test_summary: string; status: string; last_commit: string }[];
    };
    for (const p of PROJECTS) {
      const entry = registry.projects.find((e) => e.slug === p.slug);
      expect(entry, p.slug).toBeDefined();
      const source = (entry?.test_summary ?? '').replace(/(\d),(\d{3})/g, '$1$2');
      const text = p.results
        .join(' ')
        .replace(/\b20\d\d-\d\d-\d\d\b/g, ' ')
        .replace(/(\d),(\d{3})/g, '$1$2');
      const numbers = [...text.matchAll(/\b\d+\b/g)]
        .map((m) => m[0])
        .filter((n) => !/^20\d\d$/.test(n) && n.length < 5);
      for (const n of numbers) {
        expect(source, `${p.slug}: ${n}`).toMatch(new RegExp(`\\b${n}\\b`));
      }
      expect(source, `${p.slug}: verified date`).toContain(p.verified);
    }
  });
});
