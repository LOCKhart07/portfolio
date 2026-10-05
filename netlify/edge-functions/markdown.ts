// Markdown for Agents — RFC 7231 content negotiation on the homepage.
//
// Browsers send `Accept: text/html,...` and keep getting the HTML page.
// Agents that send `Accept: text/markdown` get a markdown representation
// of the page instead, with `Content-Type: text/markdown; charset=utf-8`,
// an estimated `x-markdown-tokens` count, and `Vary: Accept` so the CDN
// keys the two representations separately.
//
// "/" is the Netflix-style intro splash, which has almost no text of its
// own to convert. The useful markdown representation is the site's
// metadata + structured data + the real navigable routes — mirroring
// Cloudflare's three-part shape (YAML frontmatter, body markdown, JSON-LD
// fenced block).

import type { Context } from 'https://edge.netlify.com';
import { PROFILE, SITE_URL, personJsonLd } from '../../src/site/profile.ts';
import { SECTIONS } from '../../src/persona/personas.ts';

// Built from the same profile data as the HTML <head> and JSON-LD
// (src/site/profile.ts) and the same section list the pages are generated
// from, so this view can't drift from the site again.
const sectionTitle = (slug: string) =>
  slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const yaml = (value: string) => JSON.stringify(value);

export const MARKDOWN = `---
title: ${yaml(PROFILE.siteTitle)}
description: ${yaml(PROFILE.description)}
author: ${yaml(PROFILE.name)}
url: "${SITE_URL}/"
image: "${SITE_URL}/og-image.jpg"
keywords: ${yaml(PROFILE.keywords.join(', '))}
generator: "markdown-for-agents (Netlify Edge Function)"
---

# ${PROFILE.name}: ${PROFILE.jobTitle}

${PROFILE.description}

This portfolio is a prerendered site styled as a Netflix clone; content
is served per "profile" persona. The canonical, crawlable URLs below
serve the full content for the recruiter persona as plain HTML.

## Sections

- [Browse / profile picker](${SITE_URL}/browse)
- [Profile landing](${SITE_URL}/profile/recruiter)
${SECTIONS.map((s) => `- [${sectionTitle(s)}](${SITE_URL}/profile/recruiter/${s})`).join('\n')}

## Machine-readable resources

- [Sitemap](${SITE_URL}/sitemap.xml)
- [API catalog (RFC 9727)](${SITE_URL}/.well-known/api-catalog)
- [Agent Skills index (RFC v0.2.0)](${SITE_URL}/.well-known/agent-skills/index.json)
- [robots.txt + Content-Signal](${SITE_URL}/robots.txt)

## Structured data

\`\`\`json
${JSON.stringify(personJsonLd(), null, 2)}
\`\`\`
`;

// Rough token estimate (~4 chars/token) — same heuristic class Cloudflare
// uses for an *estimated* count; it is advisory, not exact.
const TOKEN_ESTIMATE = String(Math.ceil(MARKDOWN.length / 4));

const wantsMarkdown = (accept: string | null): boolean =>
  !!accept && accept.toLowerCase().includes('text/markdown');

export default async (request: Request, context: Context): Promise<Response> => {
  if (wantsMarkdown(request.headers.get('accept'))) {
    return new Response(MARKDOWN, {
      status: 200,
      headers: {
        'content-type': 'text/markdown; charset=utf-8',
        'x-markdown-tokens': TOKEN_ESTIMATE,
        vary: 'Accept',
        'cache-control': 'public, max-age=300',
      },
    });
  }

  // Browsers and crawlers: serve the normal HTML page, but advertise that
  // the response varies by Accept so a shared cache won't cross the wires.
  const response = await context.next();
  const html = new Response(response.body, response);
  const existingVary = html.headers.get('vary');
  html.headers.set(
    'vary',
    existingVary && !/(^|,\s*)accept(\s*,|$)/i.test(existingVary)
      ? `${existingVary}, Accept`
      : existingVary ?? 'Accept',
  );
  return html;
};
