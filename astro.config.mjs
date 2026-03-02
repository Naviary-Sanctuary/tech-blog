import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: "https://tech.navaiary.io",
  output: "static",
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()]
  },
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'en'],
    routing: {
      prefixDefaultLocale: true,
      strategy: "prefix",
    },
  },
  integrations: [mdx({
    syntaxHighlight: 'shiki',
    shikiConfig: { theme: "material-theme" }
  })]
});
