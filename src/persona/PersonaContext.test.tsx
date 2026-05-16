import { test, expect, describe, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { PersonaProvider, usePersona } from './PersonaContext';
import PersonaIntro from './PersonaIntro';
import { LegacyRedirect } from '../routes';

beforeEach(() => {
  localStorage.clear();
});

const PersonaProbe = () => {
  const { persona } = usePersona();
  return <span data-testid="persona">{persona}</span>;
};

const LocationProbe = () => (
  <span data-testid="loc">{useLocation().pathname}</span>
);

const atRoute = (path: string, entry: string, element: React.ReactNode) =>
  render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path={path} element={element} />
        <Route path="/profile/:profileName/projects" element={<LocationProbe />} />
      </Routes>
    </MemoryRouter>,
  );

describe('PersonaProvider', () => {
  test('resolves the persona from the :profileName URL segment', () => {
    atRoute(
      '/profile/:profileName/*',
      '/profile/developer/skills',
      <PersonaProvider><PersonaProbe /></PersonaProvider>,
    );
    expect(screen.getByTestId('persona')).toHaveTextContent('developer');
  });

  test('caches the active persona to localStorage', () => {
    atRoute(
      '/profile/:profileName/*',
      '/profile/adventurer/skills',
      <PersonaProvider><PersonaProbe /></PersonaProvider>,
    );
    expect(localStorage.getItem('lastPersona')).toBe('adventurer');
  });

  test('redirects an invalid persona segment to the recruiter equivalent', () => {
    // Probe the URL, not the coerced persona: usePersona would report
    // "recruiter" even without a redirect, so asserting the persona alone
    // would still pass if <Navigate> were removed. The pathname only becomes
    // /profile/recruiter/... if the redirect actually fired.
    render(
      <MemoryRouter initialEntries={['/profile/foobar/projects']}>
        <Routes>
          <Route
            path="/profile/:profileName/projects"
            element={<PersonaProvider><LocationProbe /></PersonaProvider>}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('loc')).toHaveTextContent('/profile/recruiter/projects');
  });

  test('keeps the rest of the path when fixing the persona segment', () => {
    render(
      <MemoryRouter initialEntries={['/profile/xyz/skills']}>
        <Routes>
          <Route
            path="/profile/:profileName/skills"
            element={<PersonaProvider><LocationProbe /></PersonaProvider>}
          />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('loc')).toHaveTextContent('/profile/recruiter/skills');
  });
});

test('usePersona outside a provider falls back to recruiter without throwing', () => {
  render(<PersonaProbe />);
  expect(screen.getByTestId('persona')).toHaveTextContent('recruiter');
});

describe('LegacyRedirect', () => {
  test('no stored persona => redirects to the recruiter path', () => {
    render(
      <MemoryRouter initialEntries={['/projects']}>
        <Routes>
          <Route path="/projects" element={<LegacyRedirect section="projects" />} />
          <Route path="/profile/:profileName/projects" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('loc')).toHaveTextContent('/profile/recruiter/projects');
  });

  test('uses the last-used persona from localStorage when present', () => {
    localStorage.setItem('lastPersona', 'stalker');
    render(
      <MemoryRouter initialEntries={['/projects']}>
        <Routes>
          <Route path="/projects" element={<LegacyRedirect section="projects" />} />
          <Route path="/profile/:profileName/projects" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('loc')).toHaveTextContent('/profile/stalker/projects');
  });

  test('a garbage stored persona is coerced, not trusted', () => {
    localStorage.setItem('lastPersona', 'hacker');
    render(
      <MemoryRouter initialEntries={['/projects']}>
        <Routes>
          <Route path="/projects" element={<LegacyRedirect section="projects" />} />
          <Route path="/profile/:profileName/projects" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('loc')).toHaveTextContent('/profile/recruiter/projects');
  });
});

describe('PersonaIntro', () => {
  const renderIntro = (entry: string, section: string) =>
    render(
      <MemoryRouter initialEntries={[entry]}>
        <Routes>
          <Route
            path="/profile/:profileName/*"
            element={
              <PersonaProvider>
                <PersonaIntro section={section} />
              </PersonaProvider>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

  test('renders the persona-specific copy for the section', () => {
    renderIntro('/profile/developer/projects', '/projects');
    expect(screen.getByText(/Builds I actually wrote/)).toBeInTheDocument();
  });

  test('same section, different persona => different copy (not a constant)', () => {
    renderIntro('/profile/recruiter/projects', '/projects');
    expect(screen.getByText(/Shipped work with measurable outcomes/)).toBeInTheDocument();
  });

  test('renders nothing when the persona has no copy for the section', () => {
    // developer has no "/music" entry in personaContent.
    const { container } = renderIntro('/profile/developer/music', '/music');
    expect(container.querySelector('.persona-intro')).toBeNull();
  });
});
