import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Projects from './Projects';
import type { Project } from '../../types/types';

const project = (overrides: Partial<Project> = {}): Project => ({
  title: 'Yutori',
  description: 'on-device tracker',
  techUsed: 'Kotlin, Android',
  image: null,
  link: 'https://example.com/yutori',
  ...overrides,
});

describe('Projects', () => {
  test('renders each project with an initial fallback tile when it has no image', () => {
    const { container } = render(<Projects projects={[project()]} />);

    expect(screen.getByText('Yutori')).toBeInTheDocument();
    expect(screen.getByText('on-device tracker')).toBeInTheDocument();
    // image:null → first-letter fallback tile, not a broken <img>
    expect(screen.getByText('Y')).toBeInTheDocument();
    expect(container.querySelector('img')).toBeNull();
  });

  test('requests a compressed, width-capped Imgix rendition of the card image', () => {
    render(<Projects projects={[project({ image: { url: 'https://www.datocms-assets.com/card.png' } })]} />);

    expect(screen.getByRole('img', { name: 'Yutori' })).toHaveAttribute(
      'src',
      'https://www.datocms-assets.com/card.png?auto=format,compress&w=900&fit=max',
    );
  });

  test('a linked project is a new-tab anchor tagged for click tracking', () => {
    render(<Projects projects={[project()]} />);

    const card = screen.getByRole('link');
    expect(card).toHaveAttribute('href', 'https://example.com/yutori');
    expect(card).toHaveAttribute('target', '_blank');
    expect(card).toHaveAttribute('data-track', 'Project|Click|Yutori');
  });

  test('a project without a link is not rendered as a link', () => {
    render(<Projects projects={[project({ link: '' })]} />);

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByText('Yutori')).toBeInTheDocument();
  });

  test('splits techUsed into one badge per technology', () => {
    render(<Projects projects={[project({ techUsed: 'Kotlin, Android' })]} />);

    expect(screen.getByText(/Kotlin/).closest('.tech-badge')).not.toBeNull();
    expect(screen.getByText(/Android/).closest('.tech-badge')).not.toBeNull();
  });

  test('a non-array CMS response renders the empty state (regression: blank page)', () => {
    // allProjects once came back null; the old code called `.length` on it
    // in render and blanked the whole app.
    render(<Projects projects={null} />);

    expect(screen.getByText('No projects to show yet.')).toBeInTheDocument();
  });
});
