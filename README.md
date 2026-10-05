# Portfolio

Personal portfolio for **Lee Chee Tat** — a small, fast, single-page site built
with [Hugo](https://gohugo.io/) and deployed to **GitHub Pages**.

Live at: https://bugscoderlab.github.io/portfolio/

## Design notes

- Clean, minimal, light-first. One accent colour (deep emerald).
- Type is self-hosted **Geist / Geist Mono** (variable `woff2`, ~70 KB each) —
  no third-party font requests.
- Respects `prefers-color-scheme` (there is a matching dark theme).
- Entrance motion is CSS-only and honours `prefers-reduced-motion`; scroll
  reveals use `IntersectionObserver` (no scroll listeners).
- No JS framework, no CSS framework. One stylesheet, one small script.

## Editing content

You should not need to touch the HTML. Content lives in plain files:

| What | File |
| --- | --- |
| Name, role, summary, quote, links | `hugo.toml` (`[params]`) |
| Hero "at a glance" panel | `data/facts.yaml` |
| Work history | `data/experience.yaml` |
| Projects | `data/projects.yaml` |
| Skills | `data/skills.yaml` |
| Education | `data/education.yaml` |
| Section markup | `layouts/index.html` |
| Styling | `assets/css/style.css` |

Edit a data file, save, and the dev server reloads.

## Local development

Requires Hugo **extended** (v0.146+). On macOS:

```bash
brew install hugo
```

Then, from this folder:

```bash
hugo server
# open http://localhost:1313/portfolio/
```

Build the static output into `public/`:

```bash
hugo --gc --minify
```

## Deployment

Pushing to `main` triggers `.github/workflows/hugo.yml`, which installs Hugo,
builds the site, and publishes it with GitHub's official Pages actions.

One-time setup (already done for this repo): the Pages **source** must be set to
**GitHub Actions** in the repository settings. Via the API:

```bash
gh api -X POST repos/bugscoderlab/portfolio/pages -f build_type=workflow
```

To redeploy without a new commit: **Actions → “Build and deploy Hugo site” →
Run workflow**, or `gh workflow run hugo.yml`.

## Structure

```
.
├── hugo.toml                 # site config + params
├── content/_index.md
├── data/                     # all editable content
├── layouts/
│   ├── _default/baseof.html
│   ├── partials/             # head, header, footer, icon
│   └── index.html            # the page
├── assets/                   # css + js (Hugo Pipes: minified + fingerprinted)
├── static/                   # fonts, favicon, .nojekyll (copied as-is)
└── .github/workflows/hugo.yml
```
