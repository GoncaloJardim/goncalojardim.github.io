import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// See plan Global Constraints for user-site vs project-site vs custom-domain.
export default defineConfig({
  site: 'https://goncalojardim.github.io',
  base: '/portfolio',
  integrations: [react()],
});
