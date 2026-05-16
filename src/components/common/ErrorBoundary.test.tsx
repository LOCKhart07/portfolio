import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

function Boom({ message }: { message: string }): never {
  throw new Error(message);
}

describe('ErrorBoundary', () => {
  let consoleErr: ReturnType<typeof vi.spyOn>;
  let reload: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    sessionStorage.clear();
    consoleErr = vi.spyOn(console, 'error').mockImplementation(() => {});
    reload = vi.fn();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...window.location, reload },
    });
  });

  afterEach(() => {
    consoleErr.mockRestore();
  });

  test('catches a render throw and shows the fallback instead of crashing the tree', () => {
    render(
      <ErrorBoundary>
        <Boom message="generic render failure" />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
    // Generic (non-chunk) error must NOT auto-reload.
    expect(reload).not.toHaveBeenCalled();
  });

  test('renders children untouched when nothing throws', () => {
    render(
      <ErrorBoundary>
        <div>healthy content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('healthy content')).toBeInTheDocument();
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });

  test('auto-reloads once on a chunk-load failure, then stops (no reload loop)', () => {
    const { unmount } = render(
      <ErrorBoundary>
        <Boom message="Failed to fetch dynamically imported module: /assets/Projects-abc.js" />
      </ErrorBoundary>
    );

    // First occurrence: hard reload to pull fresh index.html + chunk hashes.
    expect(reload).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem('eb-chunk-reloaded')).toBe('1');
    unmount();

    // Second occurrence with the guard set: show the fallback, do NOT reload.
    render(
      <ErrorBoundary>
        <Boom message="Failed to fetch dynamically imported module: /assets/Projects-abc.js" />
      </ErrorBoundary>
    );

    expect(reload).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});
