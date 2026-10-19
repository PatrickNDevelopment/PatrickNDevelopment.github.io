// Writes the static site into dist/: one HTML file per route, hashed CSS, public assets,
// sitemap.xml and robots.txt. Run after `vite build --ssr src/render.tsx --outDir build-ssr`.
import { createHash } from 'node:crypto';
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const dist = join(root, 'dist');
const { render, routes, SITE } = await import(
  pathToFileURL(join(root, 'build-ssr', 'render.js')).href
);

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(join(root, 'public'), dist, { recursive: true });

const css = readFileSync(join(root, 'src', 'styles.css'));
const cssName = `assets/site.${createHash('sha256').update(css).digest('hex').slice(0, 10)}.css`;
mkdirSync(join(dist, 'assets'), { recursive: true });
writeFileSync(join(dist, cssName), css);

/** Width and height from a PNG's IHDR chunk. */
function pngSize(file) {
  const b = readFileSync(file);
  if (b.toString('ascii', 1, 4) !== 'PNG') throw new Error(`${file} is not a PNG`);
  return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
}
const sizes = {};
for (const f of readdirSync(join(root, 'public', 'screens'))) {
  sizes[f] = pngSize(join(root, 'public', 'screens', f));
}

const all = routes();
for (const r of all) {
  const out = join(dist, r.file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, render(r, { css: `/${cssName}`, sizes }));
}

const urls = all
  .filter((r) => r.inSitemap)
  .map((r) => `  <url><loc>${SITE.origin}${r.path}</loc></url>`)
  .join('\n');
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
);
writeFileSync(
  join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\nSitemap: ${SITE.origin}/sitemap.xml\n`,
);
// GitHub Pages: serve files as they are (no Jekyll processing)
writeFileSync(join(dist, '.nojekyll'), '');
rmSync(join(root, 'build-ssr'), { recursive: true, force: true });
console.log(`prerendered ${all.length} pages into dist/`);
