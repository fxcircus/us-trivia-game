# US Trivia Game

Flashcards, mixed-format trivia, and a memorize-from-memory mode for American civics, presidents, Constitution, and speeches.

Live: https://fxcircus.github.io/us-trivia-game/

## Stack

- Vite + React 18
- lucide-react icons
- Persists progress in `localStorage`
- Deployed to GitHub Pages via `.github/workflows/deploy.yml`

## Develop locally

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`). Hot-reload is on.

## Build

```bash
npm run build      # outputs to dist/
npm run preview    # serve the production build locally
```

## Content

All content lives in `src/data/`:

- `wiki.js` — reference chapters (presidents, amendments, symbols, inventors, founding documents, speeches)
- `questions.js` — the trivia question pool (multiple choice, true/false, complete-the-text, match-year, order)
- `speeches.js` — full passages for the Memorize mode. **Scaffolded with URLs — paste text into each `lines: []` array to enable that speech.**

The Memorize tab automatically hides speeches whose `lines` array is empty, so you can fill them in one at a time.

## Deploy (GitHub Pages)

Pushes to `main` auto-deploy via `.github/workflows/deploy.yml` (`actions/configure-pages` + `actions/upload-pages-artifact` + `actions/deploy-pages`).

One-time repo setup:

1. On GitHub → repo → **Settings → Pages → Build and deployment** → **Source: GitHub Actions**.
2. The first push to `main` triggers the workflow; subsequent pushes redeploy.

### Using a different repo name

The Vite `base` path must match your GH Pages URL. Default is `/us-trivia-game/`. To change it:

```bash
# temporary, for a single build
VITE_BASE=/my-other-repo/ npm run build

# permanent — edit vite.config.js
```

In the deploy workflow, you can also add:

```yaml
- run: npm run build
  env:
    VITE_BASE: /my-other-repo/
```

## Project layout

```
src/
  App.jsx           # all views + Memorize mode + scoring
  main.jsx          # React entry
  index.css         # minimal reset
  data/
    wiki.js         # reference content
    questions.js    # trivia pool
    speeches.js     # Memorize passages (paste text in)
.github/workflows/
  deploy.yml        # GH Pages CI
```
