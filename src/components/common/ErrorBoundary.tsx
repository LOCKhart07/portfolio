import React from 'react';
import 'styles/ErrorBoundary.css';

// A render error or a failed lazy-chunk import previously took down the WHOLE
// app — there was no error boundary, so React unmounted the tree and the page
// went blank white (this is what "the projects page is blank" actually was:
// either getProjects() returning a non-array → TypeError in render, or a stale
// deploy 404ing Projects-<hash>.js after a redeploy).
//
// This boundary contains the failure to a dark fallback instead. A failed
// dynamic import is almost always a stale deploy: the index.html in the tab
// references chunk hashes the server no longer has. One automatic hard reload
// fixes that; a sessionStorage guard makes it reload at most once so a genuine
// (non-stale) error can't loop.

const RELOAD_GUARD_KEY = 'eb-chunk-reloaded';

const isChunkLoadError = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : String(error ?? '');
  return (
    /Loading (CSS )?chunk .* failed/i.test(message) ||
    /Failed to fetch dynamically imported module/i.test(message) ||
    /error loading dynamically imported module/i.test(message) ||
    /Importing a module script failed/i.test(message)
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown): void {
    // Stale-deploy chunk failure: hard-reload once to pull fresh index.html
    // + chunk hashes. The guard prevents a reload loop on a real error.
    if (isChunkLoadError(error)) {
      let alreadyReloaded = false;
      try {
        alreadyReloaded = sessionStorage.getItem(RELOAD_GUARD_KEY) === '1';
        if (!alreadyReloaded) {
          sessionStorage.setItem(RELOAD_GUARD_KEY, '1');
        }
      } catch {
        /* storage disabled — skip the auto-reload, show the fallback */
      }
      if (!alreadyReloaded) {
        window.location.reload();
        return;
      }
    }
    // eslint-disable-next-line no-console
    console.error('Uncaught error rendering route:', error);
  }

  private handleReload = (): void => {
    try {
      sessionStorage.removeItem(RELOAD_GUARD_KEY);
    } catch {
      /* non-fatal */
    }
    window.location.reload();
  };

  render(): React.ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }
    return (
      <div className="error-boundary" role="alert">
        <div className="error-boundary-card">
          <h1>Something went wrong</h1>
          <p>
            This page failed to load. This is usually a temporary hiccup or a
            cached older version of the site.
          </p>
          <button type="button" onClick={this.handleReload} className="error-boundary-button">
            Reload
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
