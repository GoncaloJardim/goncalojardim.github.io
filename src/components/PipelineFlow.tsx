import { useEffect, useMemo, useState } from 'react';
import { ReactFlow, Background, Handle, Position, type Node, type NodeProps } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { buildPipelineGraph, type PFVariant } from '../lib/pipelineGraph';
import PipelineIcon from './pipelineIcons';
import type { PipelineItem } from '../data/pipeline';

interface PFData {
  title: string;
  teaser?: string;
  items: PipelineItem[];
  icon: string;
  variant: PFVariant;
  [key: string]: unknown;
}

function PipelineNode({ data, selected }: NodeProps) {
  const d = data as PFData;
  return (
    <div className={`pf-node pf-${d.variant}${selected ? ' is-selected' : ''}`}>
      <Handle type="target" position={Position.Top} isConnectable={false} />
      <span className="pf-icon"><PipelineIcon name={d.icon} /></span>
      <span className="pf-title">{d.title}</span>
      <Handle type="source" position={Position.Bottom} isConnectable={false} />
    </div>
  );
}

const nodeTypes = { pf: PipelineNode };

export default function PipelineFlow({ height = 860 }: { height?: number }) {
  const { nodes, edges } = useMemo(() => buildPipelineGraph(), []);
  const [selectedId, setSelectedId] = useState<string>(nodes[0].id);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const selected = nodes.find((n) => n.id === selectedId)?.data as PFData | undefined;

  const rfNodes = nodes.map((n) => ({ ...n, selected: n.id === selectedId }));
  const rfEdges = edges.map((e) => ({
    ...e, type: 'default' as const,
    style: { stroke: 'var(--line-strong, #cfd6e4)', strokeWidth: 1.6 },
  }));

  return (
    <div className="pf-wrap">
      <div className="pf-canvas" style={{ height }}>
        {mounted && (
          <ReactFlow
            nodes={rfNodes}
            edges={rfEdges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.08 }}
            proOptions={{ hideAttribution: true }}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable
            zoomOnScroll={false}
            zoomOnPinch={false}
            zoomOnDoubleClick={false}
            panOnScroll={false}
            panOnDrag={false}
            preventScrolling={false}
            minZoom={0.4}
            maxZoom={1.2}
            onNodeClick={(_, node: Node) => setSelectedId(node.id)}
          >
            <Background gap={20} color="#eef1f7" />
          </ReactFlow>
        )}
      </div>

      <aside className="pf-detail" aria-live="polite">
        {selected && (
          <>
            <div className="pf-detail-eyebrow">What happens here</div>
            <h3>{selected.title}</h3>
            {selected.teaser && <p className="pf-detail-teaser">{selected.teaser}</p>}
            {selected.items.length > 0 && (
              <ul>
                {selected.items.map((it) => (
                  <li key={it.label}><strong>{it.label}</strong><span>{it.detail}</span></li>
                ))}
              </ul>
            )}
          </>
        )}
      </aside>
    </div>
  );
}
