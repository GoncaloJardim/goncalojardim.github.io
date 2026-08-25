// Career history for the Experience page. `caseStudy` (a project slug) links a
// bullet to its case study under /projects/<slug>.
export interface Bullet {
  text: string;
  caseStudy?: string;
}
export interface Role {
  company: string;
  title: string;
  period: string;
  location?: string;
  bullets: Bullet[];
}
export interface RoleGroup {
  heading: string;
  roles: Role[];
}

export const experience: RoleGroup[] = [
  {
    heading: 'Industry',
    roles: [
      {
        company: 'Snowplow',
        title: 'GTM Data Scientist / Engineer',
        period: 'Jun 2025 - Present',
        bullets: [
          { text: 'Built the GTM engineering function and engine from scratch.' },
          { text: 'Shipped an account fit score used company-wide to prioritise the addressable market.', caseStudy: 'account-fit-score' },
          { text: 'Built account and contact engagement scores that rank accounts by real-time buying intent.', caseStudy: 'account-engagement-score' },
          { text: 'Automated multi-provider enrichment and net-new account discovery with an AI prospecting agent, adding ~30% more tracked companies and cutting email bounce from 8% to under 3%.', caseStudy: 'gtm-enrichment-engine' },
          { text: 'Increased outbound volume 5-fold and democratised campaign creation, dropping time-to-market from 3 days to 30 minutes so any GTM operator can launch their own.', caseStudy: 'outbound-campaign-democratization' },
        ],
      },
      {
        company: 'Gorgias',
        title: 'GTM Data Scientist',
        period: 'Aug 2023 - May 2025',
        bullets: [
          { text: 'Built lead intent and account fit scoring models used company-wide to shape GTM strategy.' },
          { text: 'Fully automated the outbound motion from company prospecting to AI copy to lead routing: up to 700K+ leads reached per quarter, generating $1.5M+ in quarterly pipeline.' },
          { text: 'Built an A/B testing framework (inferential and Bayesian) to measure demand-gen strategies, lifting pipeline +15%.' },
          { text: 'Partnered with Demand Gen, Partnerships, Events, Sales and PMM.' },
        ],
      },
      {
        company: 'DareData',
        title: 'Data Analyst to Data Scientist',
        period: 'Feb 2022 - Aug 2023',
        bullets: [
          { text: "Advanced-analytics data scientist for the world's second-largest beer producer." },
          { text: "Built a route-optimisation model (Google OR-Tools) that increased account managers' client visits by +40% nationally." },
          { text: 'Shipped a price recommender that strengthened negotiation power, profit margin and quota prediction.' },
          { text: 'Contributed to a customer-segmentation model informing sales and marketing strategy, and an internal revenue/volume/cash-flow projection tool adopted by product owners and upper management.' },
        ],
      },
      {
        company: 'Leroy Merlin',
        title: 'Business Manager',
        period: 'Oct 2019 - Aug 2021',
        bullets: [
          { text: 'Owned B2B and B2C strategy and P&L for an area doing 5.5M EUR/year in sales, overseeing everything from logistics to sales. Managed a team of 12.' },
        ],
      },
    ],
  },
  {
    heading: 'Teaching',
    roles: [
      {
        company: 'Analytics Accelerator',
        title: 'Mentor / Teacher',
        period: 'May 2026 - Present',
        bullets: [
          { text: 'Mentoring people transitioning into data analyst roles or upskilling. Average time to land a new job: 2.5 months; average salary increase: 32%.' },
        ],
      },
      {
        company: 'Ironhack',
        title: 'Lead Teacher, Data Analytics',
        period: 'Feb 2022 - Jun 2025',
        bullets: [
          { text: 'Mentored 190+ students across 8 cohorts in Python, SQL, data manipulation, visualisation, statistics and machine learning. Started as a Teaching Assistant and was promoted to Lead Teacher after 1.5 years.' },
        ],
      },
    ],
  },
];

export interface Education {
  school: string;
  qualification: string;
  period: string;
}

export const education: Education[] = [
  { school: 'ISEG, Lisbon School of Economics and Management', qualification: "Master's, Industrial Management and Strategy", period: '2018 - 2021' },
  { school: 'Instituto Superior Técnico (IST)', qualification: "Bachelor's, Engineering", period: '2013 - 2018' },
  { school: 'Ironhack', qualification: 'Data Analytics Bootcamp', period: '2021' },
  { school: 'Lisbon Data Science Academy (LDSA)', qualification: 'Data Science Course', period: '2022' },
  { school: 'MLOps Zoomcamp', qualification: 'Model deployment and orchestration (MLflow, Prefect)', period: '2023' },
];
