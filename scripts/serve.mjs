// Serves dist/ the way GitHub Pages serves a user site: directory index files, a redirect from
// "/dir" to "/dir/", and 404.html with status 404 for anything else. Usage: node scripts/serve.mjs [port]
import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, sep } from 'node:path';

const port = Number(process.argv[2] ?? 4183);
const dist = join(process.cwd(), 'dist');
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
};

function send(res, status, file) {
  res.writeHead(status, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
}

createServer((req, res) => {
  let path;
  try {
    path = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
  } catch {
    return send(res, 400, join(dist, '404.html'));
  }
  const file = normalize(join(dist, path));
  if (!file.startsWith(dist + sep) && file !== dist) return send(res, 404, join(dist, '404.html'));
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!path.endsWith('/')) {
      res.writeHead(301, { location: `${path}/` });
      return res.end();
    }
    const index = join(file, 'index.html');
    if (existsSync(index)) return send(res, 200, index);
  } else if (existsSync(file)) {
    return send(res, 200, file);
  }
  return send(res, 404, join(dist, '404.html'));
}).listen(port, () => console.log(`serving dist/ on http://localhost:${port}/`));
