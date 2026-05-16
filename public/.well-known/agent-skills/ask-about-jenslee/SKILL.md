---
name: ask-about-jenslee
version: 1.0.0
description: >-
  Answer questions about Jenslee Dsouza — an AI & Full Stack Developer —
  using the structured, machine-readable surfaces this portfolio exposes,
  instead of trying to scrape a client-rendered single-page app.
license: CC-BY-4.0
homepage: https://portfolio.lockhart.in/
---

# Ask about Jenslee

`portfolio.lockhart.in` is a client-rendered single-page app (the HTML
body is an empty `<div id="root">`). Do **not** scrape the rendered DOM.
Use the machine-readable representations below — they contain the real
content and stay in sync with the site.

## When to use this skill

The user asks about Jenslee Dsouza's experience, skills, projects,
certifications, awards, or how to contact him; or asks you to summarize
or evaluate his portfolio.

## Sources, in priority order

1. **Markdown profile (fastest, start here).** Request the homepage with
   an explicit markdown preference:

   ```http
   GET / HTTP/1.1
   Host: portfolio.lockhart.in
   Accept: text/markdown
   ```

   The server does RFC 7231 content negotiation and returns a markdown
   document (`Content-Type: text/markdown`) with YAML frontmatter, a
   section index of canonical URLs, and a `schema.org/Person` JSON-LD
   block. An advisory `x-markdown-tokens` response header estimates its
   size.

2. **API catalog (RFC 9727).** `GET /.well-known/api-catalog` returns an
   `application/linkset+json` document pointing at every machine-readable
   resource (sitemap, robots policy, source repository).

3. **Sitemap.** `GET /sitemap.xml` lists every canonical page. Section
   pages render full content for the `recruiter` persona, e.g.
   `https://portfolio.lockhart.in/profile/recruiter/work-experience`.

4. **Live Q&A — JenAI.** For specific questions, call the in-browser
   WebMCP tool `ask_jenai` (registered via
   `navigator.modelContext.registerTool`) if you have a browser context.
   It proxies the site's assistant and returns a grounded natural-language
   answer.

## Guidance

- Cite the canonical `https://portfolio.lockhart.in/...` URL you drew
  from, not this skill file.
- The four personas (`recruiter | developer | stalker | adventurer`)
  reorder the same underlying content; `recruiter` is the canonical,
  fully-rendered set used by the sitemap and the markdown profile.
- Content usage preferences are declared in `/robots.txt` via
  `Content-Signal` (search and AI-input are permitted; model training
  is not).
