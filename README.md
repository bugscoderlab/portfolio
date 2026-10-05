# Portfolio

Personal portfolio for **Lee Chee Tat** — a small, fast, single-page site built
with [**Hugo**](https://gohugo.io/) and deployed to **GitHub Pages**.

Live at: https://bugscoderlab.github.io/portfolio/

> **Not Jekyll.** This is Hugo. Almost everything you'll want to change is in a
> YAML file or in `hugo.toml` — you rarely need to touch HTML.

---

## Where is my content?

| I want to change… | Edit this file |
| --- | --- |
| Name, role, tagline, about text, quote, email, social links | `hugo.toml` → `[params]` |
| The hero "at a glance" box | `data/facts.yaml` |
| Work history | `data/experience.yaml` |
| **Projects** (the "Selected projects" cards) | `data/projects.yaml` |
| Skills | `data/skills.yaml` |
| Education | `data/education.yaml` |
| Screenshots for projects | drop files in `static/images/` |
| Colours, spacing, fonts | `assets/css/style.css` |
| The actual page structure | `layouts/index.html` |

Every one of these is plain text. Save the file and the running dev server
refreshes automatically; commit and push and the live site updates.

---

## Adding a project (even one that is only a screenshot)

The projects are **already** driven by `data/projects.yaml` — the HTML just loops
over that list. To add one:

1. **Put the screenshot in `static/images/`**, e.g. `static/images/my-app.png`.
2. **Add an entry at the bottom of `data/projects.yaml`**:

   ```yaml
   - title: "My new app"
     image: "my-app.png"      # just the filename, not the path
     blurb: "One short sentence about it."
     stack: ["PHP", "MySQL"]
     link: ""                 # optional, links the title
   ```

That's it. A card can be as small as an image plus a title:

```yaml
- title: "Side project"
  image: "side-project.png"
```

Notes:

- **Order in the file = order on the page.** Move a block up or down to reorder.
- Only `title` is required; delete any line you don't need.
- Images are shown in a 16:10 crop (`object-fit: cover`), so screenshots look
  best if they're roughly widescreen. Use `png`, `jpg` or `webp`.
- To remove a project, delete its whole block (starting at `- title:`).

---

## Light / dark theme

There is a **toggle button in the top-right corner**. Behaviour:

- On first visit it follows your operating system's light/dark setting.
- Once a visitor clicks the toggle, their choice is remembered
  (`localStorage`) and the site stops following the OS for them.
- The theme is applied by a tiny inline script in `layouts/partials/head.html`
  *before* the page paints, so there's no flash.

To change the actual colours, edit the `:root { … }` (light) and
`:root[data-theme="dark"] { … }` (dark) blocks in `assets/css/style.css`.

---

## Changing the layout

Hugo's templating is: **content → layout → output**. The layout is a few files:

```
layouts/
├── _default/baseof.html    ← the HTML shell: <head>, header, <main>, footer
├── partials/
│   ├── head.html           ← everything inside <head> (meta, fonts, CSS)
│   ├── header.html         ← top bar: name, nav, theme toggle
│   ├── footer.html         ← bottom bar
│   └── icon.html           ← inline SVG icons (github, sun, moon)
└── index.html              ← the home page: all the sections, in order
```

- **Reorder or remove a section:** move/delete the matching `<section>` block in
  `layouts/index.html` (e.g. the `{{/* ===== PROJECTS ===== */}}` block).
- **Change what a section shows:** the data comes from `hugo.Data.<name>`, which
  maps to `data/<name>.yaml`.
- **Restyle without touching HTML:** edit `assets/css/style.css`. The class names
  line up with the sections (`.hero`, `.role`, `.project`, `.skills`, …).
- **Add a whole new page** (e.g. `/blog`): create `content/blog.md`, and it
  renders through `layouts/_default/single.html` (you'd add that template).

### If it were Jekyll instead

The idea is the same but the folders differ, in case you ever migrate:

| | Hugo (this site) | Jekyll |
| --- | --- | --- |
| Layouts | `layouts/` (Go templates `{{ }}`) | `_layouts/` (Liquid `{% %}`) |
| Reusable chunks | `layouts/partials/` | `_includes/` |
| Data files | `data/*.yaml` (same!) | `_data/*.yaml` |
| Config | `hugo.toml` | `_config.yml` |
| Build output | `public/` | `_site/` |
| Build tool | `hugo` (a single binary) | `bundle exec jekyll` (Ruby gems) |

You can't mix them: template syntax and folders are not interchangeable.

---

## Local development

Requires Hugo **extended** (v0.146+):

```bash
brew install hugo
hugo server
# open http://localhost:1313/portfolio/
```

Build the static output into `public/`:

```bash
hugo --gc --minify
```

---

## Deployment

Pushing to `main` triggers `.github/workflows/hugo.yml`, which installs Hugo,
builds the site, and publishes it with GitHub's official Pages actions. The
Pages **source** is set to **GitHub Actions** (one-time setup, already done):

```bash
gh api -X POST repos/bugscoderlab/portfolio/pages -f build_type=workflow
```

To redeploy without a new commit: **Actions → “Build and deploy Hugo site” →
Run workflow**, or `gh workflow run hugo.yml`.

---

## Structure

```
.
├── hugo.toml                 # site config + params (name, links, about text)
├── content/_index.md
├── data/                     # all editable content (yaml)
│   ├── facts.yaml
│   ├── experience.yaml
│   ├── projects.yaml
│   ├── skills.yaml
│   └── education.yaml
├── layouts/                  # templates
├── assets/                   # css + js (minified + fingerprinted by Hugo)
├── static/                   # copied as-is: fonts/, images/, favicon.svg
└── .github/workflows/hugo.yml
```
