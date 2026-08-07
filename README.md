# vishwaskotegar.github.io

Personal portfolio site for Vishwas U.S. — GenAI Developer.

**Live:** [vishwaskotegar.github.io](https://vishwaskotegar.github.io/)

## What this is

A static site (no framework, no build step) — plain HTML, CSS, and vanilla JS,
hosted for free on GitHub Pages. Sections: hero, about, stack, experience,
projects, contact. The background is an ambient, always-scrolling "log feed"
styled after a RAG pipeline's logs (embed/retrieve/rerank/etc.).

## Structure

```
index.html            all page markup
css/styles.css         all styles
js/
  main.js               scrollspy nav, hero console typing effect, context-bar fill, scroll reveals
  log-field.js           the ambient background log animation
  projects.js             renders project cards from data/projects.json
data/projects.json      generated — the project cards shown on the site
scripts/
  dev-server.mjs           tiny static file server for local preview
  sync-projects.mjs         rebuilds data/projects.json from the GitHub API
.github/workflows/
  sync-projects.yml         runs sync-projects.mjs on a daily schedule
assets/                  résumé PDF, etc.
```

## Running locally

No install step — just Node.js (18+).

```bash
node scripts/dev-server.mjs
```

Serves the site at `http://localhost:4173`.

## How the projects section stays current

`data/projects.json` isn't hand-edited. `scripts/sync-projects.mjs` pulls your
public GitHub repos and keeps one only if it's not a fork/archived, and either
has a **Website** URL set on the repo or is tagged with the **`portfolio`**
topic. So: ship something, set its homepage URL or add the `portfolio` topic
on GitHub, and it shows up here automatically.

This runs on its own daily via the GitHub Action in
`.github/workflows/sync-projects.yml` — no manual step needed. To force it
sooner:

```bash
# via GitHub, no local checkout needed
gh workflow run sync-projects.yml --repo vishwaskotegar/vishwaskotegar.github.io

# or locally, writes straight to your working copy (commit + push after)
node scripts/sync-projects.mjs
```

## Deploying

Nothing to do — GitHub Pages auto-deploys from `main` on every push. Merge a
PR (or push directly for low-risk changes like this file) and the live site
updates within a minute or so.
