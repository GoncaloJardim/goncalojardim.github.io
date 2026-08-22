# GTM Engineering Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, file-driven portfolio site that showcases four genericized GTM engineering case studies with animated + interactive architecture diagrams, funnelling every path to a "book a call" CTA.

**Architecture:** Astro renders every page to static HTML. Each project is one Markdown file whose YAML frontmatter drives both its impact tiles and its architecture diagram. Diagrams are React Flow islands, hydrated only when scrolled into view. Deployed to GitHub Pages via GitHub Actions.

**Tech Stack:** Astro 5, `@astrojs/react`, React 18, `@xyflow/react` (React Flow 12), TypeScript, Vitest (unit tests for pure logic), plain CSS with design tokens.

**Spec:** `docs/superpowers/specs/2026-08-22-gtm-portfolio-design.md`

## Global Constraints

- **Node** >= 20.3 (Astro 5 requirement). Package manager: **npm**.
- **Confidentiality:** All project copy is genericized. Never write the employer name ("Snowplow") or any real customer/person name anywhere in `src/`. Only the Outbound Campaigns project may name/link its public repo (`https://github.com/snowplow-devops/snowplow-gtm-outbound-campaigns`). Metrics stay relative/approximate (e.g. "~10x", "~97%").
- **Source of project content:** `.context/project-briefs.md` (genericized briefs for all four projects). Copy from there.
- **Accent color token:** `--accent: #3b5bfd` (indigo). Single source in `src/styles/global.css`.
- **Identity:** Name "Gonçalo Jardim"; tagline "GTM Data Scientist / Engineer"; Calendly `https://calendly.com/goncalojardim/30min`; email `goncalodajardim@gmail.com`; GitHub `https://github.com/GoncaloJardim`; LinkedIn `https://www.linkedin.com/in/goncalo-jardim/`. All referenced from one config module (`src/config.ts`), never hardcoded in pages.
- **GitHub Pages base path:** Plan defaults to a **project site** at repo `portfolio` → `base: '/portfolio'`, `site: 'https://goncalojardim.github.io'`. Task 11 documents the exact one-line change for a user site (`GoncaloJardim.github.io` repo → `base: '/'`) or a custom domain. Confirm with owner before first deploy.
- **All internal links must be base-aware:** build hrefs with the `withBase()` helper from `src/config.ts` (defined in Task 2), never raw `/projects/...`, so links survive the `/portfolio` base path.
- **Every task ends green:** `npm run build` must succeed. Logic tasks also run `npx vitest run`.

---

## File structure

```
astro.config.mjs                      # Astro config: react integration, site, base
package.json                          # deps + scripts
tsconfig.json
vitest.config.ts                      # vitest for src/lib
src/
  config.ts                           # identity/links + withBase() helper (Task 2)
  content.config.ts                   # projects collection schema (Task 3)
  content/projects/
    account-fit-score.md              # (Task 7)
    account-engagement-score.md       # (Task 7)
    gtm-enrichment-engine.md          # (Task 7)
    outbound-campaign-democratization.md  # (Task 7)
  lib/
    diagram.ts                        # buildDiagram(spec) → RF nodes/edges (Task 4)
    diagram.test.ts                   # (Task 4)
    metrics.ts                        # aggregateHeadlineMetrics(projects) (Task 5)
    metrics.test.ts                   # (Task 5)
  components/
    Diagram.tsx                       # React Flow island (Task 6)
    GtmNode.tsx                       # custom node (Task 6)
    Hero.astro                        # (Task 8)
    ImpactBand.astro                  # (Task 8)
    EngineStrip.astro                 # (Task 8)
    ProjectCard.astro                 # (Task 8)
    Nav.astro                         # (Task 10)
    Footer.astro                      # (Task 10)
  layouts/
    Base.astro                        # html shell, global css, meta (Task 1, extended Task 10/12)
  pages/
    index.astro                       # home (Task 8)
    projects/[id].astro               # project page (Task 9)
  styles/
    global.css                        # design tokens + shared classes (Task 1)
.github/workflows/deploy.yml          # GH Pages deploy (Task 11)
```

---

## Task 1: Scaffold Astro project with React, tooling, and design tokens

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`
- Create: `src/layouts/Base.astro`, `src/styles/global.css`, `src/pages/index.astro`

**Interfaces:**
- Produces: `Base.astro` — an Astro layout accepting props `{ title: string; description?: string }` and a default `<slot />`; wraps content in the html shell and imports `global.css`.

- [ ] **Step 1: Initialize project and install dependencies**

Run from the workspace root (`/Users/goncalojardim/conductor/workspaces/portfolio/dalat`). The directory already contains `.git`, `.gitignore`, `.context/`, `docs/` — do NOT run a scaffolder that wipes the dir. Install directly:

```bash
npm init -y
npm install astro@^5 @astrojs/react@^4 react@^18 react-dom@^18 @xyflow/react@^12
npm install -D typescript @types/react @types/react-dom vitest
```

- [ ] **Step 2: Write `package.json` scripts**

Replace the `"scripts"` block in `package.json` with:

```json
{
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "test": "vitest run"
  }
}
```

Keep the `name`, `version`, and `dependencies`/`devDependencies` blocks npm generated.

- [ ] **Step 3: Write `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// See plan Global Constraints for user-site vs project-site vs custom-domain.
export default defineConfig({
  site: 'https://goncalojardim.github.io',
  base: '/portfolio',
  integrations: [react()],
});
```

- [ ] **Step 4: Write `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 5: Write `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
});
```

- [ ] **Step 6: Write `src/styles/global.css` (design tokens + shared classes)**

```css
:root{
  --bg:#ffffff; --ink:#0b1020; --muted:#5b647a; --line:#e7eaf0;
  --soft:#f6f8fb; --accent:#3b5bfd; --accent-soft:#eaefff; --ok:#0ea472;
  --radius:14px; --maxw:1120px;
}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);
  font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
  line-height:1.5;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.wrap{max-width:var(--maxw);margin:0 auto;padding:0 28px}
.btn{display:inline-block;background:var(--accent);color:#fff;padding:9px 16px;border-radius:10px;
  font-size:14px;font-weight:600;border:none;cursor:pointer;
  box-shadow:0 1px 2px rgba(11,16,32,.08),0 6px 18px rgba(59,91,253,.18)}
.btn.ghost{background:var(--soft);color:var(--ink);box-shadow:none;border:1px solid var(--line)}
.eyebrow{display:inline-block;font-size:12.5px;font-weight:600;color:var(--accent);
  background:var(--accent-soft);padding:6px 12px;border-radius:999px;letter-spacing:.02em}
.label{font-size:12px;font-weight:650;letter-spacing:.08em;text-transform:uppercase;color:var(--accent)}
h1{font-size:56px;line-height:1.05;letter-spacing:-.03em;margin:20px 0 14px;font-weight:720}
h2{font-size:30px;letter-spacing:-.02em;margin:10px 0 6px;font-weight:700}
.section{padding:60px 0}
.chip{font-size:11px;color:var(--muted);background:var(--soft);border:1px solid var(--line);
  padding:3px 8px;border-radius:999px;display:inline-block}
@media (max-width:760px){ h1{font-size:38px} h2{font-size:24px} .section{padding:40px 0} }
```

- [ ] **Step 7: Write `src/layouts/Base.astro`**

```astro
---
import '../styles/global.css';
interface Props { title: string; description?: string }
const { title, description = 'GTM engineering: predictive scoring, enrichment, and outbound systems.' } = Astro.props;
---
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 8: Write a placeholder `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
---
<Base title="Gonçalo Jardim — GTM Data Scientist / Engineer">
  <main class="wrap section"><h1>Portfolio</h1></main>
</Base>
```

- [ ] **Step 9: Build to verify scaffold**

Run: `npm run build`
Expected: build completes with no errors; `dist/` is produced.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro + React + Vitest with design tokens"
```

---

## Task 2: Site config module

**Files:**
- Create: `src/config.ts`

**Interfaces:**
- Produces:
  - `export const site` — object: `{ name: string; tagline: string; valueProp: string; email: string; calendly: string; github: string; linkedin: string }`.
  - `export function withBase(path: string): string` — prefixes an internal path with `import.meta.env.BASE_URL`, collapsing duplicate slashes. Used for every internal link.

- [ ] **Step 1: Write `src/config.ts`**

```ts
export const site = {
  name: 'Gonçalo Jardim',
  tagline: 'GTM Data Scientist / Engineer',
  valueProp:
    'I build the systems that find and win your next customers — predictive scoring, automated enrichment, and outbound infrastructure, engineered end to end.',
  email: 'goncalodajardim@gmail.com',
  calendly: 'https://calendly.com/goncalojardim/30min',
  github: 'https://github.com/GoncaloJardim',
  linkedin: 'https://www.linkedin.com/in/goncalo-jardim/',
} as const;

/** Prefix an internal path with the configured base path (e.g. "/portfolio"). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL; // e.g. "/portfolio/" or "/"
  return `${base}/${path}`.replace(/\/{2,}/g, '/');
}
```

- [ ] **Step 2: Build to verify it compiles**

Run: `npm run build`
Expected: PASS (no type errors).

- [ ] **Step 3: Commit**

```bash
git add src/config.ts
git commit -m "feat: add site config and withBase helper"
```

---

## Task 3: Projects content collection schema + one sample entry

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/projects/account-fit-score.md` (minimal, expanded in Task 7)

**Interfaces:**
- Produces: a `projects` collection. Each entry `.data` has this shape (import via `import type { CollectionEntry } from 'astro:content'` → `CollectionEntry<'projects'>`):
  - `title: string`, `pitch: string`, `order: number`, `featured: boolean`, `tech: string[]`, `repo: string | null`
  - `metrics: { value: string; label: string }[]`
  - `diagram: { nodes: DiagramNodeSpec[]; edges: DiagramEdgeSpec[] }` where the node/edge shapes match the types defined in Task 4 (`id, label, tech?, group?('source'|'sink'), type?('fanout'|'branch'), detail` and `{ from, to }`). Entry `id` is the filename slug (e.g. `account-fit-score`).

- [ ] **Step 1: Write `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const diagramNode = z.object({
  id: z.string(),
  label: z.string(),
  tech: z.string().optional(),
  group: z.enum(['source', 'sink']).optional(),
  type: z.enum(['fanout', 'branch']).optional(),
  detail: z.string(),
});

const diagramEdge = z.object({ from: z.string(), to: z.string() });

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    pitch: z.string(),
    order: z.number(),
    featured: z.boolean().default(false),
    tech: z.array(z.string()),
    repo: z.string().url().nullable().default(null),
    metrics: z.array(z.object({ value: z.string(), label: z.string() })),
    diagram: z.object({
      nodes: z.array(diagramNode),
      edges: z.array(diagramEdge),
    }),
  }),
});

export const collections = { projects };
```

- [ ] **Step 2: Write a minimal `src/content/projects/account-fit-score.md`**

```markdown
---
title: "Account Fit Score"
pitch: "An ML model that grades every company in the market on how likely it is to become a real opportunity."
order: 1
featured: true
tech: ["Python", "scikit-learn", "Snowflake", "dbt", "Superset"]
repo: null
metrics:
  - { value: "~10x", label: "top-decile opportunity rate vs legacy" }
diagram:
  nodes:
    - { id: "crm", label: "CRM source data", tech: "Salesforce", group: "source", detail: "Historical account, opportunity and SQL outcomes plus firmographic and technographic attributes." }
    - { id: "score", label: "Market-wide scoring", tech: "Python", group: "sink", detail: "Applies the model to every account to produce a 0-100% fit score and Very Low to Very High buckets." }
  edges:
    - { from: "crm", to: "score" }
---

Placeholder body — expanded in Task 7.
```

- [ ] **Step 3: Build to verify schema validates**

Run: `npm run build`
Expected: PASS. (If the frontmatter violates the schema, Astro fails the build with a zod error — that is the schema working.)

- [ ] **Step 4: Commit**

```bash
git add src/content.config.ts src/content/projects/account-fit-score.md
git commit -m "feat: add projects content collection schema"
```

---

## Task 4: Diagram layout transform (`buildDiagram`) — TDD

Pure function turning a project's `diagram` spec into positioned React Flow nodes and edges. This is the only real algorithm in the codebase, so it is unit-tested first.

**Layout algorithm (deterministic):**
1. Build a set of node ids. Compute each node's **column** = longest path length (in edges) from any root (a node with no incoming edge). Assumes a DAG.
2. Group nodes by column, preserving their order in `spec.nodes`.
3. Position: `x = column * 220`. For a column with `k` nodes, the node at index `i` gets `y = (i - (k - 1) / 2) * 120`.
4. `variant` = `group` if set, else `'hub'` if `type === 'fanout'`, else `'default'`.
5. Edges → `{ id: "from->to", source: from, target: to, animated: true }`.

**Files:**
- Create: `src/lib/diagram.ts`
- Test: `src/lib/diagram.test.ts`

**Interfaces:**
- Produces (exact signatures later tasks rely on):

```ts
export interface DiagramNodeSpec {
  id: string; label: string; tech?: string;
  group?: 'source' | 'sink'; type?: 'fanout' | 'branch'; detail: string;
}
export interface DiagramEdgeSpec { from: string; to: string; }
export interface DiagramSpec { nodes: DiagramNodeSpec[]; edges: DiagramEdgeSpec[]; }

export type NodeVariant = 'source' | 'sink' | 'hub' | 'default';
export interface RFNode {
  id: string;
  type: 'gtm';
  position: { x: number; y: number };
  data: { label: string; tech?: string; detail: string; variant: NodeVariant };
}
export interface RFEdge { id: string; source: string; target: string; animated: true; }

export function buildDiagram(spec: DiagramSpec): { nodes: RFNode[]; edges: RFEdge[] };
```

- [ ] **Step 1: Write the failing test**

`src/lib/diagram.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { buildDiagram, type DiagramSpec } from './diagram';

const linear: DiagramSpec = {
  nodes: [
    { id: 'a', label: 'A', group: 'source', detail: 'start' },
    { id: 'b', label: 'B', detail: 'mid' },
    { id: 'c', label: 'C', group: 'sink', detail: 'end' },
  ],
  edges: [ { from: 'a', to: 'b' }, { from: 'b', to: 'c' } ],
};

const fanout: DiagramSpec = {
  nodes: [
    { id: 'hub', label: 'Hub', type: 'fanout', detail: 'fans out' },
    { id: 'p1', label: 'P1', detail: 'provider 1' },
    { id: 'p2', label: 'P2', detail: 'provider 2' },
    { id: 'merge', label: 'Merge', detail: 'merges' },
  ],
  edges: [
    { from: 'hub', to: 'p1' }, { from: 'hub', to: 'p2' },
    { from: 'p1', to: 'merge' }, { from: 'p2', to: 'merge' },
  ],
};

describe('buildDiagram', () => {
  it('lays linear nodes out in ascending columns', () => {
    const { nodes } = buildDiagram(linear);
    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
    expect(byId.a.position.x).toBe(0);
    expect(byId.b.position.x).toBe(220);
    expect(byId.c.position.x).toBe(440);
  });

  it('assigns variants from group and fanout type', () => {
    const { nodes } = buildDiagram(linear);
    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
    expect(byId.a.data.variant).toBe('source');
    expect(byId.b.data.variant).toBe('default');
    expect(byId.c.data.variant).toBe('sink');
    const hub = buildDiagram(fanout).nodes.find((n) => n.id === 'hub')!;
    expect(hub.data.variant).toBe('hub');
  });

  it('places fan-out children in the same column, vertically spread and centered', () => {
    const { nodes } = buildDiagram(fanout);
    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
    expect(byId.hub.position.x).toBe(0);
    expect(byId.p1.position.x).toBe(220);
    expect(byId.p2.position.x).toBe(220);
    expect(byId.merge.position.x).toBe(440);
    // two nodes in column 1 → centered around 0: -60 and +60
    expect(byId.p1.position.y).toBe(-60);
    expect(byId.p2.position.y).toBe(60);
  });

  it('produces animated edges with from->to ids', () => {
    const { edges } = buildDiagram(linear);
    expect(edges).toContainEqual({ id: 'a->b', source: 'a', target: 'b', animated: true });
    expect(edges.every((e) => e.animated === true)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/diagram.test.ts`
Expected: FAIL ("Cannot find module './diagram'" or export missing).

- [ ] **Step 3: Write `src/lib/diagram.ts`**

```ts
export interface DiagramNodeSpec {
  id: string; label: string; tech?: string;
  group?: 'source' | 'sink'; type?: 'fanout' | 'branch'; detail: string;
}
export interface DiagramEdgeSpec { from: string; to: string; }
export interface DiagramSpec { nodes: DiagramNodeSpec[]; edges: DiagramEdgeSpec[]; }

export type NodeVariant = 'source' | 'sink' | 'hub' | 'default';
export interface RFNode {
  id: string;
  type: 'gtm';
  position: { x: number; y: number };
  data: { label: string; tech?: string; detail: string; variant: NodeVariant };
}
export interface RFEdge { id: string; source: string; target: string; animated: true; }

const COL_GAP = 220;
const ROW_GAP = 120;

function computeColumns(spec: DiagramSpec): Record<string, number> {
  const incoming: Record<string, string[]> = {};
  const outgoing: Record<string, string[]> = {};
  for (const n of spec.nodes) { incoming[n.id] = []; outgoing[n.id] = []; }
  for (const e of spec.edges) {
    outgoing[e.from]?.push(e.to);
    incoming[e.to]?.push(e.from);
  }
  const col: Record<string, number> = {};
  // longest path from any root via memoized DFS
  const visiting = new Set<string>();
  function depth(id: string): number {
    if (col[id] !== undefined) return col[id];
    if (incoming[id].length === 0) { col[id] = 0; return 0; }
    if (visiting.has(id)) return 0; // cycle guard (spec assumes DAG)
    visiting.add(id);
    const d = Math.max(...incoming[id].map((p) => depth(p) + 1));
    visiting.delete(id);
    col[id] = d;
    return d;
  }
  for (const n of spec.nodes) depth(n.id);
  return col;
}

function variantOf(n: DiagramNodeSpec): NodeVariant {
  if (n.group) return n.group;
  if (n.type === 'fanout') return 'hub';
  return 'default';
}

export function buildDiagram(spec: DiagramSpec): { nodes: RFNode[]; edges: RFEdge[] } {
  const col = computeColumns(spec);
  const byCol: Record<number, DiagramNodeSpec[]> = {};
  for (const n of spec.nodes) {
    const c = col[n.id] ?? 0;
    (byCol[c] ??= []).push(n);
  }
  const nodes: RFNode[] = [];
  for (const [cStr, group] of Object.entries(byCol)) {
    const c = Number(cStr);
    const k = group.length;
    group.forEach((n, i) => {
      nodes.push({
        id: n.id,
        type: 'gtm',
        position: { x: c * COL_GAP, y: (i - (k - 1) / 2) * ROW_GAP },
        data: { label: n.label, tech: n.tech, detail: n.detail, variant: variantOf(n) },
      });
    });
  }
  const edges: RFEdge[] = spec.edges.map((e) => ({
    id: `${e.from}->${e.to}`, source: e.from, target: e.to, animated: true,
  }));
  return { nodes, edges };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/diagram.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/diagram.ts src/lib/diagram.test.ts
git commit -m "feat: add buildDiagram layout transform with tests"
```

---

## Task 5: Headline metric aggregation — TDD

Home impact band shows one headline metric per project, ordered by `order`.

**Files:**
- Create: `src/lib/metrics.ts`
- Test: `src/lib/metrics.test.ts`

**Interfaces:**
- Consumes: project entries with `.data.order` (number) and `.data.metrics` (`{value,label}[]`).
- Produces:

```ts
export interface Metric { value: string; label: string; }
export interface HasMetrics { data: { order: number; metrics: Metric[] } }
// Returns the FIRST metric of each project, sorted by data.order ascending.
export function aggregateHeadlineMetrics<T extends HasMetrics>(projects: T[]): Metric[];
```

- [ ] **Step 1: Write the failing test**

`src/lib/metrics.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { aggregateHeadlineMetrics } from './metrics';

const projects = [
  { data: { order: 2, metrics: [{ value: '~190x', label: 'lift' }, { value: 'x', label: 'y' }] } },
  { data: { order: 1, metrics: [{ value: '~10x', label: 'opp rate' }] } },
  { data: { order: 3, metrics: [] } },
];

describe('aggregateHeadlineMetrics', () => {
  it('returns the first metric of each project sorted by order, skipping empty', () => {
    expect(aggregateHeadlineMetrics(projects)).toEqual([
      { value: '~10x', label: 'opp rate' },
      { value: '~190x', label: 'lift' },
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/metrics.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Write `src/lib/metrics.ts`**

```ts
export interface Metric { value: string; label: string; }
export interface HasMetrics { data: { order: number; metrics: Metric[] } }

export function aggregateHeadlineMetrics<T extends HasMetrics>(projects: T[]): Metric[] {
  return [...projects]
    .sort((a, b) => a.data.order - b.data.order)
    .map((p) => p.data.metrics[0])
    .filter((m): m is Metric => Boolean(m));
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/metrics.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/metrics.ts src/lib/metrics.test.ts
git commit -m "feat: add headline metric aggregation with tests"
```

---

## Task 6: Diagram React Flow island

The interactive/animated diagram. Renders positioned nodes from `buildDiagram`, animates edges, shows a detail panel on node click, respects reduced-motion, and provides a text fallback list for a11y/no-JS.

**Files:**
- Create: `src/components/GtmNode.tsx`
- Create: `src/components/Diagram.tsx`

**Interfaces:**
- Consumes: `buildDiagram` and `DiagramSpec` from `src/lib/diagram.ts`.
- Produces: `Diagram` — default React component with props `{ spec: DiagramSpec; height?: number }`. Used from `.astro` files as an island with `client:visible`.

- [ ] **Step 1: Write `src/components/GtmNode.tsx`**

```tsx
import { Handle, Position, type NodeProps } from '@xyflow/react';

export default function GtmNode({ data }: NodeProps) {
  const d = data as { label: string; tech?: string; variant: string };
  return (
    <div className={`gtm-node gtm-${d.variant}`}>
      <Handle type="target" position={Position.Left} />
      <div className="gtm-node-label">{d.label}</div>
      {d.tech && <div className="gtm-node-tech">{d.tech}</div>}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
```

- [ ] **Step 2: Write `src/components/Diagram.tsx`**

```tsx
import { useMemo, useState } from 'react';
import { ReactFlow, Background, type Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { buildDiagram, type DiagramSpec } from '../lib/diagram';
import GtmNode from './GtmNode';

const nodeTypes = { gtm: GtmNode };

export default function Diagram({ spec, height = 460 }: { spec: DiagramSpec; height?: number }) {
  const { nodes, edges } = useMemo(() => buildDiagram(spec), [spec]);
  const [selected, setSelected] = useState<{ label: string; detail: string } | null>(null);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const edgesToRender = prefersReduced ? edges.map((e) => ({ ...e, animated: false })) : edges;

  return (
    <div>
      <div style={{ height, width: '100%' }} className="gtm-diagram">
        <ReactFlow
          nodes={nodes}
          edges={edgesToRender}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
          zoomOnScroll={false}
          panOnDrag={false}
          onNodeClick={(_, node: Node) => {
            const nd = node.data as { label: string; detail: string };
            setSelected({ label: nd.label, detail: nd.detail });
          }}
        >
          <Background gap={22} color="#eef1f7" />
        </ReactFlow>
      </div>
      <div className="gtm-detail">
        {selected ? (
          <p><strong>{selected.label}</strong> — {selected.detail}</p>
        ) : (
          <p className="muted">Click any node to see what happens at that stage.</p>
        )}
      </div>
      {/* Text fallback for screen readers / no-JS */}
      <ul className="gtm-fallback">
        {spec.nodes.map((n) => (
          <li key={n.id}><strong>{n.label}</strong>{n.tech ? ` (${n.tech})` : ''}: {n.detail}</li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 3: Add diagram styles to `src/styles/global.css`**

Append:

```css
.gtm-diagram{border:1px solid var(--line);border-radius:16px;background:linear-gradient(180deg,#fbfcfe,#fff)}
.gtm-node{width:150px;background:#fff;border:1px solid var(--line);border-radius:11px;
  padding:9px 12px;box-shadow:0 1px 2px rgba(11,16,32,.05);font-size:13px}
.gtm-node .gtm-node-label{font-weight:620;letter-spacing:-.01em}
.gtm-node .gtm-node-tech{font-size:11px;color:var(--muted);margin-top:3px}
.gtm-node.gtm-hub{background:var(--accent);border-color:var(--accent);color:#fff}
.gtm-node.gtm-hub .gtm-node-tech{color:#d9e1ff}
.gtm-node.gtm-source{border-left:3px solid var(--ok)}
.gtm-node.gtm-sink{border-left:3px solid var(--accent)}
.react-flow__node.selected .gtm-node{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-soft)}
.gtm-detail{padding:14px 4px;font-size:13.5px;min-height:24px}
.gtm-detail .muted{color:var(--muted)}
.gtm-fallback{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@media (prefers-reduced-motion: reduce){ html{scroll-behavior:auto} }
```

- [ ] **Step 4: Temporarily mount the island on the home page to verify it renders**

Replace `src/pages/index.astro` body with a temporary test mount:

```astro
---
import Base from '../layouts/Base.astro';
import Diagram from '../components/Diagram.tsx';
import { getEntry } from 'astro:content';
const entry = await getEntry('projects', 'account-fit-score');
---
<Base title="Diagram test">
  <main class="wrap section">
    <Diagram spec={entry!.data.diagram} client:visible />
  </main>
</Base>
```

- [ ] **Step 5: Build and eyeball the diagram**

Run: `npm run build`
Expected: PASS (no type errors; island compiles).

Then run `npm run dev`, open the printed localhost URL, and confirm: two nodes render left-to-right, the edge animates, clicking a node fills the detail line. Stop the dev server when done. (This temporary mount is replaced in Task 8.)

- [ ] **Step 6: Commit**

```bash
git add src/components/Diagram.tsx src/components/GtmNode.tsx src/styles/global.css src/pages/index.astro
git commit -m "feat: add interactive animated React Flow diagram island"
```

---

## Task 7: Author the four project content files

Fill in all four projects from `.context/project-briefs.md`, genericized. Each file's `diagram` must have nodes/edges that form a DAG (see Task 4 algorithm). Read `.context/project-briefs.md` before writing each file and mine it for the architecture stages, metrics, and prose.

**Files:**
- Modify: `src/content/projects/account-fit-score.md` (expand)
- Create: `src/content/projects/account-engagement-score.md`
- Create: `src/content/projects/gtm-enrichment-engine.md`
- Create: `src/content/projects/outbound-campaign-democratization.md`

**Interfaces:**
- Consumes: the schema from Task 3. Every entry MUST satisfy it. `order` values: fit=1, engagement=2, enrichment=3, outbound=4. `featured: true` for all four. Only `outbound-campaign-democratization.md` has a non-null `repo`.

- [ ] **Step 1: Expand `account-fit-score.md`**

Frontmatter: keep `order: 1`, `featured: true`, `repo: null`. Set `metrics` to (from brief):
`{value:"~10x",label:"top-decile opportunity rate vs legacy"}`, `{value:"~45-50%",label:"SQL rate in top bucket"}`, `{value:"~0.03→strong",label:"correlation to real outcomes"}`.
Set `tech: ["Python","scikit-learn","pandas","Snowflake","dbt","Superset"]`.
Diagram nodes (linear, ids → labels/tech/detail from brief §Architecture 1–7): `crm`(source, "CRM source data","Salesforce"), `warehouse`("Warehouse feature assembly","Snowflake · SQL"), `features`("Feature engineering","Python · pandas"), `train`("Model training & tuning","scikit-learn"), `score`("Market-wide scoring","Python"), `writeback`("GTM write-back","CRM fields"), `bi`(sink,"BI dashboard","Superset"). Edges chain them in order crm→warehouse→features→train→score→writeback→bi. Each `detail` = the one-line description from the brief.
Body (Markdown, genericized) with sections: `## The problem`, `## What I built`, `## How it works`, `## Impact`. Pull prose from brief §Problem / §What I built / §Impact. Do not name the employer.

- [ ] **Step 2: Create `account-engagement-score.md`**

`order: 2`, `featured: true`, `repo: null`.
`metrics`: `{value:"~190x",label:"conversion lift, top band vs baseline"}`, `{value:"~0.95",label:"ROC-AUC in cross-validation"}`, `{value:"~2%",label:"of universe flagged as active"}`.
`tech: ["Python","scikit-learn","Snowflake","dbt","SQL"]`.
Diagram nodes (from brief §Architecture 1–6): `signals`(source,"Behavioural signals","events · CRM · marketing"), `model_layer`("Warehouse modelling","Snowflake · dbt"), `features`("Feature engineering","dbt · Python"), `train`("Model training","Lasso · scikit-learn"), `scoring`("Scoring & calibration","Python · SQL"), `activation`(sink,"Activation","CRM · BI"). Linear edges signals→model_layer→features→train→scoring→activation. Details from brief.
Body: same four sections, genericized.

- [ ] **Step 3: Create `gtm-enrichment-engine.md` (the fan-out showpiece)**

`order: 3`, `featured: true`, `repo: null`.
`metrics`: `{value:"~5x",label:"data warehouse expansion"}`, `{value:"~97%",label:"email accuracy"}`, `{value:"~40-50%",label:"sales research time reclaimed"}`.
`tech: ["n8n","Snowflake","dbt","Python","Apollo.io","ZoomInfo","LLM APIs"]`.
Diagram nodes: `prioritize`(source,"Account Prioritization","ML · Snowflake"), `prospect`("Look-alike Prospecting","LLM APIs · ocean.io"), `waterfall`(type:"fanout","Enrichment Waterfall","fan-out"), `apollo`("Apollo.io","mass scale"), `zoominfo`("ZoomInfo","mass scale"), `fullenrich`("FullEnrich","phone · quality"), `reversecontact`("ReverseContact","reverse lookup"), `validate`(type:"branch","Email Validation","NeverBounce"), `warehouse`("Warehouse of Truth","Snowflake · dbt"), `activate`(sink,"Activation","CRM · outbound").
Edges: `prioritize→prospect`, `prospect→waterfall`, then `waterfall→apollo`, `waterfall→zoominfo`, `waterfall→fullenrich`, `waterfall→reversecontact`, then each of `apollo/zoominfo/fullenrich/reversecontact → validate`, then `validate→warehouse`, `warehouse→activate`. (This yields columns: prioritize=0, prospect=1, waterfall=2, providers=3, validate=4, warehouse=5, activate=6.)
Body: four sections, genericized, emphasise the multi-provider waterfall and validation routing.

- [ ] **Step 4: Create `outbound-campaign-democratization.md`**

`order: 4`, `featured: true`, `repo: "https://github.com/snowplow-devops/snowplow-gtm-outbound-campaigns"` (public — allowed).
`metrics`: `{value:"minutes",label:"to a review-ready campaign"}`, `{value:"any rep",label:"can self-serve (was a few operators)"}`, `{value:"0",label:"emails sent without human review"}`.
`tech: ["Python","YAML","JSON Schema","GitHub Actions","pytest"]`.
Diagram nodes (from brief §Architecture 1–8): `authoring`(source,"Authoring conversation","Claude skill"), `audience`("Audience resolution","MCP · Snowflake"), `copy`("Copy generation","copy rules"), `contract`("Campaign contract","YAML · CSV · PR"), `ci`("CI validation","GitHub Actions"), `review`(type:"branch","Human review gate","CODEOWNERS"), `push`("Push on merge","sender APIs"), `activate`(sink,"Manual activation","Apollo · Lemlist · Smartlead"). Linear edges through them in order.
Body: four sections. This one may reference GitHub/CI concretely. Note the safety invariant (paused-by-default, two-human gate).

- [ ] **Step 5: Build to verify all four validate and the diagrams are DAGs**

Run: `npm run build`
Expected: PASS. If any diagram has a broken edge (references a missing node id) or non-number `order`, the build fails — fix and rebuild.

- [ ] **Step 6: Commit**

```bash
git add src/content/projects
git commit -m "content: author four genericized GTM case studies"
```

---

## Task 8: Home page

Assemble the home page from components: Hero + CTA, Impact band, Engine strip, Project cards, short About + closing CTA.

**Files:**
- Create: `src/components/Hero.astro`, `src/components/ImpactBand.astro`, `src/components/EngineStrip.astro`, `src/components/ProjectCard.astro`
- Modify: `src/pages/index.astro` (replace the Task 6 temporary mount)

**Interfaces:**
- `Hero.astro` — no props; reads `site` from config; renders name, tagline, valueProp, primary Calendly button, secondary links.
- `ImpactBand.astro` — props `{ metrics: {value:string;label:string}[] }`.
- `EngineStrip.astro` — no props; static 4-step score→engage→enrich→activate strip.
- `ProjectCard.astro` — props `{ id: string; title: string; pitch: string; metric: {value:string;label:string}; tech: string[] }`; links to `withBase(\`projects/\${id}\`)`.

- [ ] **Step 1: Write `src/components/Hero.astro`**

```astro
---
import { site } from '../config';
---
<header class="hero wrap">
  <span class="eyebrow">{site.tagline}</span>
  <h1>I build the systems that<br/>find & win your next customers.</h1>
  <p class="lead">{site.valueProp}</p>
  <div class="hero-cta">
    <a class="btn" href={site.calendly} target="_blank" rel="noopener">Book a 30-min call →</a>
    <a class="btn ghost" href="#work">See the work</a>
  </div>
  <div class="hero-sub">
    <a href={site.github} target="_blank" rel="noopener">GitHub</a>
    <a href={site.linkedin} target="_blank" rel="noopener">LinkedIn</a>
    <a href={`mailto:${site.email}`}>{site.email}</a>
  </div>
</header>
<style>
  .hero{padding:84px 0 10px;text-align:center}
  .hero .lead{font-size:19px;color:var(--muted);max-width:640px;margin:0 auto 26px}
  .hero-cta{display:flex;gap:12px;justify-content:center;align-items:center;flex-wrap:wrap}
  .hero-sub{margin-top:16px;font-size:13.5px;color:var(--muted);display:flex;gap:18px;justify-content:center;flex-wrap:wrap}
</style>
```

- [ ] **Step 2: Write `src/components/ImpactBand.astro`**

```astro
---
interface Props { metrics: { value: string; label: string }[] }
const { metrics } = Astro.props;
---
<section class="wrap impact">
  {metrics.map((m) => (
    <div class="tile"><div class="v">{m.value}</div><div class="l">{m.label}</div></div>
  ))}
</section>
<style>
  .impact{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin:36px auto}
  .tile{background:var(--soft);border:1px solid var(--line);border-radius:var(--radius);padding:20px}
  .tile .v{font-size:30px;font-weight:720;letter-spacing:-.02em;color:var(--accent)}
  .tile .l{font-size:13px;color:var(--muted);margin-top:4px}
  @media (max-width:760px){ .impact{grid-template-columns:1fr 1fr} }
</style>
```

- [ ] **Step 3: Write `src/components/EngineStrip.astro`**

```astro
---
const steps = [
  { n: '01 · SCORE', h: 'Account Fit', p: 'Who looks like a winner' },
  { n: '02 · ENGAGE', h: 'Engagement Score', p: "Who's hot right now" },
  { n: '03 · ENRICH', h: 'Enrichment Engine', p: 'Find & validate contacts' },
  { n: '04 · ACTIVATE', h: 'Outbound', p: 'Safely ship campaigns' },
];
---
<section class="wrap section">
  <div class="label">The GTM engine</div>
  <h2>Four systems, one pipeline.</h2>
  <p class="sub">Each project is a stage in the same machine — from knowing who to target to putting clean, ready-to-work leads in front of sales.</p>
  <div class="engine">
    {steps.map((s, i) => (
      <>
        <div class="step"><div class="n">{s.n}</div><h4>{s.h}</h4><p>{s.p}</p></div>
        {i < steps.length - 1 && <span class="arrow">→</span>}
      </>
    ))}
  </div>
</section>
<style>
  .sub{color:var(--muted);max-width:620px}
  .engine{display:flex;gap:10px;align-items:center;margin-top:26px;flex-wrap:wrap}
  .engine .step{flex:1;min-width:150px;background:#fff;border:1px solid var(--line);border-radius:12px;padding:14px 16px}
  .engine .step .n{font-size:12px;color:var(--accent);font-weight:650}
  .engine .step h4{margin:6px 0 2px;font-size:15px}
  .engine .step p{margin:0;font-size:12.5px;color:var(--muted)}
  .engine .arrow{color:#c2cad9;font-size:20px}
</style>
```

- [ ] **Step 4: Write `src/components/ProjectCard.astro`**

```astro
---
import { withBase } from '../config';
interface Props { id: string; title: string; pitch: string; metric: { value: string; label: string }; tech: string[] }
const { id, title, pitch, metric, tech } = Astro.props;
---
<a class="pcard" href={withBase(`projects/${id}`)}>
  <h3>{title}</h3>
  <p>{pitch}</p>
  <div class="foot">
    <span class="metric"><span class="u">{metric.value}</span> {metric.label}</span>
    <div class="chips">{tech.slice(0, 3).map((t) => <span class="chip">{t}</span>)}</div>
  </div>
</a>
<style>
  .pcard{display:block;border:1px solid var(--line);border-radius:16px;padding:20px;background:#fff;transition:.16s}
  .pcard:hover{border-color:var(--accent);box-shadow:0 8px 30px rgba(11,16,32,.07);transform:translateY(-2px)}
  .pcard h3{margin:0 0 4px;font-size:17px;letter-spacing:-.01em}
  .pcard p{margin:0 0 14px;font-size:13.5px;color:var(--muted)}
  .foot{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap}
  .metric{font-weight:700;font-size:13.5px}.metric .u{color:var(--accent)}
  .chips{display:flex;gap:6px;flex-wrap:wrap}
</style>
```

- [ ] **Step 5: Rewrite `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
import ImpactBand from '../components/ImpactBand.astro';
import EngineStrip from '../components/EngineStrip.astro';
import ProjectCard from '../components/ProjectCard.astro';
import { site } from '../config';
import { getCollection } from 'astro:content';
import { aggregateHeadlineMetrics } from '../lib/metrics';

const projects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
const headline = aggregateHeadlineMetrics(projects);
---
<Base title={`${site.name} — ${site.tagline}`}>
  <Hero />
  <ImpactBand metrics={headline} />
  <EngineStrip />
  <section id="work" class="wrap section">
    <div class="label">Selected work</div>
    <h2>Case studies.</h2>
    <div class="cards">
      {projects.map((p) => (
        <ProjectCard id={p.id} title={p.data.title} pitch={p.data.pitch}
          metric={p.data.metrics[0]} tech={p.data.tech} />
      ))}
    </div>
  </section>
  <section id="about" class="wrap section">
    <div class="label">About</div>
    <h2>How I work.</h2>
    <p class="sub" style="max-width:640px;color:var(--muted)">
      I design and ship GTM data systems end to end — from predictive models in Python and Snowflake to
      automation in n8n and version-controlled outbound infrastructure. If you want to see one of these
      running in your stack, let's talk.
    </p>
    <p style="margin-top:20px"><a class="btn" href={site.calendly} target="_blank" rel="noopener">Book a 30-min call →</a></p>
  </section>
</Base>
<style>
  .cards{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:26px}
  @media (max-width:760px){ .cards{grid-template-columns:1fr} }
</style>
```

- [ ] **Step 6: Build and eyeball**

Run: `npm run build` (Expected: PASS). Then `npm run dev` and confirm the home page shows hero, four impact tiles, engine strip, four project cards, about + CTA. Stop dev when done.

- [ ] **Step 7: Commit**

```bash
git add src/components src/pages/index.astro
git commit -m "feat: build home page (hero, impact band, engine strip, cards, about)"
```

---

## Task 9: Project page template

One dynamic route rendering each case study: title, pitch, the big interactive diagram, prose body, impact tiles, tech chips, repo link.

**Files:**
- Create: `src/pages/projects/[id].astro`

**Interfaces:**
- Consumes: `getCollection`/`render` from `astro:content`; `Diagram` island; `ImpactBand` component; `withBase`/`site` from config.

- [ ] **Step 1: Write `src/pages/projects/[id].astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import Diagram from '../../components/Diagram.tsx';
import ImpactBand from '../../components/ImpactBand.astro';
import { site, withBase } from '../../config';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map((p) => ({ params: { id: p.id }, props: { project: p } }));
}

const { project } = Astro.props;
const { Content } = await render(project);
const d = project.data;
---
<Base title={`${d.title} — ${site.name}`} description={d.pitch}>
  <main class="wrap section">
    <p><a href={withBase('')} class="back">← All work</a></p>
    <span class="eyebrow">{site.tagline}</span>
    <h1 style="font-size:40px">{d.title}</h1>
    <p class="lead">{d.pitch}</p>

    <div class="label" style="margin-top:26px">Interactive · animated</div>
    <h2>How it runs.</h2>
    <Diagram spec={d.diagram} client:visible />

    <ImpactBand metrics={d.metrics} />

    <article class="prose">
      <Content />
    </article>

    <div class="meta">
      <div class="chips">{d.tech.map((t) => <span class="chip">{t}</span>)}</div>
      {d.repo && <a class="btn ghost" href={d.repo} target="_blank" rel="noopener">View the code →</a>}
    </div>

    <p style="margin-top:32px"><a class="btn" href={site.calendly} target="_blank" rel="noopener">Book a 30-min call →</a></p>
  </main>
</Base>
<style>
  .lead{font-size:19px;color:var(--muted);max-width:680px}
  .back{color:var(--muted);font-size:14px}
  .prose{max-width:680px;margin-top:10px}
  .prose :global(h2){font-size:22px;margin-top:32px}
  .prose :global(p),.prose :global(li){color:#26304a}
  .meta{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin-top:28px}
  .chips{display:flex;gap:6px;flex-wrap:wrap}
</style>
```

- [ ] **Step 2: Build and eyeball each project page**

Run: `npm run build` (Expected: PASS; four `dist/projects/*/index.html` produced). Then `npm run dev` and visit `/portfolio/projects/gtm-enrichment-engine` — confirm the fan-out diagram renders and animates, impact tiles show, prose renders, tech chips + repo button appear (repo only on outbound). Stop dev when done.

- [ ] **Step 3: Commit**

```bash
git add src/pages/projects
git commit -m "feat: add project case-study page template"
```

---

## Task 10: Navigation, footer, and layout wiring

Add the sticky nav (with persistent Book-a-call button) and footer, wired into `Base.astro`.

**Files:**
- Create: `src/components/Nav.astro`, `src/components/Footer.astro`
- Modify: `src/layouts/Base.astro`

**Interfaces:**
- `Nav.astro`/`Footer.astro` — no props; read `site` + `withBase` from config. `Base.astro` renders `<Nav/>` before the slot and `<Footer/>` after.

- [ ] **Step 1: Write `src/components/Nav.astro`**

```astro
---
import { site, withBase } from '../config';
---
<nav>
  <div class="wrap nav-in">
    <a class="brand" href={withBase('')}>{site.name}</a>
    <div class="nav-links">
      <a href={withBase('#work')}>Work</a>
      <a href={withBase('#about')}>About</a>
      <a class="btn" href={site.calendly} target="_blank" rel="noopener">Book a call</a>
    </div>
  </div>
</nav>
<style>
  nav{position:sticky;top:0;z-index:20;background:rgba(255,255,255,.82);backdrop-filter:blur(10px);border-bottom:1px solid var(--line)}
  .nav-in{display:flex;align-items:center;justify-content:space-between;height:64px}
  .brand{font-weight:650;letter-spacing:-.01em}
  .nav-links{display:flex;gap:22px;align-items:center;color:var(--muted);font-size:14px}
</style>
```

- [ ] **Step 2: Write `src/components/Footer.astro`**

```astro
---
import { site } from '../config';
---
<footer>
  <div class="wrap">
    <a href={site.calendly} target="_blank" rel="noopener">Book a call</a> ·
    <a href={site.github} target="_blank" rel="noopener">GitHub</a> ·
    <a href={site.linkedin} target="_blank" rel="noopener">LinkedIn</a> ·
    <a href={`mailto:${site.email}`}>{site.email}</a>
  </div>
</footer>
<style>
  footer{border-top:1px solid var(--line);padding:40px 0;color:var(--muted);font-size:13px;text-align:center;margin-top:40px}
</style>
```

- [ ] **Step 3: Wire into `src/layouts/Base.astro`**

Add imports and render Nav/Footer around the slot:

```astro
---
import '../styles/global.css';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
interface Props { title: string; description?: string }
const { title, description = 'GTM engineering: predictive scoring, enrichment, and outbound systems.' } = Astro.props;
---
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <Nav />
    <slot />
    <Footer />
  </body>
</html>
```

- [ ] **Step 4: Build and eyeball**

Run: `npm run build` (Expected: PASS). Then `npm run dev` and confirm nav is sticky with a working Book-a-call button on every page, footer shows on home and a project page. Stop dev when done.

- [ ] **Step 5: Commit**

```bash
git add src/components/Nav.astro src/components/Footer.astro src/layouts/Base.astro
git commit -m "feat: add sticky nav and footer with persistent CTA"
```

---

## Task 11: GitHub Pages deployment

Add the deploy workflow and confirm base-path config. Produces a site that publishes on push to `main`.

**Files:**
- Create: `.github/workflows/deploy.yml`
- Create: `README.md`
- Verify: `astro.config.mjs` `site`/`base` (from Task 1)

**Interfaces:** none (CI/config only).

- [ ] **Step 1: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Write `README.md`**

Include: what the site is, `npm run dev` / `build` / `test`, how to add a project (create `src/content/projects/<slug>.md` following the schema in `src/content.config.ts`), and the GitHub Pages base-path note:

```markdown
## GitHub Pages base path

`astro.config.mjs` defaults to a **project site** (repo named `portfolio`):
`site: 'https://goncalojardim.github.io'`, `base: '/portfolio'`.

- **User site** (repo `GoncaloJardim.github.io`): set `base: '/'` and
  `site: 'https://goncalojardim.github.io'`.
- **Custom domain**: set `site: 'https://yourdomain.com'`, `base: '/'`, and add a
  `public/CNAME` file containing the domain.

After pushing to `main`, enable Pages in repo Settings → Pages → Source: "GitHub Actions".
```

- [ ] **Step 3: Verify build produces base-prefixed asset URLs**

Run: `npm run build`
Expected: PASS. Grep to confirm the base path is applied to internal links:

Run: `grep -r "/portfolio/" dist/index.html | head`
Expected: internal links/assets are prefixed with `/portfolio/`. (If you switched to a user site / custom domain in Step 1, this grep won't match — that's correct for `base: '/'`.)

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/deploy.yml README.md
git commit -m "ci: add GitHub Pages deploy workflow and README"
```

---

## Task 12: Polish — accessibility, responsiveness, meta/OG, favicon

Final pass. Verifies reduced-motion, mobile layout, social/meta tags, and a favicon.

**Files:**
- Modify: `src/layouts/Base.astro` (OG/meta + favicon link)
- Create: `public/favicon.svg`
- Modify: `src/styles/global.css` (mobile nav wrap if needed)

**Interfaces:** none new.

- [ ] **Step 1: Add a simple favicon `public/favicon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="7" fill="#3b5bfd"/><text x="16" y="22" font-family="Inter,Arial" font-size="17" font-weight="700" fill="#fff" text-anchor="middle">GJ</text></svg>
```

- [ ] **Step 2: Add meta/OG tags + favicon to `src/layouts/Base.astro` `<head>`**

Insert inside `<head>` (after the description meta):

```astro
    <link rel="icon" type="image/svg+xml" href={`${import.meta.env.BASE_URL}/favicon.svg`.replace(/\/{2,}/g,'/')} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta name="twitter:card" content="summary" />
```

- [ ] **Step 3: Verify reduced-motion and mobile**

Run: `npm run dev`. In the browser devtools:
- Emulate `prefers-reduced-motion: reduce` → confirm diagram edges stop animating (no dash motion).
- Set a mobile viewport (~375px) → confirm impact tiles go to 2 columns, project cards stack to 1 column, nav links + hero CTAs wrap without overflow, and the diagram fits (fitView) without horizontal page scroll.
Stop dev when done.

- [ ] **Step 4: Verify screen-reader fallback exists**

Run: `npm run build` then `grep -r "gtm-fallback" dist/projects | head`
Expected: the visually-hidden fallback `<ul>` (with each node's label + detail) is present in the built project pages.

- [ ] **Step 5: Full green check**

Run: `npm run build && npm run test`
Expected: build PASS; all Vitest tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/Base.astro public/favicon.svg src/styles/global.css
git commit -m "polish: a11y, responsive, meta/OG tags, favicon"
```

---

## Self-review notes

- **Spec coverage:** goal/CTA (Tasks 8–10), confidentiality (Global Constraints + Task 7), file-driven content model (Tasks 3, 7), animated+interactive diagram (Tasks 4, 6), site structure home+project pages (Tasks 8, 9), stack (Task 1), design tokens (Task 1), identity config single-source (Task 2), GitHub Pages deploy (Task 11), a11y/reduced-motion/responsive/text-fallback (Tasks 6, 12). All spec §4–§9 requirements map to tasks.
- **Type consistency:** `DiagramSpec`/`DiagramNodeSpec`/`DiagramEdgeSpec` defined in Task 4 and referenced by Tasks 3 (schema mirrors them), 6, 9. `Metric` shape consistent across Tasks 3, 5, 8, 9. `withBase`/`site` defined Task 2, used Tasks 8–12. Content entry `id` used consistently (Tasks 6, 8, 9).
- **Open items** (spec §11) surfaced to the owner at Task 11: user-site vs project-site vs custom domain (documented one-line change); final hero copy and accent color are set to sensible defaults in config/tokens and trivially editable.
