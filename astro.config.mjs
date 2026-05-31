import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [react(), sitemap()],
  output: 'static',
  trailingSlash: 'always',
  site: 'https://1-muscle-to-arm-wrestle.pages.dev',
  vite: {
    plugins: [tailwindcss()],
  },
});
