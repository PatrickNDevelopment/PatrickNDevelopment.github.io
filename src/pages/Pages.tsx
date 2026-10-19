import { createContext, useContext } from 'react';
import {
  PROJECTS,
  STATUS_LABEL,
  featured,
  secondary,
  type Project,
  type Shot,
} from '../content/projects';
import { APPROACH, SITE, SKILLS } from '../content/site';
import { Layout, ProjectLinks } from './Layout';

/** Pixel sizes of the screenshots, measured at build time so images reserve their space. */
export const SizesContext = createContext<Record<string, { width: number; height: number }>>({});

function Img({
  shot,
  eager = false,
  className,
}: {
  shot: Shot;
  eager?: boolean;
  className?: string;
}) {
  const sizes = useContext(SizesContext);
  const s = sizes[shot.file];
  return (
    <img
      className={className}
      src={`/screens/${shot.file}`}
      alt={shot.alt}
      width={s?.width}
      height={s?.height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}

function Status({ p }: { p: Project }) {
  return (
    <span className={`status ${p.status}`}>
      {STATUS_LABEL[p.status]}
      {p.status === 'published' ? ` · ${p.verified}` : ''}
    </span>
  );
}

export function HomePage() {
  return (
    <Layout current="home">
      <section className="hero">
        <div className="wrap">
          <p className="eyebrow">Software engineering portfolio</p>
          <h1>Web software that shows its working.</h1>
          <p className="lead">
            Browser applications and small Python services where correctness is the feature: exact
            money math, citations tied to the passage they quote, drawings that export identically
            every time, workflows whose every step can be replayed. Each project comes with its
            architecture notes, automated tests and an independent acceptance review.
          </p>
          <ul className="links">
            <li>
              <a className="button" href="#work">
                See the case studies
              </a>
            </li>
            <li>
              <a className="button secondary" href={SITE.github}>
                GitHub profile
              </a>
            </li>
          </ul>
          <dl className="facts" aria-label="Portfolio at a glance">
            <div>
              <dt>Projects verified</dt>
              <dd>{PROJECTS.length}</dd>
            </div>
            <div>
              <dt>Published with live demos</dt>
              <dd>{PROJECTS.filter((p) => p.status === 'published').length}</dd>
            </div>
            <div>
              <dt>Independent reviews</dt>
              <dd>
                {PROJECTS.length} of {PROJECTS.length}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section id="work" className="section" aria-labelledby="work-h">
        <div className="wrap">
          <h2 id="work-h">Featured case studies</h2>
          <ol className="features">
            {featured.map((p, i) => (
              <li key={p.slug} className="feature">
                <div className="feature-text">
                  <p className="eyebrow">
                    {String(i + 1).padStart(2, '0')} · <Status p={p} />
                  </p>
                  <h3>
                    <a href={`/projects/${p.slug}/`}>{p.name}</a>
                  </h3>
                  <p className="tagline">{p.tagline}</p>
                  <p>{p.problem}</p>
                  {p.challenge ? (
                    <p className="small">
                      <strong>Hard part:</strong> {p.challenge.title}.
                    </p>
                  ) : null}
                  <p className="small muted">{p.stack.slice(0, 6).join(' · ')}</p>
                  <ul className="links">
                    <li>
                      <a className="button" href={`/projects/${p.slug}/`}>
                        Read the case study<span className="sr-only">: {p.name}</span>
                      </a>
                    </li>
                    {p.demo ? (
                      <li>
                        <a className="button secondary" href={p.demo}>
                          Live demo<span className="sr-only"> of {p.name}</span>
                        </a>
                      </li>
                    ) : null}
                  </ul>
                </div>
                <a
                  className="feature-shot"
                  href={`/projects/${p.slug}/`}
                  tabIndex={-1}
                  aria-hidden="true"
                >
                  {p.shots[0] ? <Img shot={p.shots[0]} eager={i === 0} /> : null}
                </a>
              </li>
            ))}
          </ol>

          <h2 id="more-h">More projects</h2>
          <p className="muted">
            Each passed the same build and independent review process; none is published yet.
          </p>
          <ul className="cards" aria-labelledby="more-h">
            {secondary.map((p) => (
              <li key={p.slug} className="card">
                <h3>
                  <a href={`/projects/${p.slug}/`}>{p.name}</a>
                </h3>
                <p>{p.tagline}</p>
                <p className="small">
                  <Status p={p} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="approach" className="section alt" aria-labelledby="approach-h">
        <div className="wrap">
          <h2 id="approach-h">How the work is done</h2>
          <div className="approach">
            {APPROACH.map((a) => (
              <div key={a.title}>
                <h3>{a.title}</h3>
                <p>{a.body}</p>
              </div>
            ))}
          </div>
          <h2 id="skills-h">Stack, as used in these projects</h2>
          <table className="skills">
            <caption className="sr-only">Skills and where the code shows them</caption>
            <thead>
              <tr>
                <th scope="col">Area</th>
                <th scope="col">Tools and techniques</th>
                <th scope="col">Where to see it</th>
              </tr>
            </thead>
            <tbody>
              {SKILLS.map((s) => (
                <tr key={s.area}>
                  <th scope="row">{s.area}</th>
                  <td>{s.items.join(', ')}</td>
                  <td>{s.evidence}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="contact" className="section" aria-labelledby="contact-h">
        <div className="wrap">
          <h2 id="contact-h">Contact</h2>
          <p>
            The best way to reach me is through GitHub:{' '}
            <a href={SITE.github}>github.com/{SITE.handle}</a>.
          </p>
        </div>
      </section>
    </Layout>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul>
      {items.map((x) => (
        <li key={x}>{x}</li>
      ))}
    </ul>
  );
}

export function ProjectPage({ p }: { p: Project }) {
  const i = PROJECTS.indexOf(p);
  const next = PROJECTS[(i + 1) % PROJECTS.length] as Project;
  const [hero, ...rest] = p.shots;
  return (
    <Layout current="project">
      <article className="case">
        <header className="case-head">
          <div className="wrap">
            <p className="eyebrow">
              <a href="/#work">Work</a> / {p.featured ? 'Case study' : 'Project'} · <Status p={p} />
            </p>
            <h1>{p.name}</h1>
            <p className="lead">{p.tagline}</p>
            <ProjectLinks repo={p.repo} demo={p.demo} name={p.name} />
          </div>
        </header>
        <div className="wrap case-body">
          {hero ? (
            <figure className="shot">
              <Img shot={hero} eager />
              <figcaption>{hero.alt}. Screenshot of the implemented application.</figcaption>
            </figure>
          ) : null}
          <section aria-labelledby="problem-h">
            <h2 id="problem-h">The problem</h2>
            <p>{p.problem}</p>
          </section>
          <section aria-labelledby="built-h">
            <h2 id="built-h">What it does</h2>
            <List items={p.features} />
          </section>
          <section aria-labelledby="choices-h">
            <h2 id="choices-h">Engineering choices</h2>
            <List items={p.choices} />
          </section>
          {p.challenge ? (
            <section aria-labelledby="challenge-h">
              <h2 id="challenge-h">Significant challenge: {p.challenge.title}</h2>
              <p>{p.challenge.body}</p>
            </section>
          ) : null}
          <section aria-labelledby="results-h">
            <h2 id="results-h">Tested results</h2>
            <List items={p.results} />
            <p className="small muted">
              Last recorded verification {p.verified}, commit <code>{p.commit}</code>. The full
              commands and outcomes are in the repository&apos;s <code>docs/test-report.md</code>.
            </p>
          </section>
          {rest.length ? (
            <div className="gallery">
              {rest.map((s) => (
                <figure key={s.file} className={`shot ${s.device}`}>
                  <Img shot={s} />
                  <figcaption>{s.alt}</figcaption>
                </figure>
              ))}
            </div>
          ) : null}
          <section aria-labelledby="stack-h">
            <h2 id="stack-h">Stack</h2>
            <ul className="tags">
              {p.stack.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="limits-h" className="limits">
            <h2 id="limits-h">Candid limitations</h2>
            <List items={p.limitations} />
          </section>
          <section aria-labelledby="ai-h">
            <h2 id="ai-h">How it was made</h2>
            <p>
              Specified and reviewed by the owner, implemented with Claude Code, then accepted by an
              independent review session that re-ran every check and fixed what it found. See the
              repository&apos;s <code>AI_ASSISTANCE.md</code>.
            </p>
          </section>
          <nav className="pager" aria-label="More projects">
            <a href="/#work">← All projects</a>
            <a href={`/projects/${next.slug}/`}>Next: {next.name} →</a>
          </nav>
        </div>
      </article>
    </Layout>
  );
}

export function NotFoundPage() {
  return (
    <Layout current="error">
      <section className="section">
        <div className="wrap">
          <h1>Page not found</h1>
          <p>This address does not exist on this site. It may have moved.</p>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/#work">All projects</a>
            </li>
          </ul>
          <p className="small muted">
            Looking for a project demo? Published demos live at their own addresses, linked from
            each case study.
          </p>
        </div>
      </section>
    </Layout>
  );
}
