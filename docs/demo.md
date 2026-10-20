# Reviewing the site

1. `npm ci && npm run dev`, then open http://localhost:5182/.
2. Landing page: introduction, the three counts (projects verified, published, reviewed), "See the
   case studies" jumps to the featured list.
3. Open each featured case study: problem, what it does, engineering choices, significant challenge,
   tested results with the commit verified, screenshots, stack, candid limitations, how it was made.
   Each shows "Live demo" and "Source on GitHub".
4. "More projects": six cards, each marked "Published" with its date, each with a project
   page.
5. Keyboard: Tab from the top reaches "Skip to content" first; every link has a visible focus ring.
6. Try http://localhost:5182/anything: the 404 page (status 404) links back home.
7. Narrow the window to a phone width: no horizontal scrolling; the skills table reflows.
