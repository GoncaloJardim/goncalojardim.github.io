// Tech stack, grouped by where each tool sits in the data / GTM workflow.
// `logo` (when set) maps to public/logos/<logo>.svg; tools without one render as a text tile.
export interface StackTool {
  name: string;
  logo?: string;
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
    tools: [{ name: 'Python', logo: 'python' }, { name: 'SQL' }],
  },
  {
    title: 'Warehouse & transformation',
    blurb: 'Where the data lives and gets modelled.',
    tools: [
      { name: 'Snowflake', logo: 'snowflake' },
      { name: 'BigQuery', logo: 'bigquery' },
      { name: 'Databricks', logo: 'databricks' },
      { name: 'dbt' },
      { name: 'Google Cloud', logo: 'gcp' },
    ],
  },
  {
    title: 'Orchestration & automation',
    blurb: 'Scheduling and wiring pipelines together.',
    tools: [
      { name: 'Airflow', logo: 'airflow' },
      { name: 'Prefect', logo: 'prefect' },
      { name: 'n8n', logo: 'n8n' },
      { name: 'Docker', logo: 'docker' },
    ],
  },
  {
    title: 'ML & data science',
    blurb: 'Modelling, optimisation and experiment tracking.',
    tools: [
      { name: 'scikit-learn', logo: 'scikitlearn' },
      { name: 'pandas', logo: 'pandas' },
      { name: 'NumPy', logo: 'numpy' },
      { name: 'Google OR-Tools' },
      { name: 'MLflow', logo: 'mlflow' },
    ],
  },
  {
    title: 'Visualisation & BI',
    blurb: 'Getting results in front of stakeholders.',
    tools: [
      { name: 'Tableau' },
      { name: 'Power BI' },
      { name: 'Preset' },
      { name: 'Sisense' },
      { name: 'Matplotlib' },
      { name: 'Seaborn' },
    ],
  },
  {
    title: 'LLM & AI-ops',
    blurb: 'Building and observing LLM-powered features.',
    tools: [
      { name: 'LangFuse' },
      { name: 'LiteLLM' },
      { name: 'PromptLayer' },
      { name: 'exa.ai' },
      { name: 'parallel.ai' },
    ],
  },
  {
    title: 'GTM & revenue tooling',
    blurb: 'The systems the go-to-market motion runs on.',
    tools: [
      { name: 'Salesforce' },
      { name: 'Apollo.io' },
      { name: 'ZoomInfo' },
      { name: 'Lemlist' },
      { name: 'Smartlead' },
      { name: 'ocean.io' },
      { name: 'NeverBounce' },
    ],
  },
  {
    title: 'Data collection',
    blurb: 'Pulling data in from the messy real world.',
    tools: [{ name: 'Selenium', logo: 'selenium' }],
  },
];
