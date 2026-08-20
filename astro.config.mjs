import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import keystatic from '@keystatic/astro';

// Content pages are static (SSG). The Keystatic admin (/keystatic) and its API
// (/api/keystatic) are injected by the keystatic() integration as on-demand
// routes and run serverless on Vercel.
export default defineConfig({
  site: 'https://portfolio.rohitg.in',
  output: 'static',
  adapter: vercel({ webAnalytics: { enabled: true } }),
  integrations: [react(), keystatic()],
});
