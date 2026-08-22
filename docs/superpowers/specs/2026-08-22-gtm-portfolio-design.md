# GTM Engineering Portfolio — Design Spec

**Date:** 2026-08-22
**Owner:** Gonçalo Jardim
**Status:** Approved design → ready for implementation plan

## 1. Goal

A public portfolio website that showcases Gonçalo's GTM Engineering work to win
freelance clients. It must:

- Communicate the **complexity** of what he has built (real architectures).
- Show **impact** with data (relative/approximate metrics).
- Present workflows/architecture in a **visually dynamic** way — animated *and*
  interactive flow diagrams (data "flows" along edges; nodes are clickable).
- Funnel every path toward a single primary CTA: **book a call**.

Success = a prospective client lands, understands within ~30 seconds that Gonçalo
builds serious GTM systems that drive measurable impact, and books a call.

## 2. Constraints & decisions

- **Confidentiality:** Most work is employer (Snowplow) work. Case studies are
  **genericized** — no employer name, no real customer/person/proprietary data.
  Metrics are **relative/approximate** (e.g. "~10x", "~97%"). Exception: the
  Outbound Campaigns project is a **public repo** and may be named/linked.
- **Content authoring:** File-driven. Each project = one Markdown file with YAML
  frontmatter. Adding a project = adding a file. No CMS.
- **Aesthetic:** Clean & modern light (Stripe/Linear energy) — whitespace, crisp
  type, one bold accent (indigo/blue `#3b5bfd`, adjustable). Animated diagrams are
  the visual hero against the restraint.
- **Diagram behavior:** Animated edges (looping, not real data) + clickable nodes
  that expand a "what happens here" detail. Validated via mockup.
- **Hosting:** Free static hosting on **GitHub Pages**, auto-deployed on push.
- **No live backend / no real client data** — avoids maintenance & confidentiality risk.

## 3. Tech stack

- **Astro** — static site generator; content collections for type-safe,
  schema-validated project files; ships ~zero JS by default.
- **React + React Flow** — a lazy-loaded island per diagram (animated edges +
  interactivity out of the box). React is used *only* inside diagram islands.
- **Styling** — plain CSS (or CSS modules) with design tokens (CSS custom
  properties) for color/space/type. No heavy UI framework needed.
- **Deployment** — GitHub Actions → GitHub Pages on push to `main`.
- **Tooling** — TypeScript, Astro's content schema (zod) for frontmatter validation.

Rejected: Next.js (needs a server story we don't want for a static site);
hand-rolled SVG animation (loses free interactivity, more to maintain).

## 4. Site structure

### Pages
- **Home (`/`)** — single scroll:
  1. **Hero** — name, tagline ("GTM Data Scientist / Engineer"), one-line value
     prop, primary **Book a call** button (Calendly), secondary links
     (GitHub, LinkedIn, email).
  2. **Impact band** — 4 headline metric tiles aggregated across projects.
  3. **"The GTM engine" strip** — score → engage → enrich → activate narrative
     framing the four projects as one pipeline.
  4. **Project cards** — 4 cards (mini diagram preview, headline metric, tech
     chips) linking to project pages.
  5. **About (short)** + closing CTA.
- **Project pages (`/projects/<slug>`)** — one per case study, shared template:
  title, pitch, **large interactive animated diagram** (hero), problem → what I
  built → impact tiles → tech stack, repo link where public.
- **About** — kept as a home section (not a separate page) to preserve one-scroll
  focus. (Can be split later if desired.)

### Navigation
Minimal: brand/name, "Work", "About", persistent **Book a call** button.

## 5. Content / data model

Each project: `src/content/projects/<slug>.md`. Markdown body = prose case study;
YAML frontmatter = structured data driving both impact tiles and the diagram.
A single file is the source of truth so the story and diagram never drift.

Frontmatter schema (validated by Astro content collection / zod):

```yaml
title: string
slug: string
order: number            # display order
pitch: string            # one-line, for cards & hero of project page
featured: boolean
tech: string[]           # tech chips
repo: string | null      # GitHub URL where public, else null
metrics:                 # → impact tiles (site-wide aggregate + project page)
  - value: string        # e.g. "~10x", "~97%"
    label: string
diagram:
  nodes:
    - id: string
      label: string
      tech: string        # short tech caption
      group?: "source" | "sink"      # visual accent for start/end nodes
      type?: "fanout" | "branch"     # layout hint
      parent?: string     # for fan-out children (references a fanout node id)
      detail: string      # "what happens here" — shown on click
  edges:
    - from: string        # node id
      to: string          # node id
      # fan-out/merge expressed as multiple edges to/from the fanout node
```

Body (Markdown) sections (convention, not enforced): The problem · What I built ·
How it works · Impact.

The four launch projects are pre-filled from the genericized briefs stored at
`.context/project-briefs.md`:
1. Account Fit Score — linear ML pipeline; ~10x top-decile opportunity rate.
2. Account Engagement Score — Lasso propensity model; ~190x band conversion lift.
3. GTM Enrichment Engine — n8n fan-out enrichment waterfall; ~5x warehouse, ~97% email accuracy.
4. Outbound Campaign Democratization — campaign-as-YAML + CI; public repo linked.

## 6. Diagram component (React Flow island)

- One island component consumed by both the home featured diagram and each project
  page. Props = the project's `diagram` block.
- **Animation:** React Flow `animated` edges (looping pulse). No real data.
- **Interactivity:** clicking a node selects it and shows its `detail` text in a
  panel; hover highlights.
- **Layout:** left-to-right stages; `type: fanout` lays child nodes (by `parent`)
  in a vertical fan with edges from the hub and merge edges to the next stage;
  `type: branch` renders labelled branch outputs (e.g. valid / catch-all / invalid).
- **Performance:** island is lazy-loaded (`client:visible`) so it hydrates only
  when scrolled into view; the rest of the page is static HTML.
- **Accessibility:** respects `prefers-reduced-motion` (disable edge animation);
  provides a text/list fallback of the pipeline stages for screen readers and the
  no-JS case; keyboard-focusable nodes.
- **Responsive:** scales/stacks on narrow viewports.

## 7. Design tokens (initial)

- Accent `#3b5bfd` (indigo/blue) · ink `#0b1020` · muted `#5b647a` ·
  line `#e7eaf0` · soft surface `#f6f8fb` · success/source `#0ea472`.
- Font: Inter (system fallback). Mono for tech captions.
- Generous spacing; large radius (~14px) cards; subtle shadows on hover only.
- These are placeholders; refine during build.

## 8. Identity / config (single source)

Stored in one config file (`src/config.ts` or `src/data/site.ts`):
- Name: Gonçalo Jardim · Tagline: "GTM Data Scientist / Engineer" (refine copy).
- Calendly: https://calendly.com/goncalojardim/30min
- Email: goncalodajardim@gmail.com
- GitHub: https://github.com/GoncaloJardim
- LinkedIn: https://www.linkedin.com/in/goncalo-jardim/
- The Calendly link is referenced from config in one place, swappable.

## 9. Deployment

- GitHub Pages via GitHub Actions on push to `main`.
- `astro.config` `site`/`base` set for the Pages URL (user or project site — to be
  decided at build time based on repo name; default: project page under
  `GoncaloJardim.github.io/<repo>` unless a custom domain is added later).
- Optional custom domain can be added later (CNAME) without architectural change.

## 10. Out of scope (YAGNI)

- No live/real-time data or backend.
- No CMS/admin UI.
- No blog (can be added later as another content collection).
- No analytics/tracking initially (can add later).
- No i18n.

## 11. Open items to confirm during build

- Final tagline/hero copy wording.
- Accent color final choice (indigo default).
- User site vs project site on GitHub Pages (affects `base` path) — and whether a
  custom domain is wanted now.
