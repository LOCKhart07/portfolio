import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { loadEnv } from 'vite';
import { writeFile } from 'node:fs/promises';
import { buildRedirects, buildSitemap } from './src/persona/personas';

const SITE = 'https://portfolio.lockhart.in';

// Env vars keep their CRA-era `REACT_APP_` names so the Netlify env config
// doesn't change. Two audiences:
//  - Build-time (Node): everything is copied onto process.env, so the
//    DatoCMS fetches in page frontmatter can read the token. It is never
//    `define`d, so it cannot end up in a browser bundle.
//  - Browser islands: only the vars listed in CLIENT_ENV are inlined via
//    `define` as `process.env.REACT_APP_*`, which is how the client code
//    (ChatBot, Music, analytics) already reads them.
const CLIENT_ENV = [
  'REACT_APP_GA_TRACKING_ID',
  'REACT_APP_SPOTIFY_STATS_API_BASE_URL',
  'REACT_APP_SPOTIFY_STATS_API_KEY',
  'REACT_APP_ASSISTANT_API_BASE_URL',
];

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const env = loadEnv(mode, process.cwd(), 'REACT_APP_');
for (const [key, value] of Object.entries(env)) {
  process.env[key] ??= value;
}

export default defineConfig({
  site: SITE,
  output: 'static',
  outDir: './build',
  // Emit /profile/recruiter/skills as skills.html, not skills/index.html.
  // Netlify serves a directory index only after a 301 to the trailing-slash
  // URL, which made every click two round trips; a .html file is served at
  // the slash-less URL our links use.
  // inlineStylesheets: page CSS is only ~5KB, so ship it inside the HTML
  // instead of as <link>s that block first paint for an extra round trip.
  build: { format: 'file', inlineStylesheets: 'always' },
  trailingSlash: 'never',
  integrations: [
    react(),
    {
      // Netlify persona redirect rules and the sitemap, generated from the
      // same persona/section lists the pages are built from (personas.ts).
      name: 'generated-files',
      hooks: {
        'astro:build:done': async ({ dir }) => {
          const today = new Date().toISOString().slice(0, 10);
          await writeFile(new URL('_redirects', dir), buildRedirects());
          await writeFile(new URL('sitemap.xml', dir), buildSitemap(SITE, today));
        },
      },
    },
  ],
  // Hovering a link fetches the next page, so section-to-section navigation
  // through the ClientRouter is effectively instant.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  server: { port: 3000, open: true },
  vite: {
    define: Object.fromEntries(
      CLIENT_ENV.map((key) => [`process.env.${key}`, JSON.stringify(process.env[key] ?? '')]),
    ),
  },
});
