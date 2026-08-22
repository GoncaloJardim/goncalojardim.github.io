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
