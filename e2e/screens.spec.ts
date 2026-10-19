import { test } from '@playwright/test';

// Regenerates docs/screenshots from the production build: SHOTS=1 npx playwright test screens
test.skip(!process.env['SHOTS'], 'set SHOTS=1 to regenerate the documentation screenshots');

test('documentation screenshots', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const shot = async (path: string, name: string, fullPage = false) => {
    await page.goto(path);
    await page.evaluate(() =>
      Promise.all(
        [...document.images].map((i) => {
          i.loading = 'eager';
          return i.decode().catch(() => undefined);
        }),
      ),
    );
    await page.screenshot({ path: `docs/screenshots/${name}.png`, fullPage });
  };
  await page.setViewportSize({ width: 1280, height: 860 });
  await shot('/', 'home-desktop');
  await shot('/#work', 'work-desktop');
  await shot('/#approach', 'approach-desktop');
  await shot('/projects/recruit-radar/', 'case-study-desktop');
  await shot('/projects/topic-pulse/', 'project-desktop', true);
  await shot('/missing', 'not-found-desktop');
  await page.setViewportSize({ width: 375, height: 812 });
  await shot('/', 'home-mobile');
  await shot('/#work', 'work-mobile');
  await shot('/projects/source-trace/', 'case-study-mobile');
});
