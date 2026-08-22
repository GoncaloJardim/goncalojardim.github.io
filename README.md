# Goncalo Jardim's Portfolio

A static portfolio site built with [Astro](https://astro.build), showcasing projects, technical expertise, and professional work.

## Getting Started

### Prerequisites
- Node.js >= 20.3
- npm

### Development

Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:3000/portfolio` (base path applied locally).

### Build

Build the site for production:
```bash
npm run build
```

Output is generated in the `dist/` directory.

### Preview

Preview the production build locally:
```bash
npm run preview
```

### Testing

Run tests:
```bash
npm run test
```

Type checking:
```bash
npm run check
```

## Adding a Project

Projects are stored as Markdown files in `src/content/projects/`.

Create a new file `src/content/projects/<slug>.md` with the following structure:

```markdown
---
title: "Project Name"
pitch: "Short description of the project"
order: 1
featured: true
tech: ["React", "TypeScript", "Astro"]
repo: "https://github.com/user/repo"
metrics:
  - value: "50M"
    label: "Events/day"
  - value: "12"
    label: "Team members"
diagram:
  nodes:
    - id: "source"
      label: "Data Source"
      tech: "API"
      group: "source"
      detail: "External data source"
    - id: "processor"
      label: "Processor"
      type: "fanout"
      detail: "Processes incoming data"
    - id: "sink"
      label: "Storage"
      group: "sink"
      detail: "Database or data warehouse"
  edges:
    - from: "source"
      to: "processor"
    - from: "processor"
      to: "sink"
---

Project description and details in Markdown format.
```

**Schema:**
- `title` (required): Project name
- `pitch` (required): Short pitch or description
- `order` (required): Display order (number)
- `featured` (optional): Boolean, defaults to false
- `tech` (required): Array of technologies used
- `repo` (optional): GitHub repo URL or null
- `metrics` (required): Array of metric objects with `value` and `label`
- `diagram` (required): Flow diagram with `nodes` and `edges`

## GitHub Pages base path

`astro.config.mjs` defaults to a **project site** (repo named `portfolio`):
`site: 'https://goncalojardim.github.io'`, `base: '/portfolio'`.

- **User site** (repo `GoncaloJardim.github.io`): set `base: '/'` and
  `site: 'https://goncalojardim.github.io'`.
- **Custom domain**: set `site: 'https://yourdomain.com'`, `base: '/'`, and add a
  `public/CNAME` file containing the domain.

After pushing to `main`, enable Pages in repo Settings → Pages → Source: "GitHub Actions".

## Deployment

This site deploys automatically to GitHub Pages on push to `main` via the GitHub Actions workflow in `.github/workflows/deploy.yml`.

To enable:
1. Push to `main` branch
2. Go to repo Settings → Pages
3. Select "GitHub Actions" as the source
4. The site will deploy at `https://goncalojardim.github.io/portfolio`

## License

ISC
