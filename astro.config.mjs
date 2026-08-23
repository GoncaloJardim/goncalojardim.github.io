import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// User site: repo is goncalojardim.github.io, served at the domain root.
export default defineConfig({
  site: 'https://goncalojardim.github.io',
  base: '/',
  integrations: [react()],
});
