import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// GitHub Pages user site: https://patrickndevelopment.github.io/ (base '/').
// The build renders every page to static HTML at build time (src/render.tsx, scripts/prerender.mjs).
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: { emptyOutDir: true },
  test: {
    include: ['tests/**/*.test.ts?(x)'],
    environment: 'node',
  },
});
