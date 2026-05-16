// Vitest setup: jest-dom matchers + per-test DOM cleanup.
// globals are disabled, so RTL's automatic cleanup is off — do it explicitly.
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// jsdom doesn't implement HTMLMediaElement.play(); NetflixTitle calls it on
// mount. Stub it so the splash render doesn't emit "Not implemented" noise.
window.HTMLMediaElement.prototype.play = () => Promise.resolve();

afterEach(() => {
  cleanup();
});
