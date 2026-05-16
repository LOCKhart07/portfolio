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
    const hrefs = renderNavAs('collaborator');
    // Desktop + mobile sidebar each render the set, so these appear twice.
    expect(hrefs).toContain('/profile/collaborator/skills');
    expect(hrefs).toContain('/profile/collaborator/work-experience');
    expect(hrefs).toContain('/profile/collaborator/projects');
    expect(hrefs).toContain('/profile/collaborator/contact-me');
  });

  test('no bare flat content links survive the persona migration', () => {
    const hrefs = renderNavAs('engineer');
    for (const flat of ['/skills', '/work-experience', '/projects', '/contact-me']) {
      expect(hrefs).not.toContain(flat);
    }
  });

  test('logo stays flat, Home points to the persona landing page', () => {
    const hrefs = renderNavAs('explorer');
    expect(hrefs).toContain('/'); // logo
    expect(hrefs).toContain('/profile/explorer'); // Home → persona landing page
    expect(hrefs).not.toContain('/browse'); // no longer the persona picker
  });

  test('switching persona changes the link targets', () => {
    expect(renderNavAs('recruiter')).toContain('/profile/recruiter/projects');
    expect(renderNavAs('engineer')).toContain('/profile/engineer/projects');
  });
});
