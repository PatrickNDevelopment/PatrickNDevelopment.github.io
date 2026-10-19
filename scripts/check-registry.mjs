// Local-only consistency check: compares the site's project facts with the private portfolio
// registry (../portfolio-control/projects.json) when it exists. Skips (exit 0) elsewhere, e.g. in CI.
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createServer } from 'vite';

const registryPath = join(process.cwd(), '..', 'portfolio-control', 'projects.json');
if (!existsSync(registryPath)) {
  console.log('registry check skipped: ../portfolio-control/projects.json not found');
  process.exit(0);
}
const registry = JSON.parse(readFileSync(registryPath, 'utf8'));
const entries = Array.isArray(registry) ? registry : registry.projects;

const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
});
const { PROJECTS } = await vite.ssrLoadModule('/src/content/projects.ts');
await vite.close();

const problems = [];
for (const p of PROJECTS) {
  const e = entries.find((x) => x.slug === p.slug);
  if (!e) {
    problems.push(`${p.slug}: not in the registry`);
    continue;
  }
  const expected = e.status === 'published' ? 'published' : 'accepted';
  if (!['published', 'ready_for_publication_review'].includes(e.status)) {
    problems.push(`${p.slug}: registry status ${e.status} is not verified`);
  }
  if (p.status !== expected)
    problems.push(`${p.slug}: site says ${p.status}, registry ${e.status}`);
  if (p.commit !== e.last_commit)
    problems.push(`${p.slug}: commit ${p.commit} vs ${e.last_commit}`);
  if ((p.demo ?? null) !== (e.publication_url ?? null)) {
    problems.push(`${p.slug}: demo ${p.demo} vs registry ${e.publication_url}`);
  }
}
if (problems.length) {
  console.error(`registry check FAILED:\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
console.log(`registry check: ${PROJECTS.length} projects match portfolio-control/projects.json`);
