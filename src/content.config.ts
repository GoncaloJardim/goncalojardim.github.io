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
