# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Task | Command |
| --- | --- |
| Dev server (Vite, port 3000, opens browser) | `npm start` or `npm run dev` |
| Production build → `build/` | `npm run build` |
| Run tests | `npm test` (Vitest, single run) |
| Run tests in watch mode | `npm run test:watch` (`vitest`) |
| Run a single test file | `npm test -- src/App.test.tsx` |
| Typecheck (no emit) | `npm run typecheck` (`tsc --noEmit`) |
| Deploy to GitHub Pages | `npm run deploy` (Netlify is the primary host; see below) |

There is no lint script and no CI workflow. Node is pinned to **24.15.0** consistently across `.nvmrc`, `netlify.toml` (`NODE_VERSION`), and the README (`nvm install`/`nvm use` reads `.nvmrc`) — keep all three in sync if you bump it.

## Build system gotcha: CRA → Vite migration

This was a Create React App project migrated to Vite. `vite.config.ts` is mostly a **CRA-compatibility shim** and is the key file to understand before touching build behavior:

- Env vars must be prefixed `REACT_APP_`. They are exposed as `process.env.REACT_APP_*` (not `import.meta.env`) via a `define` plugin in `vite.config.ts`. Code reads `process.env.*` throughout.
- Base path comes from the `homepage` field in `package.json` (→ `PUBLIC_URL`).
- `index.html` supports `%ENV_VAR%` substitution.
- SVGs import as React components (`ReactComponent`) via an SVGR plugin, mirroring CRA.
- Images are compressed at build time by `vite-plugin-image-optimizer`.

Tests run on **Vitest** (`react-scripts` is gone). The config is the `test` block in `vite.config.ts` (`environment: 'jsdom'`, `setupFiles: './src/setupTests.ts'`), so tests share the app's Vite resolution — absolute `src/` imports, the SVGR plugin, the `process.env` define. `npm test` is `vitest run` (single pass, CI-safe); `npm run test:watch` is the watcher. `src/App.test.tsx` is now a real smoke test (mounts the full `<App>` and asserts the splash logo); other suites: `src/components/common/NavBar.test.tsx`, `src/persona/personaConfig.test.ts`, `src/persona/PersonaContext.test.tsx`.

## Environment variables

The names actually read by the code (authoritative — keep the README's `.env` example in sync):

- `REACT_APP_DATOCMSTOKEN_DEFAULT` — DatoCMS GraphQL bearer token (`src/queries/getDatoCmsToken.ts`)
- `REACT_APP_GA_TRACKING_ID` — Google Analytics 4 measurement ID
- `REACT_APP_SPOTIFY_STATS_API_BASE_URL` + `REACT_APP_SPOTIFY_STATS_API_KEY` — custom Spotify-stats backend (`src/queries/spotifyClient.ts`)
- `REACT_APP_ASSISTANT_API_BASE_URL` — chatbot streaming backend (`src/components/features/ChatBot/queries.ts`)

All missing vars degrade to `''` rather than throwing.

## Architecture

Single-page React 18 + React Router v6 app styled as a Netflix clone. Entry: `src/index.tsx` (wraps `<App>` in `<BrowserRouter>`) → `src/App.tsx` (renders the route table plus a global `ConsentBanner` and `ChatBot`).

**Routing** is built in `src/routes.tsx` from a `sections` array (one entry per content page) — add a page by adding a `sections` entry, not a hand-written route. Each section is mounted twice: canonically at `/profile/:profileName/<section>` (persona in the URL) and at the legacy flat `/<section>`, which `LegacyRedirect` bounces to the visitor's last-used persona. Everything except the `/` splash and `Layout` is code-split via `lazy()`. UX flow: `/` (`NetflixTitle` splash) → `/browse` (profile picker) → `/profile/:profileName` → section pages. Section pages and `/profile/:profileName` are wrapped in `<Layout>`; the splash and browse screens are not.

**Profile personas** drive content. The persona module is `src/persona/`: `personaConfig.tsx` holds `ProfileType` (`recruiter | developer | stalker | adventurer`), `coercePersona` (recruiter fallback), the per-persona maps (`avatarMap`, `contactCtaLabel`, `backgroundGif`, `imageMap`), and `topPicksConfig` (which sections, and their order, each persona sees). `PersonaContext.tsx` provides `PersonaProvider` — rendered inside `Layout`; reads `:profileName`, caches `lastPersona` to localStorage, and *redirects* an invalid persona segment to its recruiter equivalent rather than silently rendering a fallback — and the `usePersona()` hook (recruiter fallback when called outside a provider, e.g. the global ChatBot). Changing what a persona sees = editing `topPicksConfig`/the persona maps, not the routes.

**Data sources** — three independent backends, no shared API layer:

1. **DatoCMS (primary content)** via GraphQL. Each `src/queries/getX.ts` pairs a query string with a typed fetch function, all going through the shared `datoCMSClient` (`graphql-request`, bearer auth). Response shapes live in `src/types/types.ts` and mirror the DatoCMS models documented in the README. To add content: define the model in DatoCMS, add an interface to `types.ts`, add a `getX.ts`, consume it in the relevant page.
2. **Spotify-stats backend** via `spotifyClient.ts` (axios). This is a custom backend, not the Spotify API directly. Powers `Music` / top-tracks.
3. **Chatbot assistant** in `src/components/features/ChatBot/`. `queries.ts` POSTs to `/chat/stream` and manually parses a newline-delimited JSON stream (the split regex in `processStreamingResponse` is a known fragile workaround). Rendered globally from `App.tsx`, not route-scoped.

**Analytics is privacy-first and consent-gated.** `src/hooks/usePageTracking.tsx` *defers* GA4 (`react-ga4`) entirely: nothing is initialized and no `gtag.js` is loaded until the visitor clicks Accept in `ConsentBanner`. `updateAnalyticsConsent(true)` calls `ReactGA.initialize` (with `send_page_view: false`, so `ReactGA.send` is the single source of pageviews) and records the current page; declining never loads GA; a returning visitor with `localStorage.analyticsConsent === 'true'` initializes on load so pageviews still count. Pageviews and `trackEvent` only fire while consent is `'true'`. Do not call `ReactGA` directly, and do not move `ReactGA.initialize` back to module load (the old code did this plus passed `consent/ad_storage/analytics_storage` as `gtag('config')` params — Consent Mode that never applied — which leaked a `page_view` before the banner was answered). Route through `trackEvent`/`updateAnalyticsConsent` so the pre-consent gate holds.

**Imports** are absolute from `src/` (`tsconfig.json` `baseUrl: "src"` + `vite-tsconfig-paths`), e.g. `import Skills from 'images/sections/Skills.webp'`. `src/hooks/usePageTracking.tsx` is the single tracking module — `App`, `ConsentBanner`, `ProfileBanner`, `ContactMe`, and `Projects` all import it; do not reintroduce a second copy (there used to be a byte-identical stray `src/usePageTracking.tsx` that double-initialized GA).

**Styling** is plain per-component CSS files colocated with components or under `src/styles/` and imported directly; CSS Modules are declared in types but not used in practice.

## Deployment

Hosted on **Netlify** (`netlify.toml`: build `npm run build`, publish `build/`, SPA redirect to `/index.html`, permissive CORS headers). The `gh-pages` deploy scripts in `package.json` are secondary. `homepage` in `package.json` (`https://portfolio.lockhart.in`) sets the build base path — keep it correct when changing hosting.
