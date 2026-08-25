// Tech stack, grouped by where each tool sits in the data / GTM workflow.
// `logo` (when set) is a filename in public/logos/; tools without one render as a text tile.
// `lockup: true` means the logo already includes the wordmark, so it renders on its own
// (no separate text label). Icon-only logos render as [icon] + name.
export interface StackTool {
  name: string;
  logo?: string;
  lockup?: boolean;
}
export interface StackCategory {
  title: string;
  blurb: string;
  tools: StackTool[];
}

export const stack: StackCategory[] = [
  {
    title: 'Languages',
    blurb: 'The two I write in every day.',
    tools: [{ name: 'Python', logo: 'python.svg' }, { name: 'SQL', logo: 'sql.png', lockup: true }],
  },
  {
    title: 'Warehouse & transformation',
    blurb: 'Where the data lives and gets modelled.',
    tools: [
      { name: 'Snowflake', logo: 'snowflake.svg' },
      { name: 'BigQuery', logo: 'bigquery.svg' },
      { name: 'Databricks', logo: 'databricks.svg' },
      { name: 'dbt', logo: 'dbt.png' },
      { name: 'Google Cloud', logo: 'gcp.svg' },
    ],
  },
  {
    title: 'Orchestration & automation',
    blurb: 'Scheduling and wiring pipelines together.',
    tools: [
      { name: 'Airflow', logo: 'airflow.svg' },
      { name: 'Prefect', logo: 'prefect.svg' },
      { name: 'n8n', logo: 'n8n.svg' },
      { name: 'Docker', logo: 'docker.svg' },
      { name: 'Cargo', logo: 'cargo.png' },
    ],
  },
  {
    title: 'ML & data science',
    blurb: 'Modelling, optimisation and experiment tracking.',
    tools: [
      { name: 'scikit-learn', logo: 'scikitlearn.svg' },
      { name: 'pandas', logo: 'pandas.svg' },
      { name: 'NumPy', logo: 'numpy.svg' },
      { name: 'Google OR-Tools', logo: 'ortools.png', lockup: true },
      { name: 'MLflow', logo: 'mlflow.svg' },
    ],
  },
  {
    title: 'Visualisation & BI',
    blurb: 'Getting results in front of stakeholders.',
    tools: [
      { name: 'Tableau', logo: 'tableau.png' },
      { name: 'Power BI', logo: 'powerbi.png' },
      { name: 'Metabase', logo: 'metabase.svg' },
      { name: 'Preset', logo: 'preset.png' },
      { name: 'Matplotlib', logo: 'matplotlib.png', lockup: true },
      { name: 'Sisense', logo: 'sisense.png' },
      { name: 'Plotly', logo: 'plotly.svg' },
    ],
  },
  {
    title: 'LLM & AI-ops',
    blurb: 'Building and observing LLM-powered features.',
    tools: [
      { name: 'LangFuse', logo: 'langfuse.png' },
      { name: 'LiteLLM', logo: 'litellm.png' },
      { name: 'PromptLayer', logo: 'promptlayer.png', lockup: true },
      { name: 'exa.ai', logo: 'exa.png' },
      { name: 'parallel.ai', logo: 'parallel.png' },
    ],
  },
  {
    title: 'GTM & revenue tooling',
    blurb: 'The systems the go-to-market motion runs on.',
    tools: [
      { name: 'Salesforce', logo: 'salesforce.png' },
      { name: 'Apollo.io' },
      { name: 'ZoomInfo', logo: 'zoominfo.png' },
      { name: 'Enrichley', logo: 'enrichley.png' },
    ],
  },
  {
    title: 'Email sequencers',
    blurb: 'Where the outbound actually gets sent and managed.',
    tools: [
      { name: 'Lemlist', logo: 'lemlist.png' },
      { name: 'Instantly.ai', logo: 'instantly.png' },
      { name: 'Smartlead', logo: 'smartlead.png' },
    ],
  },
  {
    title: 'Data collection',
    blurb: 'Pulling data in from the messy real world.',
    tools: [{ name: 'Selenium', logo: 'selenium.svg' }, { name: 'Apify', logo: 'apify.png' }],
  },
];
