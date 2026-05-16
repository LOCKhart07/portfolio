# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Task | Command |
| --- | --- |
| Dev server (Vite, port 3000, opens browser) | `npm start` or `npm run dev` |
| Production build → `build/` | `npm run build` |
| Run tests | `npm test` (Jest via `react-scripts test`, watch mode) |
| Run a single test file | `npm test -- src/App.test.tsx` |
| Deploy to GitHub Pages | `npm run deploy` (Netlify is the primary host; see below) |

There is no lint script and no CI workflow. `.nvmrc` pins Node 20.12.2, but `netlify.toml` and the README build with Node 18 — match the deploy target (18) if a version conflict surfaces.

## Build system gotcha: CRA → Vite migration

This was a Create React App project migrated to Vite. `vite.config.ts` is mostly a **CRA-compatibility shim** and is the key file to understand before touching build behavior:

- Env vars must be prefixed `REACT_APP_`. They are exposed as `process.env.REACT_APP_*` (not `import.meta.env`) via a `define` plugin in `vite.config.ts`. Code reads `process.env.*` throughout.
- Base path comes from the `homepage` field in `package.json` (→ `PUBLIC_URL`).
- `index.html` supports `%ENV_VAR%` substitution.
- SVGs import as React components (`ReactComponent`) via an SVGR plugin, mirroring CRA.
- Images are compressed at build time by `vite-plugin-image-optimizer`.

The runtime app uses **Vite**, but `npm test` still runs **Jest via `react-scripts`** (CRA's `react-app/jest` config, jsdom). `src/App.test.tsx` is the stale default CRA stub (asserts "learn react") and does not reflect the real UI — it will fail if run. Treat the test setup as non-functional scaffolding unless you intentionally rebuild it.

## Environment variables

The README's documented variable names are out of date. The names actually read by the code (authoritative):

- `REACT_APP_DATOCMSTOKEN_DEFAULT` — DatoCMS GraphQL bearer token (`src/queries/getDatoCmsToken.ts`)
- `REACT_APP_GA_TRACKING_ID` — Google Analytics 4 measurement ID
- `REACT_APP_SPOTIFY_STATS_API_BASE_URL` + `REACT_APP_SPOTIFY_STATS_API_KEY` — custom Spotify-stats backend (`src/queries/spotifyClient.ts`)
- `REACT_APP_ASSISTANT_API_BASE_URL` — chatbot streaming backend (`src/components/features/ChatBot/queries.ts`)

All missing vars degrade to `''` rather than throwing.

## Architecture

Single-page React 18 + React Router v6 app styled as a Netflix clone. Entry: `src/index.tsx` (wraps `<App>` in `<BrowserRouter>`) → `src/App.tsx` (renders the route table plus a global `ConsentBanner` and `ChatBot`).

**Routing** is a flat array in `src/routes.tsx` — add routes there. The intended UX flow:
`/` (`NetflixTitle` splash) → `/browse` (profile picker) → `/profile/:profileName` → content pages. Content pages are wrapped in `<Layout>`; the splash and browse screens are not.

**Profile personas** drive content. There are four: `recruiter | developer | stalker | adventurer`. `profilePage.tsx` validates `:profileName` and falls back to `recruiter`. The persona is passed down to `TopPicksRow`/`ContinueWatching`, where `topPicksConfig` decides which sections (and ordering) each persona sees. Changing what a persona sees = editing those config objects, not the routes.

**Data sources** — three independent backends, no shared API layer:

1. **DatoCMS (primary content)** via GraphQL. Each `src/queries/getX.ts` pairs a query string with a typed fetch function, all going through the shared `datoCMSClient` (`graphql-request`, bearer auth). Response shapes live in `src/types/types.ts` and mirror the DatoCMS models documented in the README. To add content: define the model in DatoCMS, add an interface to `types.ts`, add a `getX.ts`, consume it in the relevant page.
2. **Spotify-stats backend** via `spotifyClient.ts` (axios). This is a custom backend, not the Spotify API directly. Powers `Music` / top-tracks.
3. **Chatbot assistant** in `src/components/features/ChatBot/`. `queries.ts` POSTs to `/chat/stream` and manually parses a newline-delimited JSON stream (the split regex in `processStreamingResponse` is a known fragile workaround). Rendered globally from `App.tsx`, not route-scoped.

**Analytics is privacy-first and consent-gated.** `src/hooks/usePageTracking.tsx` initializes GA4 (`react-ga4`) with `testMode: true` and consent denied by default. Pageviews and `trackEvent` calls only fire when `localStorage.analyticsConsent === 'true'`, set via `ConsentBanner`. Do not call `ReactGA` directly — route through `trackEvent`/`updateAnalyticsConsent` so the consent gate is respected.

**Imports** are absolute from `src/` (`tsconfig.json` `baseUrl: "src"` + `vite-tsconfig-paths`), e.g. `import Skills from 'images/sections/Skills.webp'`. Note `usePageTracking` exists in two locations (`src/hooks/` and a stray `src/usePageTracking.tsx`); the hooks one is canonical (imported by `App.tsx`).

**Styling** is plain per-component CSS files colocated with components or under `src/styles/` and imported directly; CSS Modules are declared in types but not used in practice.

## Deployment

Hosted on **Netlify** (`netlify.toml`: build `npm run build`, publish `build/`, SPA redirect to `/index.html`, permissive CORS headers). The `gh-pages` deploy scripts in `package.json` are secondary. `homepage` in `package.json` (`https://portfolio.lockhart.in`) sets the build base path — keep it correct when changing hosting.
