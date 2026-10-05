/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

// Tests share Astro's Vite resolution (tsconfig path aliases, image imports
// as ImageMetadata, the process.env defines). Files that render .astro
// components opt into `// @vitest-environment node`.
export default getViteConfig({
  // Pin a fake GA id so analytics tests exercise the enabled path no matter
  // what the local .env contains.
  define: { 'process.env.REACT_APP_GA_TRACKING_ID': JSON.stringify('G-TEST') },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: false,
    restoreMocks: true,
  },
});
