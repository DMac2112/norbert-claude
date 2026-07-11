import { defineConfig } from 'astro/config';

// Static output (default). All content lives in src/content/site.json.
// Served from GitHub Pages as a project site: https://dmac2112.github.io/norbert-claude/
export default defineConfig({
  site: 'https://dmac2112.github.io',
  base: '/norbert-claude/',
});
