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
