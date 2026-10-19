import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PROJECTS, featured } from '../src/content/projects';
import { render, routes } from '../src/render';

const screens = join(process.cwd(), 'public', 'screens');
const sizes = Object.fromEntries(
  readdirSync(screens).map((f) => [f, { width: 1280, height: 800 }]),
);
const html = (path: string) => {
  const r = routes().find((x) => x.path === path);
  if (!r) throw new Error(path);
  return render(r, { css: '/assets/site.css', sizes });
};

describe('project content', () => {
  it('features exactly the four flagship projects, in order', () => {
    expect(featured.map((p) => p.slug)).toEqual([
      'profit-lab',
      'recruit-radar',
      'source-trace',
      'scene-forge',
    ]);
    expect(new Set(PROJECTS.map((p) => p.slug)).size).toBe(10);
  });

  it('links only published projects, to their own repository and Pages demo', () => {
    for (const p of PROJECTS) {
      if (p.status === 'published') {
        expect(p.repo).toBe(`https://github.com/PatrickNDevelopment/${p.slug}`);
        expect(p.demo).toBe(`https://patrickndevelopment.github.io/${p.slug}/`);
      } else {
        expect(p.repo, p.slug).toBeUndefined();
        expect(p.demo, p.slug).toBeUndefined();
        expect(JSON.stringify(p), p.slug).not.toMatch(/\bdeployed\b|\blive demo\b/i);
      }
    }
  });

  it('uses only screenshots from the projects, and every bundled screenshot is used', () => {
    const used = PROJECTS.flatMap((p) => p.shots.map((s) => s.file));
    for (const p of PROJECTS) {
      expect(p.shots.length, p.slug).toBeGreaterThan(0);
      for (const s of p.shots) {
        expect(s.file.startsWith(`${p.slug}--`), s.file).toBe(true);
        expect(existsSync(join(screens, s.file)), s.file).toBe(true);
        expect(s.alt.length).toBeGreaterThan(10);
      }
    }
    expect([...used].sort()).toEqual(readdirSync(screens).sort());
  });

  it('every case study has the required parts and a candid limitation', () => {
    for (const p of featured) {
      expect(p.challenge, p.slug).toBeDefined();
      expect(p.choices.length).toBeGreaterThanOrEqual(3);
      expect(p.results.length).toBeGreaterThanOrEqual(3);
    }
    for (const p of PROJECTS) {
      expect(p.limitations.length, p.slug).toBeGreaterThan(0);
      expect(p.commit).toMatch(/^[0-9a-f]{7}$/);
      expect(p.verified).toMatch(/^2026-\d\d-\d\d$/);
    }
  });
});

describe('rendered pages', () => {
  it('renders one h1, metadata and no scripts on every route', () => {
    for (const r of routes()) {
      const out = html(r.path);
      expect(out.match(/<h1[\s>]/g), r.path).toHaveLength(1);
      expect(out).not.toMatch(/<script/i);
      expect(out).toContain('<html lang="en">');
      expect(out).toContain('og:image');
    }
    expect(routes().filter((r) => r.inSitemap)).toHaveLength(11);
  });

  it('an unpublished project page states its status and has no repository link', () => {
    const out = html('/projects/scene-forge/');
    expect(out).toContain('Accepted locally · not yet published');
    expect(out).toContain('No public link yet');
    expect(out).not.toContain('github.com/PatrickNDevelopment/scene-forge');
  });

  it('escapes text into attributes and content', () => {
    const out = html('/');
    expect(out).not.toMatch(/content="[^"]*<[^"]*"/);
  });
});
