import { describe, expect, test } from 'vitest';
import {
  LEGACY_PERSONA_ALIASES,
  PERSONAS,
  SECTIONS,
  buildRedirects,
  buildSitemap,
  legacyRedirectTarget,
  personaPaths,
} from './personas';
import { continueWatchingConfig, topPicksConfig } from './personaConfig';

const rules = () =>
  buildRedirects()
    .trim()
    .split('\n')
    .map((line) => line.split(/\s+/));

describe('buildRedirects', () => {
  test('every legacy persona key redirects to its renamed persona, path kept', () => {
    for (const [legacy, current] of Object.entries(LEGACY_PERSONA_ALIASES)) {
      expect(rules()).toContainEqual([`/profile/${legacy}`, `/profile/${current}`, '301']);
      expect(rules()).toContainEqual([
        `/profile/${legacy}/*`,
        `/profile/${current}/:splat`,
        '301',
      ]);
    }
  });

  test('unknown personas fall back to the recruiter equivalent', () => {
    expect(rules()).toContainEqual(['/profile/:persona/*', '/profile/recruiter/:splat', '302']);
    expect(rules()).toContainEqual(['/profile/:persona', '/profile/recruiter', '302']);
  });

  // Netlify applies the first matching rule. The legacy aliases would be
  // swallowed by the :persona catch-all if they came after it, and without the
  // recruiter 404 guard ahead of it /profile/recruiter/nope would redirect to
  // itself forever.
  test('specific rules come before the catch-all', () => {
    const froms = rules().map(([from]) => from);
    const catchAll = froms.indexOf('/profile/:persona/*');
    const guard = froms.indexOf('/profile/recruiter/*');
    expect(guard).toBeGreaterThanOrEqual(0);
    expect(guard).toBeLessThan(catchAll);
    for (const legacy of Object.keys(LEGACY_PERSONA_ALIASES)) {
      expect(froms.indexOf(`/profile/${legacy}/*`)).toBeLessThan(catchAll);
    }
  });

  test('unknown recruiter pages are a real 404, not a redirect', () => {
    expect(rules()).toContainEqual(['/profile/recruiter/*', '/404.html', '404']);
  });
});

describe('legacyRedirectTarget', () => {
  test("sends a flat path to the visitor's last persona", () => {
    expect(legacyRedirectTarget('projects', 'engineer')).toBe('/profile/engineer/projects');
  });

  test('falls back to recruiter with no stored or an invalid persona', () => {
    expect(legacyRedirectTarget('skills', null)).toBe('/profile/recruiter/skills');
    expect(legacyRedirectTarget('skills', 'stalker')).toBe('/profile/recruiter/skills');
  });
});

describe('static paths', () => {
  test('one page per persona', () => {
    expect(personaPaths().map((p) => p.params.persona)).toEqual(PERSONAS);
  });

  // Cards are plain links to prerendered files now, so a route that isn't a
  // real section is a hard 404 rather than a router fallback.
  test('every persona card links to a section that is actually built', () => {
    const routes = [
      ...Object.values(topPicksConfig).flat().map((p) => p.route),
      ...Object.values(continueWatchingConfig).flat().map((c) => c.link),
    ];
    const built = SECTIONS.map((s) => `/${s}`);
    expect(routes.filter((r) => !built.includes(r))).toEqual([]);
  });
});

describe('buildSitemap', () => {
  const parse = () => {
    const xml = buildSitemap('https://portfolio.lockhart.in', '2026-10-05');
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    return { xml, doc };
  };
  const locs = () =>
    [...parse().doc.getElementsByTagName('loc')].map((el) => el.textContent);

  test('is well-formed XML in the sitemap namespace', () => {
    const { doc } = parse();
    expect(doc.getElementsByTagName('parsererror')).toHaveLength(0);
    expect(doc.documentElement.namespaceURI).toBe('http://www.sitemaps.org/schemas/sitemap/0.9');
  });

  test('lists the home, picker and recruiter landing pages plus every section', () => {
    expect(locs()).toEqual([
      'https://portfolio.lockhart.in/',
      'https://portfolio.lockhart.in/browse',
      'https://portfolio.lockhart.in/profile/recruiter',
      ...SECTIONS.map((s) => `https://portfolio.lockhart.in/profile/recruiter/${s}`),
    ]);
  });

  // Other personas canonicalize to recruiter; listing them would hand Google
  // URLs whose canonical points elsewhere.
  test('lists only canonical recruiter URLs, each once, without trailing slashes', () => {
    const all = locs();
    expect(new Set(all).size).toBe(all.length);
    for (const persona of PERSONAS.filter((p) => p !== 'recruiter')) {
      expect(all.some((u) => u?.includes(`/profile/${persona}`))).toBe(false);
    }
    expect(all.filter((u) => u !== 'https://portfolio.lockhart.in/' && u?.endsWith('/'))).toEqual([]);
  });

  test('stamps every URL with the given lastmod', () => {
    const lastmods = [...parse().doc.getElementsByTagName('lastmod')].map((el) => el.textContent);
    expect(lastmods).toHaveLength(locs().length);
    expect(new Set(lastmods)).toEqual(new Set(['2026-10-05']));
  });
});
