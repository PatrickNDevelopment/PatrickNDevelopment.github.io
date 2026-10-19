import { expect, test, type Page } from '@playwright/test';

const PAGES = [
  '/',
  '/projects/profit-lab/',
  '/projects/recruit-radar/',
  '/projects/source-trace/',
  '/projects/scene-forge/',
  '/projects/workflow-observatory/',
  '/projects/signal-scope/',
  '/projects/script-audit/',
  '/projects/topic-pulse/',
  '/projects/recruit-sim/',
  '/projects/story-atlas/',
  '/404.html',
];
const PUBLISHED = ['profit-lab', 'recruit-radar', 'source-trace'];
const ALLOWED_EXTERNAL = new Set([
  'https://github.com/PatrickNDevelopment',
  ...PUBLISHED.map((s) => `https://github.com/PatrickNDevelopment/${s}`),
  ...PUBLISHED.map((s) => `https://patrickndevelopment.github.io/${s}/`),
]);

async function hrefs(page: Page): Promise<string[]> {
  return page.locator('a[href]').evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''));
}

test('link audit: every internal link and anchor resolves; external links are only verified ones', async ({
  page,
  request,
}) => {
  const internal = new Set<string>();
  for (const path of PAGES) {
    await page.goto(path);
    for (const h of await hrefs(page)) {
      if (h.startsWith('http')) {
        expect(ALLOWED_EXTERNAL.has(h), `${path} links to ${h}`).toBe(true);
      } else {
        internal.add(new URL(h, `http://x${path}`).pathname + new URL(h, `http://x${path}`).hash);
      }
    }
  }
  for (const target of internal) {
    const [pathname, hash] = target.split('#') as [string, string | undefined];
    const res = await request.get(pathname);
    expect(res.status(), target).toBe(200);
    if (hash) {
      await page.goto(pathname);
      await expect(page.locator(`[id="${hash}"]`), target).toHaveCount(1);
    }
  }
  expect(internal.size).toBeGreaterThan(15);
});

test('unpublished projects carry no repository or demo links and say so', async ({ page }) => {
  await page.goto('/projects/scene-forge/');
  await expect(page.getByText('Accepted locally · not yet published').first()).toBeVisible();
  await expect(page.getByText('No public link yet')).toBeVisible();
  await expect(page.locator('a[href*="github.com/PatrickNDevelopment/scene-forge"]')).toHaveCount(
    0,
  );
  await page.goto('/projects/profit-lab/');
  await expect(page.getByRole('link', { name: 'Live demo of ProfitLab' })).toHaveAttribute(
    'href',
    'https://patrickndevelopment.github.io/profit-lab/',
  );
});

test('every page: one h1, no skipped heading levels, images with alt and size, metadata, no scripts', async ({
  page,
}) => {
  for (const path of PAGES) {
    await page.goto(path);
    await expect(page.locator('h1'), path).toHaveCount(1);
    const levels = await page
      .locator('h1, h2, h3, h4')
      .evaluateAll((hs) => hs.map((h) => Number(h.tagName[1])));
    for (let i = 1; i < levels.length; i++) {
      expect(
        (levels[i] as number) - (levels[i - 1] as number),
        `${path} heading order`,
      ).toBeLessThanOrEqual(1);
    }
    for (const img of await page.locator('img').all()) {
      await img.scrollIntoViewIfNeeded();
      expect(await img.getAttribute('alt'), path).toBeTruthy();
      expect(await img.getAttribute('width'), path).toBeTruthy();
      await expect
        .poll(() => img.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0), {
          message: `${path} image loads`,
        })
        .toBe(true);
    }
    await expect(page.locator('script')).toHaveCount(0);
    expect(await page.title(), path).not.toBe('');
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    if (path !== '/404.html') {
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        `https://patrickndevelopment.github.io${path}`,
      );
    }
  }
});

test('404 handling and directory redirects behave like GitHub Pages', async ({ page, request }) => {
  const res = await page.goto('/no/such/page');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
  await page.getByRole('link', { name: 'All projects' }).click();
  await expect(page.locator('#work')).toBeVisible();
  const r = await request.get('/projects/profit-lab', { maxRedirects: 0 });
  expect(r.status()).toBe(301);
  expect(r.headers()['location']).toBe('/projects/profit-lab/');
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap.match(/<loc>/g)).toHaveLength(11);
  expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap:');
});

test('keyboard: skip link first, then the main navigation', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main$/);
  await page.goto('/');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'PatrickNDevelopment', exact: true })).toBeFocused();
});

test('no horizontal scroll at 320 and 375 px; reduced motion turns off smooth scrolling', async ({
  page,
}) => {
  for (const width of [320, 375]) {
    await page.setViewportSize({ width, height: 800 });
    for (const path of PAGES) {
      await page.goto(path);
      const over = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(over, `${path} at ${width}`).toBeLessThanOrEqual(0);
    }
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe(
    'auto',
  );
});

// Audit 11B: real computed colours, both colour schemes, every text node on representative pages.
const CONTRAST_PAGES = ['/', '/projects/profit-lab/', '/projects/scene-forge/', '/404.html'];
for (const scheme of ['light', 'dark'] as const) {
  test(`text contrast is at least WCAG AA in the ${scheme} scheme`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    for (const path of CONTRAST_PAGES) {
      await page.goto(path);
      const failures = await page.evaluate(() => {
        const rgb = (s: string) => (s.match(/[\d.]+/g) ?? []).map(Number);
        const lum = ([r, g, b]: number[]) =>
          [r, g, b]
            .map((v) => (v ?? 0) / 255)
            .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
            .reduce((acc, v, i) => acc + v * ([0.2126, 0.7152, 0.0722][i] ?? 0), 0);
        const bgOf = (el: Element | null): number[] => {
          for (let e = el; e; e = e.parentElement) {
            const c = rgb(getComputedStyle(e).backgroundColor);
            if (c.length === 3 || (c[3] ?? 0) > 0.9) return c.slice(0, 3);
          }
          return [255, 255, 255];
        };
        const out: string[] = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          const el = n.parentElement;
          if (!el || !n.textContent?.trim() || el.closest('.sr-only, .skip')) continue;
          const st = getComputedStyle(el);
          const a = lum(rgb(st.color));
          const b = lum(bgOf(el));
          const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
          const size = parseFloat(st.fontSize);
          const large = size >= 24 || (size >= 18.66 && Number(st.fontWeight) >= 700);
          if (ratio < (large ? 3 : 4.5)) {
            out.push(`${n.textContent.trim().slice(0, 30)} ${ratio.toFixed(2)}`);
          }
        }
        return out;
      });
      expect(failures, `${scheme} ${path}`).toEqual([]);
    }
  });
}

test('focus rings on the navy bands are gold and visible', async ({ page }) => {
  await page.goto('/projects/profit-lab/');
  const demo = page.getByRole('link', { name: 'Live demo of ProfitLab' });
  await demo.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  await expect(demo).toBeFocused();
  expect(await demo.evaluate((a) => getComputedStyle(a).outlineColor)).toBe('rgb(242, 193, 78)');
  await page.goto('/');
  const cta = page.getByRole('link', { name: 'See the case studies' });
  await cta.focus();
  await page.keyboard.press('Shift+Tab');
  await page.keyboard.press('Tab');
  expect(await cta.evaluate((a) => getComputedStyle(a).outlineColor)).toBe('rgb(242, 193, 78)');
});
