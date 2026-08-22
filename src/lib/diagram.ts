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
