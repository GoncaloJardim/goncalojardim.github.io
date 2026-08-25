# Development

Setup and authoring notes for this site (a static [Astro](https://astro.build) site with React Flow diagram islands, deployed to GitHub Pages).

## Prerequisites
- Node.js >= 20.3
- npm

## Commands

```bash
npm run dev      # start the dev server (http://localhost:4321/)
npm run build    # build to dist/
npm run preview  # preview the production build locally
npm run test     # run the Vitest unit tests
npm run check    # type-check with astro check
```

## Adding a project

Projects live as Markdown files in `src/content/projects/`. Add one by creating `src/content/projects/<slug>.md`. The YAML frontmatter drives both the impact tiles and the animated diagram; the Markdown body is the case study.

```markdown
---
title: "Project Name"
pitch: "One-line pitch."
order: 1
featured: true
tech: ["Python", "Snowflake", "dbt"]
repo: "https://github.com/user/repo"   # or null
metrics:
  - { value: "~10x", label: "some outcome" }
diagram:
  nodes:
    - { id: "source", label: "Data source", tech: "API", group: "source", detail: "What happens here." }
    - { id: "sink", label: "Activation", tech: "CRM", group: "sink", detail: "What happens here." }
  edges:
    - { from: "source", to: "sink" }
---

The problem, what I built, how it works, impact.
```

Schema (enforced at build time in `src/content.config.ts`):
- `title`, `pitch`, `order` (number), `tech` (string[]), `metrics` (`{value,label}[]`), `diagram` (`{nodes, edges}`) are required.
- `featured` (boolean, default false) and `repo` (URL or null) are optional.
- Every `diagram.edges` entry must reference `from`/`to` ids that exist in `diagram.nodes`, and the graph must be a DAG.

## Tech stack page

The `/stack` page is driven by `src/data/stack.ts` (tools grouped by category). A tool renders its logo when `logo` points to a file in `public/logos/`; otherwise it falls back to a text tile. Set `lockup: true` when the logo already contains the wordmark so it renders without a duplicate text label. All logos are forced to black via a CSS filter for a uniform look, so transparent-background SVGs or PNGs work best.

## GitHub Pages

`astro.config.mjs` is set up as a **user site** (repo `goncalojardim.github.io`): `site: 'https://goncalojardim.github.io'`, `base: '/'`.

Alternatives:
- **Project site** (repo named e.g. `portfolio`): `base: '/portfolio'`.
- **Custom domain**: set `site` to the domain, `base: '/'`, and add a `public/CNAME` file containing the domain.

## Deployment

Deploys automatically to GitHub Pages on push to `main`/`master` via `.github/workflows/deploy.yml`. Pages source must be set to "GitHub Actions" (repo Settings → Pages). Live at https://goncalojardim.github.io/.
