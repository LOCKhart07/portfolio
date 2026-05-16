import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

vi.mock('../queries/getProjects', () => ({ getProjects: vi.fn() }));
import { getProjects } from '../queries/getProjects';
import Projects from './Projects';

const mockedGetProjects = vi.mocked(getProjects);

describe('Projects page resilience', () => {
  beforeEach(() => {
    mockedGetProjects.mockReset();
  });

  test('renders projects on success (image-less project uses the initial fallback)', async () => {
    mockedGetProjects.mockResolvedValue([
      { title: 'Yutori', description: 'on-device tracker', techUsed: 'Kotlin, Android', image: null, link: 'https://x' },
    ] as never);

    render(<Projects />);

    expect(await screen.findByText('Yutori')).toBeInTheDocument();
    expect(screen.getByText('on-device tracker')).toBeInTheDocument();
    // image:null → first-letter fallback tile, not a broken <img>
    expect(screen.getByText('Y')).toBeInTheDocument();
  });

  test('a rejected CMS fetch shows an error message instead of hanging on "Loading..."', async () => {
    mockedGetProjects.mockRejectedValue(new Error('401 Unauthorized'));

    render(<Projects />);

    await waitFor(() =>
      expect(screen.getByText(/Couldn't load projects/i)).toBeInTheDocument()
    );
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  test('a non-array CMS response does not crash the route (regression: blank page)', async () => {
    // Reproduces the original defect: allProjects came back null, the old code
    // did setProjects(null) and `projects.length` threw in render, blanking
    // the whole app. The guard must coerce this to the empty state instead.
    mockedGetProjects.mockResolvedValue(null as never);

    render(<Projects />);

    expect(await screen.findByText('No projects to show yet.')).toBeInTheDocument();
  });
});
