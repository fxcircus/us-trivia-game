import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// For GitHub Pages project sites the app is served from
// https://<user>.github.io/<repo>/, so Vite needs the repo name as the base.
// Override with `VITE_BASE=/my-repo/ npm run build` if the repo is renamed.
const base = process.env.VITE_BASE ?? '/us-trivia-game/';

export default defineConfig({
  plugins: [react()],
  base,
});
