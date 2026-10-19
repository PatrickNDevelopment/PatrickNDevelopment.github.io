/** Build-time renderer: every page is static HTML; the site ships no JavaScript. */
import { renderToStaticMarkup } from 'react-dom/server';
import type { ReactElement } from 'react';
import { PROJECTS } from './content/projects';
import { SITE } from './content/site';

export { SITE };
import { HomePage, NotFoundPage, ProjectPage, SizesContext } from './pages/Pages';

export interface Route {
  /** URL path served by GitHub Pages. */
  path: string;
  /** Output file inside dist/. */
  file: string;
  title: string;
  description: string;
  image: string;
  inSitemap: boolean;
}

/** Meta description: at most 300 characters, cut at a word boundary with an ellipsis. */
export function summary(text: string, max = 300): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const space = cut.lastIndexOf(' ');
  return `${(space > 0 ? cut.slice(0, space) : cut).replace(/[\s,;:.]+$/, '')}…`;
}

export function routes(): Route[] {
  return [
    {
      path: '/',
      file: 'index.html',
      title: SITE.title,
      description: SITE.description,
      image: 'profit-lab--desktop-products.png',
      inSitemap: true,
    },
    ...PROJECTS.map((p) => ({
      path: `/projects/${p.slug}/`,
      file: `projects/${p.slug}/index.html`,
      title: `${p.name}: ${p.featured ? 'case study' : 'project'} · ${SITE.handle}`,
      description: summary(`${p.tagline} ${p.problem}`),
      image: p.shots[0]?.file ?? 'profit-lab--desktop-products.png',
      inSitemap: true,
    })),
    {
      path: '/404.html',
      file: '404.html',
      title: `Page not found · ${SITE.handle}`,
      description: 'This address does not exist on this site.',
      image: 'profit-lab--desktop-products.png',
      inSitemap: false,
    },
  ];
}

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function render(
  route: Route,
  opts: { css: string; sizes: Record<string, { width: number; height: number }> },
): string {
  let page: ReactElement;
  if (route.path === '/') page = <HomePage />;
  else if (route.path === '/404.html') page = <NotFoundPage />;
  else {
    const p = PROJECTS.find((x) => route.path === `/projects/${x.slug}/`);
    if (!p) throw new Error(`no project for ${route.path}`);
    page = <ProjectPage p={p} />;
  }
  const body = renderToStaticMarkup(
    <SizesContext.Provider value={opts.sizes}>{page}</SizesContext.Provider>,
  );
  const url = `${SITE.origin}${route.path}`;
  const head = [
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    '<meta name="color-scheme" content="light dark" />',
    `<title>${esc(route.title)}</title>`,
    `<meta name="description" content="${esc(route.description)}" />`,
    route.inSitemap
      ? `<link rel="canonical" href="${url}" />`
      : '<meta name="robots" content="noindex" />',
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml" />',
    `<link rel="stylesheet" href="${opts.css}" />`,
    '<meta property="og:type" content="website" />',
    `<meta property="og:title" content="${esc(route.title)}" />`,
    `<meta property="og:description" content="${esc(route.description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${SITE.origin}/screens/${route.image}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
  ];
  return `<!doctype html>\n<html lang="en">\n<head>\n${head.join('\n')}\n</head>\n<body>\n${body}\n</body>\n</html>\n`;
}
