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
