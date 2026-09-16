#!/usr/bin/env node
// Build-time prerendering, run after `vite build` (chained onto the `build`
// script in package.json). It boots a local static server for the build
// that was just produced, visits every crawlable route in a real headless
// browser, and writes each route's fully client-rendered DOM to disk as its
// own index.html. Every crawler — Googlebot, Bing, LLM bots, social-card
// unfurlers — then gets real per-page HTML/title/meta without having to
// execute JS, instead of the SPA's empty `<div id="root">` (or, worse, one
// generic title/description/canonical shared by every route).
//
// Routes come from public/sitemap.xml, the existing single source of truth
// for "what's crawlable" (kept in sync with src/routes.tsx `sections`).
//
// `/` is intentionally skipped: it's NetflixTitle, a 4s logo-only splash
// that auto-redirects to /browse. index.html already ships a hand-written
// static SEO hero for that URL (see the comment above `#root` in
// index.html) — prerendering `/` would overwrite that hero with the splash
// logo, which is strictly worse for crawlers.
//
// Fails soft: if a headless browser can't be launched (no Chromium
// installed, or a locked-down CI image missing its system libs), this logs
// a warning and exits 0. The deploy then goes out as a plain CSR SPA —
// unchanged from before this script existed — rather than failing the
// whole build over an SEO enhancement.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BUILD_DIR = process.env.BUILD_PATH || 'build';
const PORT = process.env.PRERENDER_PORT || '4174';
const PREVIEW_ORIGIN = `http://localhost:${PORT}`;

function readSitemapRoutes() {
  const xml = readFileSync(join(ROOT, 'public/sitemap.xml'), 'utf-8');
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  return locs.filter((path) => path !== '/');
}

function readProductionOrigin() {
  const { homepage } = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'));
  return new URL(homepage).origin;
}

async function waitForServer(url, attempts = 60) {
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url);
      if (res.status < 500) return;
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Preview server never came up at ${url}`);
}

async function prerenderRoute(context, routePath) {
  const page = await context.newPage();
  try {
    await page.goto(`${PREVIEW_ORIGIN}${routePath}`, { waitUntil: 'networkidle', timeout: 30000 });
    // Data-driven sections render "Loading…" until their DatoCMS/Spotify
    // fetch resolves. Give that a beat, but never hang if the fetch never
    // resolves (e.g. no API token/network in this build environment).
    await page
      .waitForFunction(() => !document.body.innerText.includes('Loading'), { timeout: 8000 })
      .catch(() => {});

    const html = await page.content();
    const outDir = join(ROOT, BUILD_DIR, routePath.replace(/^\//, ''));
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, 'index.html'), html);
    console.log(`[prerender] wrote ${routePath}`);
  } finally {
    await page.close();
  }
}

async function main() {
  const { chromium } = await import('playwright');
  const routes = readSitemapRoutes();
  const productionOrigin = readProductionOrigin();

  // Spawn the local `vite` binary directly, not `npx vite`: npx runs the
  // real server as a *child* of itself, so killing the npx process (what
  // `spawn` would hand back) leaves that child orphaned and still bound to
  // the port instead of shutting it down.
  //
  // `stdio: 'pipe'` (not 'inherit'): inheriting this script's own stdout/
  // stderr keeps those file descriptors open for as long as the preview
  // server lives, which — if the server outlives us — blocks anything
  // reading our stdout (e.g. a `| tail` in a shell) from ever seeing EOF.
  const preview = spawn(join(ROOT, 'node_modules/.bin/vite'), ['preview', '--port', PORT, '--strictPort'], {
    cwd: ROOT,
    stdio: 'pipe',
  });
  const killPreview = async () => {
    preview.kill('SIGTERM');
    // `vite preview` can take a moment (or, in odd environments, never) to
    // exit on SIGTERM. A `setTimeout(...).unref()` here would let the
    // process exit before the timer ever fires, leaving the server
    // orphaned — so wait inline and escalate to SIGKILL instead.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
      preview.kill('SIGKILL');
    } catch {
      // already dead
    }
  };

  try {
    await waitForServer(`${PREVIEW_ORIGIN}/`);

    // Some environments (e.g. this repo's Claude Code sandbox) pre-provision
    // a Chromium build at $PLAYWRIGHT_BROWSERS_PATH/chromium that predates
    // whatever `playwright` version is in package.json, so the package's own
    // expected revision isn't present and outbound downloads are blocked.
    // Use that prebuilt browser when it's there; otherwise fall back to
    // Playwright's normal managed-browser resolution (the path CI takes).
    const sandboxChromium = process.env.PLAYWRIGHT_BROWSERS_PATH
      ? join(process.env.PLAYWRIGHT_BROWSERS_PATH, 'chromium')
      : null;
    const browser = await chromium.launch({
      timeout: 30000,
      ...(sandboxChromium && existsSync(sandboxChromium) ? { executablePath: sandboxChromium } : {}),
    });
    try {
      const context = await browser.newContext();

      // The production build's `base` is the site's absolute origin (see
      // `homepage` in package.json / `basePlugin` in vite.config.ts), so
      // every asset URL in the HTML points at production
      // (https://portfolio.lockhart.in/assets/...) — which doesn't exist
      // yet pre-deploy. Reroute those requests back to this preview server,
      // which is serving the exact same files straight from the build dir.
      await context.route(`${productionOrigin}/**`, async (route) => {
        const url = new URL(route.request().url());
        const res = await fetch(`${PREVIEW_ORIGIN}${url.pathname}${url.search}`);
        const body = Buffer.from(await res.arrayBuffer());
        await route.fulfill({
          status: res.status,
          headers: Object.fromEntries(res.headers.entries()),
          body,
        });
      });

      for (const routePath of routes) {
        await prerenderRoute(context, routePath);
      }
    } finally {
      await browser.close();
    }
  } finally {
    await killPreview();
  }
}

main().catch((err) => {
  console.warn('[prerender] skipped — deploying as a plain CSR SPA instead:', err.message);
  process.exit(0);
});
