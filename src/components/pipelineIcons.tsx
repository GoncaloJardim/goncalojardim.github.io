import type { ReactNode } from 'react';

// Minimal 24x24 stroke icons (currentColor), one per pipeline node id.
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

const ICONS: Record<string, ReactNode> = {
  // Spine
  prospection: (<><circle cx="11" cy="11" r="6" {...P} /><line x1="20" y1="20" x2="15.5" y2="15.5" {...P} /><circle cx="11" cy="11" r="2" {...P} /></>),
  enrichment: (<><ellipse cx="12" cy="6" rx="7" ry="3" {...P} /><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" {...P} /><path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" {...P} /></>),
  scoring: (<><line x1="5" y1="21" x2="5" y2="12" {...P} /><line x1="12" y1="21" x2="12" y2="7" {...P} /><line x1="19" y1="21" x2="19" y2="14" {...P} /></>),
  signals: (<><path d="M5 12a7 7 0 0 1 7-7" {...P} /><path d="M8 12a4 4 0 0 1 4-4" {...P} /><circle cx="12" cy="12" r="1.6" {...P} /><path d="M12 5a7 7 0 0 1 7 7" {...P} /></>),
  // Activation
  outbound: (<><path d="M3 12l17-7-6 17-3.5-6.5L3 12z" {...P} /></>),
  partnerships: (<><path d="M9 11l3 3 6-6" {...P} /><path d="M14 6l4 4M6 14l-2 2a2.8 2.8 0 0 0 4 4l2-2" {...P} /></>),
  events: (<><rect x="4" y="5" width="16" height="16" rx="2" {...P} /><line x1="4" y1="9" x2="20" y2="9" {...P} /><line x1="8" y1="3" x2="8" y2="6" {...P} /><line x1="16" y1="3" x2="16" y2="6" {...P} /></>),
  sales: (<><rect x="3" y="7" width="18" height="13" rx="2" {...P} /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" {...P} /></>),
  // Hub
  performance: (<><path d="M4 14a8 8 0 0 1 16 0" {...P} /><line x1="12" y1="14" x2="15.5" y2="10.5" {...P} /><circle cx="12" cy="14" r="1.4" {...P} /></>),
  // Measurement
  tracking: (<><path d="M12 3v11" {...P} /><path d="M8 10l4 4 4-4" {...P} /><path d="M4 20h16" {...P} /></>),
  modeling: (<><path d="M12 3l8 4-8 4-8-4 8-4z" {...P} /><path d="M4 12l8 4 8-4" {...P} /><path d="M4 16.5l8 4 8-4" {...P} /></>),
  reporting: (<><rect x="4" y="4" width="16" height="16" rx="2" {...P} /><line x1="8" y1="16" x2="8" y2="12" {...P} /><line x1="12" y1="16" x2="12" y2="9" {...P} /><line x1="16" y1="16" x2="16" y2="13" {...P} /></>),
  'data-access': (<><path d="M4 5h16v11H8l-4 4V5z" {...P} /><line x1="8" y1="10" x2="16" y2="10" {...P} /><line x1="8" y1="13" x2="13" y2="13" {...P} /></>),
};

export default function PipelineIcon({ name }: { name: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
      {ICONS[name] ?? ICONS.prospection}
    </svg>
  );
}
