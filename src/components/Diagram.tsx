import { useEffect, useMemo, useState } from 'react';
import { ReactFlow, Background, type Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { buildDiagram, type DiagramSpec } from '../lib/diagram';
import GtmNode from './GtmNode';

const nodeTypes = { gtm: GtmNode };

export default function Diagram({ spec, height = 460 }: { spec: DiagramSpec; height?: number }) {
  const { nodes, edges } = useMemo(() => buildDiagram(spec), [spec]);
  const [selected, setSelected] = useState<{ label: string; detail: string } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const edgesToRender = prefersReduced ? edges.map((e) => ({ ...e, animated: false })) : edges;

  return (
    <div>
      <div style={{ height, width: '100%' }} className="gtm-diagram">
        {mounted && (
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
        )}
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
