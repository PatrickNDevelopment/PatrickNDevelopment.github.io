import type { ReactNode } from 'react';
import { SITE } from '../content/site';

export function Layout({
  children,
  current,
}: {
  children: ReactNode;
  current: 'home' | 'project' | 'error';
}) {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="wrap header-row">
          <a className="brand" href="/" aria-current={current === 'home' ? 'page' : undefined}>
            <span className="brand-mark" aria-hidden="true">
              PN
            </span>
            <span>{SITE.handle}</span>
          </a>
          <nav aria-label="Main">
            <ul>
              <li>
                <a href="/#work">Work</a>
              </li>
              <li>
                <a href="/#approach">Approach</a>
              </li>
              <li>
                <a href="/#contact">Contact</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <footer className="site-footer">
        <div className="wrap">
          <p>
            Static site, no tracking, no cookies. Source code of the published projects is on{' '}
            <a href={SITE.github}>GitHub</a>.
          </p>
          <p className="muted">
            Implemented with AI assistance (Claude Code) under the owner&apos;s direction and
            review; acceptance reviews are separate AI sessions, not human audits. MIT licence.
          </p>
        </div>
      </footer>
    </>
  );
}

export function ProjectLinks({
  repo,
  demo,
  name,
}: {
  repo?: string | undefined;
  demo?: string | undefined;
  name: string;
}) {
  if (!repo && !demo) {
    return (
      <p className="small muted">
        No public link yet: the repository is verified locally and awaiting publication review.
      </p>
    );
  }
  return (
    <ul className="links">
      {demo ? (
        <li>
          <a className="button" href={demo}>
            Live demo<span className="sr-only"> of {name}</span>
          </a>
        </li>
      ) : null}
      {repo ? (
        <li>
          <a className="button secondary" href={repo}>
            Source on GitHub<span className="sr-only"> for {name}</span>
          </a>
        </li>
      ) : null}
    </ul>
  );
}
