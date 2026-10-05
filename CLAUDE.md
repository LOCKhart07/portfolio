# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Task | Command |
| --- | --- |
| Dev server (Astro, port 3000, opens browser) | `npm start` or `npm run dev` |
| Production build → `build/` | `npm run build` |
| Serve the production build locally | `npm run preview` |
| Run tests | `npm test` (Vitest, single run) |
| Run tests in watch mode | `npm run test:watch` (`vitest`) |
| Run a single test file | `npm test -- src/persona/personas.test.ts` |
| Typecheck incl. `.astro` files | `npm run typecheck` (`astro check`) |
| Deploy to GitHub Pages | `npm run deploy` (Netlify is the primary host; see below) |

There is no lint script and no CI workflow. Node is pinned to **24.15.0** consistently across `.nvmrc`, `netlify.toml` (`NODE_VERSION`), and the README (`nvm install`/`nvm use` reads `.nvmrc`) — keep all three in sync if you bump it.

## Build system: Astro, prerendered

The site is an **Astro** static build (`output: 'static'`, `outDir: 'build'`; see `astro.config.ts`). Every URL is prerendered to HTML at build time with its DatoCMS content baked in. React (`@astrojs/react`) is used for components; most render to HTML on the server and ship **no JS**, and only these are hydrated islands: `ChatBot` (`client:idle`, `transition:persist`), `Music` (`client:visible`, live Spotify data), and `NetflixTitle` (`client:load`, the `/` splash). `<ClientRouter />` in `BaseLayout` gives SPA-style navigation, with `prefetch` on hover.

Gotchas:
- **Env vars keep their `REACT_APP_` names** and are read as `process.env.REACT_APP_*`. `astro.config.ts` loads `.env` onto `process.env` for build-time code, and `define`s **only** the client-safe vars in its `CLIENT_ENV` list into browser bundles. The DatoCMS token is deliberately not in that list: it must never reach a browser bundle, so never import `src/queries/datoCMSClient.ts` (or a `get*` that uses it) from an island.
- **Image imports are `ImageMetadata`**, not strings: use `.src` (see the maps in `personaConfig.tsx`).
- **Type-only imports must use `import type`** (`verbatimModuleSyntax`); a plain import of a type fails the build with `MISSING_EXPORT`.
- Module scripts run once per visit under the ClientRouter, so per-page work hangs off the `astro:page-load` event (`src/scripts/global.ts`, `NavBar.astro`, `ProfileLayout.astro`).
- **`build.format: 'file'` + `trailingSlash: 'never'` is deliberate.** Pages are emitted as `skills.html`, not `skills/index.html`, because Netlify serves a directory index only after a 301 to the trailing-slash URL, which made every click two round trips. Keep internal links slash-less. (`Astro.url.pathname` ends in `.html` in this mode; `BaseLayout` strips it for canonical URLs.)
- Path aliases are explicit in `tsconfig.json` (`images/*`, `persona/*`, `sounds/*`, `styles/*`).
- DatoCMS edits only appear after a rebuild (a Netlify build hook triggered from DatoCMS). Queries are memoized per build in `datoCMSClient.ts`, so the four personas don't refetch the same data.

Tests run on **Vitest** via Astro's `getViteConfig` (`vitest.config.ts`: jsdom, `src/setupTests.ts`), so they share the app's resolution. `.astro` components are tested with the Container API in `// @vitest-environment node` files (`src/components/common/NavBar.test.ts`). The test config pins `REACT_APP_GA_TRACKING_ID` to `G-TEST`. Suites: `src/persona/personas.test.ts`, `src/persona/personaConfig.test.ts`, `src/components/sections/Projects.test.tsx`, `src/components/common/NavBar.test.ts`, `src/lib/analytics.test.ts`, `src/components/features/ChatBot/voice.test.ts`, `netlify/mcp.test.ts` (MCP Server Card vs. the `/mcp` edge function; keep tests out of `netlify/edge-functions/`, where every file deploys as a function).

## Environment variables

The names actually read by the code (authoritative — keep the README's `.env` example in sync):

- `REACT_APP_DATOCMSTOKEN_DEFAULT` — DatoCMS GraphQL bearer token, **build time only** (`src/queries/getDatoCmsToken.ts`)
- `REACT_APP_GA_TRACKING_ID` — Google Analytics 4 measurement ID
- `REACT_APP_SPOTIFY_STATS_API_BASE_URL` + `REACT_APP_SPOTIFY_STATS_API_KEY` — custom Spotify-stats backend (`src/queries/spotifyClient.ts`)
- `REACT_APP_ASSISTANT_API_BASE_URL` — chatbot streaming backend (`src/components/features/ChatBot/queries.ts`)

All missing vars degrade to `''` rather than throwing. Netlify must expose the DatoCMS token to the Deploy Previews context too, or PR preview builds fail.

## Architecture

Netflix-clone portfolio. Pages live in `src/pages/` (file-based routing); layouts are `src/layouts/BaseLayout.astro` (head/meta/JSON-LD, ClientRouter, global script) and `ProfileLayout.astro` (navbar + persistent chatbot + `lastPersona` cache). React section components live in `src/components/sections/` (not `src/pages/`, which is Astro's routing dir) and take their data as **props**.

**Routing.** UX flow: `/` (`NetflixTitle` splash; returning visitors with `lastPersona` set are bounced to `/browse` by an inline head script before paint, and any click or key skips it) → `/browse` (profile picker, plain links) → `/profile/[persona]` → `/profile/[persona]/<section>`. Every page under `profile/[persona]/` uses `getStaticPaths = personaPaths`. The section list is `SECTIONS` in `src/persona/personas.ts`; adding a section means adding to `SECTIONS`, a `src/pages/profile/[persona]/<section>.astro`, and its component. Legacy flat paths (`/projects`) are prerendered by `src/pages/[section].astro` and redirect client-side to the last persona (`legacyRedirectTarget`). Bad or renamed persona segments are handled by Netlify rules **generated** into `build/_redirects` by `buildRedirects()`, and `build/sitemap.xml` is generated by `buildSitemap()` (recruiter URLs only, `lastmod` = build date). Both are written by the `astro:build:done` hook in `astro.config.ts`; don't hand-edit a `public/` copy. The redirect rule order matters and is tested.

**Profile personas** drive content ordering. `src/persona/personas.ts` holds the dependency-free primitives (`ProfileType` = `recruiter | engineer | collaborator | explorer`, `PERSONAS`, `coercePersona`, `LEGACY_PERSONA_ALIASES`, `LAST_PERSONA_KEY`, `SECTIONS`, the redirect builders), so browser scripts can import it without the image graph. `personaConfig.tsx` re-exports those and adds the maps (`avatarMap`, `contactCtaLabel`, `backgroundGif`, `imageMap`, `chatSuggestedQuestions`) and `topPicksConfig`/`continueWatchingConfig`. The persona comes from `Astro.params.persona` and is passed down as a prop (there is no context provider). Changing what a persona sees = editing `topPicksConfig`/the persona maps, not the routes.

**Data sources** — three independent backends, no shared API layer:

1. **DatoCMS (primary content)**, fetched **at build time** in page frontmatter. Each `src/queries/getX.ts` pairs a query string with a typed fetch function, all going through the memoized `datoCMSClient` (`graphql-request`, bearer auth). Response shapes live in `src/types/types.ts`. To add content: define the model in DatoCMS, add an interface to `types.ts`, add a `getX.ts`, call it in the page's frontmatter and pass it to the component.
2. **Spotify-stats backend** via `spotifyClient.ts` (axios), called live from the `Music` island. This is a custom backend, not the Spotify API directly. The Music blacklist comes from DatoCMS at build time as a prop.
3. **Chatbot assistant** in `src/components/features/ChatBot/`. `queries.ts` POSTs to `/chat/stream` and manually parses a newline-delimited JSON stream (the split regex in `processStreamingResponse` is a known fragile workaround). Mounted only by `ProfileLayout`.

**Analytics** (`src/lib/analytics.ts`, wired up in `src/scripts/global.ts`) is GA4 via `react-ga4` with **no consent gate** (an explicit decision; the old consent banner was removed). GA initializes on every visit but is deferred to `requestIdleCallback` so it never competes with first paint. `send_page_view: false`, so pageviews come only from the `astro:page-load` listener. Static pages have no click handlers: trackable elements carry `data-track="Category|Action|Label"`, which one delegated listener reports. Don't call `ReactGA` directly; go through this module.

**Styling** is plain per-component CSS files colocated with components or under `src/styles/`, imported directly; CSS Modules are not used. Static cards are real `<a>` elements, so their CSS resets link styling (`a.project-card`, etc.).

## Deployment

Hosted on **Netlify** (`netlify.toml`: build `npm run build`, publish `build/`, immutable caching for `/_astro/*`, permissive CORS headers, edge functions for `/` markdown negotiation and `/resume`). There is no SPA catch-all rewrite; unknown URLs get the real `404.html`. The `gh-pages` deploy scripts in `package.json` are secondary and don't support the generated `_redirects`. The site URL (`https://portfolio.lockhart.in`) is `site` in `astro.config.ts`; it drives canonical and OG URLs, and canonical links collapse every persona to the recruiter URL.
