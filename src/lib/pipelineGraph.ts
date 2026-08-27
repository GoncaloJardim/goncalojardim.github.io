import { spine, activation, performance, measurement, type PipelineStage } from '../data/pipeline';

export type PFVariant = 'spine' | 'branch' | 'hub';

export interface PFNode {
  id: string;
  type: 'pf';
  position: { x: number; y: number };
  data: { title: string; teaser?: string; items: PipelineStage['items']; icon: string; variant: PFVariant };
}
export interface PFEdge { id: string; source: string; target: string }

const ROW = 150;
const COL = 200;

/** Spread k nodes symmetrically around x = 0. */
function spread(i: number, k: number): number {
  return (i - (k - 1) / 2) * COL;
}

/**
 * Builds the vertical pipeline graph:
 *   spine (4, stacked) → fan-out to Activation (4) → converge to
 *   Performance Measuring → fan-out to measurement (4).
 */
export function buildPipelineGraph(): { nodes: PFNode[]; edges: PFEdge[] } {
  const nodes: PFNode[] = [];
  const edges: PFEdge[] = [];

  // Spine: single column, stacked top to bottom.
  spine.forEach((s, i) => {
    nodes.push({
      id: s.id, type: 'pf', position: { x: 0, y: i * ROW },
      data: { title: s.title, teaser: s.teaser, items: s.items, icon: s.id, variant: 'spine' },
    });
    if (i > 0) edges.push({ id: `${spine[i - 1].id}-${s.id}`, source: spine[i - 1].id, target: s.id });
  });
  const lastSpine = spine[spine.length - 1].id;

  // Activation fan-out.
  const actY = spine.length * ROW;
  activation.forEach((s, i) => {
    nodes.push({
      id: s.id, type: 'pf', position: { x: spread(i, activation.length), y: actY },
      data: { title: s.title, items: s.items, icon: s.id, variant: 'branch' },
    });
    edges.push({ id: `${lastSpine}-${s.id}`, source: lastSpine, target: s.id });
  });

  // Converge → Performance Measuring.
  const perfY = actY + ROW;
  nodes.push({
    id: performance.id, type: 'pf', position: { x: 0, y: perfY },
    data: { title: performance.title, teaser: performance.teaser, items: [], icon: 'performance', variant: 'hub' },
  });
  activation.forEach((s) => edges.push({ id: `${s.id}-${performance.id}`, source: s.id, target: performance.id }));

  // Measurement fan-out.
  const measY = perfY + ROW;
  measurement.forEach((s, i) => {
    nodes.push({
      id: s.id, type: 'pf', position: { x: spread(i, measurement.length), y: measY },
      data: { title: s.title, items: s.items, icon: s.id, variant: 'branch' },
    });
    edges.push({ id: `${performance.id}-${s.id}`, source: performance.id, target: s.id });
  });

  return { nodes, edges };
}
