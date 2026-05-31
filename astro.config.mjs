import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  integrations: [react()],
  output: 'static',
  trailingSlash: 'always',
  site: 'https://muscle-arm-wrestle.gg',
  vite: {
    plugins: [tailwindcss()],
  },
});
