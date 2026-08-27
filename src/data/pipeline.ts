// Content model for the homepage "engine, end to end" vertical diagram.
// Rendered by src/components/PipelineDiagram.astro.

export interface PipelineItem {
  label: string;
  detail: string;
}

export interface PipelineStage {
  id: string;
  title: string;
  /** Short line shown in the collapsed card (a stat or one-line framing). */
  teaser?: string;
  items: PipelineItem[];
}

/** The linear spine, top to bottom. */
export const spine: PipelineStage[] = [
  {
    id: 'prospection',
    title: 'Prospection',
    teaser: 'Prospect and enrich your TAM — 90% of SaaS companies track only a small slice of theirs.',
    items: [
      {
        label: 'Look-alike accounts',
        detail:
          'Focus on the highest-fit accounts, in the segments you are already winning.',
      },
    ],
  },
  {
    id: 'enrichment',
    title: 'Enrichment',
    teaser: 'Turn a name into a full account and contact record.',
    items: [
      {
        label: 'Account enrichment',
        detail:
          'Enrich every account into your CRM and warehouse: company data, financials, technographics and department headcounts.',
      },
      {
        label: 'Lead enrichment',
        detail:
          'Find your ICP leads, enriched via a waterfall across 7+ sources for higher accuracy and coverage.',
      },
    ],
  },
  {
    id: 'scoring',
    title: 'Scoring',
    teaser: 'Rank who to work, and know exactly why.',
    items: [
      {
        label: 'Account Fit Score',
        detail:
          'In-house ML model that learns the firmographic & technographic dimensions of high-fit accounts. Every dimension is weighted, so you can rank accounts and see exactly what is driving the score.',
      },
      {
        label: 'Account Engagement Score',
        detail:
          'In-house ML model that reads behavioral activity to segment active buying intent across the funnel. Weighted dimensions let you rank by live intent and see what is driving engagement.',
      },
      {
        label: 'Contact Score',
        detail: 'Weights ICP traits to prioritize the right leads inside each account.',
      },
    ],
  },
  {
    id: 'signals',
    title: 'Signals Collection',
    teaser: '17+ live signals maintained across contacts and accounts.',
    items: [
      {
        label: '17+ active signals',
        detail:
          'A system that finds, categorizes and maintains 17+ live signals across contacts and accounts.',
      },
    ],
  },
];

/** First fan-out: Activation. */
export const activation: PipelineStage[] = [
  {
    id: 'outbound',
    title: 'Outbound',
    items: [
      {
        label: 'Outbound infrastructure',
        detail:
          'Owned end to end: buying domains, provisioning Google and Outlook workspaces, allocating inboxes, plus email rotation and deliverability control for sending at scale.',
      },
      {
        label: 'Intent-signal matching',
        detail: 'Contact- and account-level signals feed context into every touch.',
      },
      {
        label: 'Email copy',
        detail: 'Internal and external context turned into 1-1 personalized sequences.',
      },
      {
        label: 'Lead routing',
        detail:
          'Right lead to the right campaign, with metadata and value prop tracked across campaigns.',
      },
      {
        label: 'Tracking',
        detail: 'All event data collected and synced to the CRM and preferred warehouse.',
      },
    ],
  },
  {
    id: 'partnerships',
    title: 'Partnerships',
    items: [
      {
        label: 'Partner–account mapping',
        detail: 'Link partners to current accounts via Crossbeam.',
      },
      {
        label: 'Look-alike customers',
        detail: 'Surface look-alikes to reuse customer stories for context alignment.',
      },
      {
        label: 'Partner outbound',
        detail: 'An outbound motion that grows partnerships pipeline.',
      },
    ],
  },
  {
    id: 'events',
    title: 'Events',
    items: [
      {
        label: 'Event promotion',
        detail: 'Automated promotion, from webinars to city-specific on-site events.',
      },
      {
        label: 'Follow-up automation',
        detail:
          'Event managers, partnerships and sales teams follow up with event leads effortlessly.',
      },
    ],
  },
  {
    id: 'sales',
    title: 'Sales',
    items: [
      {
        label: 'AE self-serve outbound',
        detail:
          'The whole motion via Claude: audience building, territory matching, campaign ideation, copy, pushed to the sequencer (Smartlead or Lemlist for multi-touch outreach).',
      },
      {
        label: 'Sales reporting',
        detail: 'Tracking across the funnel, from prospection to deal creation.',
      },
    ],
  },
];

/** The converge node between the two fan-outs. */
export const performance = {
  title: 'Performance Measuring',
  teaser: 'Close the loop — measure everything the engine does.',
};

/** Second fan-out: measurement and data foundation. */
export const measurement: PipelineStage[] = [
  {
    id: 'tracking',
    title: 'Tracking',
    items: [
      {
        label: 'Data extraction',
        detail:
          'Extract data from every source across tools and activities (Airbyte, n8n, Census, Fivetran).',
      },
    ],
  },
  {
    id: 'modeling',
    title: 'Data Modeling',
    items: [
      {
        label: 'Data foundation',
        detail:
          'Build the clean, warehouse-ready data foundation the rest of the stack relies on (dbt).',
      },
    ],
  },
  {
    id: 'reporting',
    title: 'Reporting',
    items: [
      {
        label: 'Dashboards',
        detail:
          'Dashboards across enrichment, lead scoring, growth-channel performance and pipeline generated.',
      },
    ],
  },
  {
    id: 'data-access',
    title: 'Data Access',
    items: [
      {
        label: 'Democratized access',
        detail:
          'Democratize access via the Claude UI: talk to your data, craft your analysis and get the easiest access to data, in the tool you use daily.',
      },
    ],
  },
];
