// Dependency-free persona primitives: no images, no icons, no React. Kept
// separate from personaConfig.tsx so the tiny browser scripts (legacy-path
// redirect, lastPersona cache) and the build-time `_redirects` generator can
// import them without pulling the image/icon graph into a bundle.

export type ProfileType = 'recruiter' | 'engineer' | 'collaborator' | 'explorer';

export const PERSONAS: ProfileType[] = ['recruiter', 'engineer', 'collaborator', 'explorer'];

export const isPersona = (x?: string | null): x is ProfileType =>
  !!x && (PERSONAS as readonly string[]).includes(x);

export const coercePersona = (x?: string | null): ProfileType =>
  isPersona(x) ? x : 'recruiter';

// Pre-rename persona keys still found in old shared links/bookmarks. Each
// maps to its current key (redirected, not collapsed to recruiter).
export const LEGACY_PERSONA_ALIASES: Record<string, ProfileType> = {
  developer: 'engineer',
  stalker: 'collaborator',
  adventurer: 'explorer',
};

// localStorage key holding the visitor's last-used persona. Lets legacy flat
// paths land on that persona, and marks a returning visitor (who skips the
// splash).
export const LAST_PERSONA_KEY = 'lastPersona';

// Every content section, as its URL segment under /profile/<persona>/. Each
// one also exists as a legacy flat path (/<section>).
export const SECTIONS = [
  'work-experience',
  'recommendations',
  'skills',
  'projects',
  'contact-me',
  'music',
  'certifications',
  'quotes',
  'awards',
] as const;

export type Section = (typeof SECTIONS)[number];

/** `getStaticPaths` result: one page per persona. */
export const personaPaths = () => PERSONAS.map((persona) => ({ params: { persona } }));

/** Where a legacy flat path (/projects) sends the visitor. */
export const legacyRedirectTarget = (section: string, storedPersona: string | null): string =>
  `/profile/${coercePersona(storedPersona)}/${section}`;

/**
 * Netlify `_redirects` body. Replaces the client-side <Navigate> logic the SPA
 * used for bad persona segments. Rules are non-forced, so an existing
 * prerendered file always wins and only unknown paths fall through. Netlify
 * applies the first matching rule, so order matters:
 *  1. legacy persona keys → their renamed persona, rest of the path kept;
 *  2. unknown pages under the recruiter persona → 404 (without this guard,
 *     rule 3 would bounce /profile/recruiter/nope to itself forever);
 *  3. any other unknown persona → its recruiter equivalent.
 */
export const buildRedirects = (): string => {
  const lines: string[] = [];
  for (const [legacy, current] of Object.entries(LEGACY_PERSONA_ALIASES)) {
    lines.push(`/profile/${legacy}  /profile/${current}  301`);
    lines.push(`/profile/${legacy}/*  /profile/${current}/:splat  301`);
  }
  lines.push('/profile/recruiter/*  /404.html  404');
  lines.push('/profile/:persona  /profile/recruiter  302');
  lines.push('/profile/:persona/*  /profile/recruiter/:splat  302');
  return lines.join('\n') + '\n';
};

/**
 * Indexable public paths, in sitemap order. Only the recruiter copy of each
 * page is listed: every persona's page canonicalizes to it (BaseLayout).
 */
export const sitemapPaths = (): string[] => [
  '/',
  '/browse',
  '/profile/recruiter',
  ...SECTIONS.map((section) => `/profile/recruiter/${section}`),
];

/**
 * sitemap.xml body, generated at build time from the same section list the
 * pages are built from, so it can't drift. `lastmod` is the build date:
 * builds run on deploys and on DatoCMS publish (webhook), so it tracks real
 * content changes. changefreq/priority are omitted; Google ignores both.
 */
export const buildSitemap = (site: string, lastmod: string): string => {
  const urls = sitemapPaths()
    .map((path) => {
      const loc = new URL(path, site).href;
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
    })
    .join('\n');
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    `${urls}\n</urlset>\n`
  );
};
