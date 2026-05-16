import { test, expect, describe } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Navbar from './NavBar';
import { PersonaProvider } from '../../persona/PersonaContext';

const renderNavAs = (persona: string) => {
  const { container } = render(
    <MemoryRouter initialEntries={[`/profile/${persona}/skills`]}>
      <Routes>
        <Route
          path="/profile/:profileName/*"
          element={
            <PersonaProvider>
              <Navbar />
            </PersonaProvider>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
  return Array.from(container.querySelectorAll('a')).map(
    (a) => a.getAttribute('href') ?? '',
  );
};

describe('Navbar links', () => {
  test('content links are prefixed with the active persona', () => {
    const hrefs = renderNavAs('stalker');
    // Desktop + mobile sidebar each render the set, so these appear twice.
    expect(hrefs).toContain('/profile/stalker/skills');
    expect(hrefs).toContain('/profile/stalker/work-experience');
    expect(hrefs).toContain('/profile/stalker/projects');
    expect(hrefs).toContain('/profile/stalker/contact-me');
  });

  test('no bare flat content links survive the persona migration', () => {
    const hrefs = renderNavAs('developer');
    for (const flat of ['/skills', '/work-experience', '/projects', '/contact-me']) {
      expect(hrefs).not.toContain(flat);
    }
  });

  test('persona-independent links stay flat', () => {
    const hrefs = renderNavAs('adventurer');
    expect(hrefs).toContain('/'); // logo
    expect(hrefs).toContain('/browse'); // Home
  });

  test('switching persona changes the link targets', () => {
    expect(renderNavAs('recruiter')).toContain('/profile/recruiter/projects');
    expect(renderNavAs('developer')).toContain('/profile/developer/projects');
  });
});
