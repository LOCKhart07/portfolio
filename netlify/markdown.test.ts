// @vitest-environment node
import { describe, expect, test } from 'vitest';
import handler from './edge-functions/markdown';
import { PROFILE, SITE_URL, personJsonLd } from '../src/site/profile';
import { SECTIONS } from '../src/persona/personas';

const fetchMarkdown = async () => {
  const response = await handler(
    new Request(`${SITE_URL}/`, { headers: { accept: 'text/markdown' } }),
    { next: () => Promise.reject(new Error('should not fall through')) } as never,
  );
  return { response, body: await response.text() };
};

// The markdown view used to be a hand-copied duplicate of the HTML head and
// drifted (it named a previous employer). It must now match the shared data.
describe('markdown-for-agents view of /', () => {
  test('serves markdown for Accept: text/markdown', async () => {
    const { response } = await fetchMarkdown();
    expect(response.headers.get('content-type')).toBe('text/markdown; charset=utf-8');
    expect(response.headers.get('vary')).toBe('Accept');
  });

  test('its JSON-LD block is exactly the Person data the HTML pages embed', async () => {
    const { body } = await fetchMarkdown();
    const json = body.match(/```json\n([\s\S]*?)\n```/)?.[1];
    expect(JSON.parse(json ?? 'null')).toEqual(personJsonLd());
  });

  test('front matter carries the shared title, description and keywords', async () => {
    const { body } = await fetchMarkdown();
    expect(body).toContain(`title: ${JSON.stringify(PROFILE.siteTitle)}`);
    expect(body).toContain(`description: ${JSON.stringify(PROFILE.description)}`);
    expect(body).toContain(`keywords: ${JSON.stringify(PROFILE.keywords.join(', '))}`);
  });

  test('links every built section under the canonical recruiter persona', async () => {
    const { body } = await fetchMarkdown();
    for (const section of SECTIONS) {
      expect(body).toContain(`](${SITE_URL}/profile/recruiter/${section})`);
    }
  });

  test('browsers fall through to the HTML page, marked as varying by Accept', async () => {
    const response = await handler(new Request(`${SITE_URL}/`, { headers: { accept: 'text/html' } }), {
      next: async () => new Response('<html></html>', { headers: { 'content-type': 'text/html' } }),
    } as never);
    expect(await response.text()).toBe('<html></html>');
    expect(response.headers.get('vary')).toBe('Accept');
  });
});
