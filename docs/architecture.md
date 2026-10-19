# Architecture

```text
src/content/projects.ts   typed facts per project (status, links, problem, choices, results, limits, shots)
src/content/site.ts       site identity, skills table, approach section
src/pages/                Layout, HomePage, ProjectPage, NotFoundPage (React components)
src/render.tsx            routes() and render(route) -> full HTML document
scripts/prerender.mjs     writes dist/: pages, hashed CSS, public/, sitemap.xml, robots.txt, .nojekyll
scripts/serve.mjs         GitHub-Pages-like static server for preview and e2e
scripts/check-registry.mjs local consistency check against ../portfolio-control/projects.json
```

## Decisions

1. **Static rendering, no client JavaScript.** A portfolio needs no interactivity; static HTML is
   fastest, works without JavaScript, and is fully crawlable. React is used as a typed templating
   layer at build time (`vite build --ssr`, then `renderToStaticMarkup`).
2. **Real paths, not hash routes.** Case studies live at `/projects/<slug>/` so they can be linked,
   listed in the sitemap and given their own metadata. GitHub Pages serves `index.html` for those
   directories and `404.html` for anything else; `scripts/serve.mjs` reproduces that behaviour for
   tests.
3. **Base `/`.** This is the account's user site (`PatrickNDevelopment.github.io`).
4. **Content as data with guards.** Unit tests enforce: exactly four featured projects; links only
   for published projects, with the expected URL shapes; screenshots only from the projects and all
   used; limitations present everywhere. A local script cross-checks status, commit and demo URL
   with the portfolio registry.
5. **Images reserve their space.** The prerender step reads PNG dimensions and writes `width`/
   `height`; images below the first screen load lazily.
6. **Accessibility.** Skip link, landmark regions, one `h1` per page without skipped levels, visible
   focus, 44 px targets for primary links, colour tokens with a dark scheme, reduced-motion support,
   tables that reflow on phones.
7. **Canonical URLs point at `https://patrickndevelopment.github.io/`**, the address GitHub assigns to
   this user site; they become live only when the site is published.
