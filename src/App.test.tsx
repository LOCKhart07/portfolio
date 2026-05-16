import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Smoke test: the real App (routing, page tracking, consent banner, chatbot)
// must mount and render the splash route without throwing. Fails if App or
// any eagerly-rendered child crashes, or the route table is misconfigured.
test('mounts and renders the splash screen', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByAltText('Custom Logo')).toBeInTheDocument();
});
