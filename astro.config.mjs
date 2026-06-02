import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [
    react(),
    sitemap({
      filter: (page) => {
        const url = new URL(page);
        return ![
          '/calculator/',
          '/tier-list/',
        ].includes(url.pathname) && !url.pathname.startsWith('/tier-list/');
      },
    }),
  ],
  output: 'static',
  trailingSlash: 'always',
  site: 'https://1-muscle-to-arm-wrestle.pages.dev',
  vite: {
    plugins: [tailwindcss()],
  },
});
