import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react()],
  output: 'static',
  trailingSlash: 'always',
  site: 'https://1-muscle-to-arm-wrestle.pages.dev',
  vite: {
    plugins: [tailwindcss()],
  },
});
