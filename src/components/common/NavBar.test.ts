// @vitest-environment node
import { describe, expect, test } from 'vitest';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { getContainerRenderer } from '@astrojs/react';
import { loadRenderers } from 'astro:container';
import NavBar from './NavBar.astro';

const renderNavAs = async (persona: string) => {
  const renderers = await loadRenderers([getContainerRenderer()]);
  const container = await AstroContainer.create({ renderers });
  const html = await container.renderToString(NavBar, { props: { persona } });
  return [...html.matchAll(/<a[^>]*href="([^"]*)"/g)].map((m) => m[1]);
};

describe('NavBar links', () => {
  test('content links are prefixed with the active persona', async () => {
    const hrefs = await renderNavAs('collaborator');
    // Desktop + mobile sidebar each render the set.
    expect(hrefs).toContain('/profile/collaborator/skills');
    expect(hrefs).toContain('/profile/collaborator/work-experience');
    expect(hrefs).toContain('/profile/collaborator/projects');
    expect(hrefs).toContain('/profile/collaborator/contact-me');
  });

  test('no bare flat content links', async () => {
    const hrefs = await renderNavAs('engineer');
    for (const flat of ['/skills', '/work-experience', '/projects', '/contact-me']) {
      expect(hrefs).not.toContain(flat);
    }
  });

  test('Home is the persona landing page; logo and avatar go to the profile picker', async () => {
    const hrefs = await renderNavAs('explorer');
    expect(hrefs).toContain('/profile/explorer');
    expect(hrefs.filter((h) => h === '/browse')).toHaveLength(2);
  });

  test('the contact link uses the persona-specific CTA label', async () => {
    const container = await AstroContainer.create({
      renderers: await loadRenderers([getContainerRenderer()]),
    });
    const html = await container.renderToString(NavBar, { props: { persona: 'recruiter' } });
    expect(html).toMatch(/href="\/profile\/recruiter\/contact-me"[^>]*>Hire Me</);
  });

  test('switching persona changes the link targets', async () => {
    expect(await renderNavAs('recruiter')).toContain('/profile/recruiter/projects');
    expect(await renderNavAs('engineer')).toContain('/profile/engineer/projects');
  });
});
