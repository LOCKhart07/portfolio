// Markdown for Agents — RFC 7231 content negotiation on the homepage.
//
// Browsers send `Accept: text/html,...` and keep getting the React SPA.
// Agents that send `Accept: text/markdown` get a markdown representation
// of the page instead, with `Content-Type: text/markdown; charset=utf-8`,
// an estimated `x-markdown-tokens` count, and `Vary: Accept` so the CDN
// keys the two representations separately.
//
// This site is a client-rendered SPA: the HTML body is an empty
// `<div id="root">`, so there is no server HTML to convert. The honest,
// useful markdown representation is the page's own metadata + structured
// data + the real navigable routes — mirroring Cloudflare's three-part
// shape (YAML frontmatter, body markdown, JSON-LD fenced block).

import type { Context } from 'https://edge.netlify.com';

const MARKDOWN = `---
title: "Jenslee Dsouza | Software Developer focused on Backend, AI & Web3"
description: "Software developer focused on backend, AI, and Web3. I build scalable backend services, AI-powered applications, and decentralized Web3 systems, primarily with Python, Java, and Spring Boot."
author: "Jenslee Dsouza"
url: "https://portfolio.lockhart.in/"
image: "https://portfolio.lockhart.in/og-image.jpg"
keywords: "Software Developer, Backend Developer, AI Developer, Web3 Developer, Machine Learning Engineer, Python, Java, Spring Boot, Smart Contracts, Decentralized Applications, Deep Learning, Neural Networks"
generator: "markdown-for-agents (Netlify Edge Function)"
---

# Jenslee Dsouza: Software Developer focused on Backend, AI & Web3

Software developer focused on backend, AI, and Web3. I build scalable
backend services, AI-powered applications, and decentralized Web3
systems, primarily with Python, Java, and Spring Boot.

This portfolio is a client-rendered single-page app styled as a Netflix
clone; content is served per "profile" persona. The canonical,
crawlable URLs below render the full content for the recruiter persona.

## Sections

- [Browse / profile picker](https://portfolio.lockhart.in/browse)
- [Profile landing](https://portfolio.lockhart.in/profile/recruiter)
- [Work Experience](https://portfolio.lockhart.in/profile/recruiter/work-experience)
- [Projects](https://portfolio.lockhart.in/profile/recruiter/projects)
- [Skills](https://portfolio.lockhart.in/profile/recruiter/skills)
- [Certifications](https://portfolio.lockhart.in/profile/recruiter/certifications)
- [Recommendations](https://portfolio.lockhart.in/profile/recruiter/recommendations)
- [Awards](https://portfolio.lockhart.in/profile/recruiter/awards)
- [Contact](https://portfolio.lockhart.in/profile/recruiter/contact-me)
- [Music](https://portfolio.lockhart.in/profile/recruiter/music)
- [Quotes](https://portfolio.lockhart.in/profile/recruiter/quotes)

## Machine-readable resources

- [Sitemap](https://portfolio.lockhart.in/sitemap.xml)
- [API catalog (RFC 9727)](https://portfolio.lockhart.in/.well-known/api-catalog)
- [Agent Skills index (RFC v0.2.0)](https://portfolio.lockhart.in/.well-known/agent-skills/index.json)
- [robots.txt + Content-Signal](https://portfolio.lockhart.in/robots.txt)

## Structured data

\`\`\`json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Jenslee Dsouza",
  "url": "https://portfolio.lockhart.in/",
  "jobTitle": "Software Developer focused on Backend, AI & Web3",
  "sameAs": [
    "https://github.com/jenslee",
    "https://linkedin.com/in/jenslee"
  ],
  "knowsAbout": [
    "Backend Development",
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "Web3",
    "Smart Contracts",
    "Decentralized Applications",
    "Python",
    "Java",
    "Spring Boot",
    "Neural Networks"
  ],
  "worksFor": {
    "@type": "Organization",
    "name": "LTIMindtree",
    "url": "https://www.ltimindtree.com/"
  }
}
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

  // Browsers and crawlers: serve the normal SPA HTML, but advertise that
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
