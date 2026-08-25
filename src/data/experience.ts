// Career history for the Experience page (LinkedIn-style rows).
// `logo` (when set) is a filename in public/logos/; otherwise a monogram avatar is shown.
// A bullet's `link` embeds a hyperlink on the phrase `link.text` (which must appear in `text`),
// pointing at that project's case study under /projects/<caseStudy>.
export interface Bullet {
  text: string;
  link?: { text: string; caseStudy: string };
}
export interface Role {
  company: string;
  title: string;
  period: string;
  logo?: string;
  bullets: Bullet[];
}
export interface RoleGroup {
  heading: string;
  roles: Role[];
}

export const experience: RoleGroup[] = [
  {
    heading: 'Experience',
    roles: [
      {
        company: 'Snowplow',
        title: 'GTM Data Scientist / Engineer',
        period: 'Jun 2025 - Present',
        logo: 'snowplow.png',
        bullets: [
          { text: 'Built the GTM engineering function and engine from scratch.' },
          {
            text: 'Shipped an account fit score used company-wide to prioritise the addressable market.',
            link: { text: 'account fit score', caseStudy: 'account-fit-score' },
          },
          {
            text: 'Built account and contact engagement scores that rank accounts by real-time buying intent.',
            link: { text: 'account and contact engagement scores', caseStudy: 'account-engagement-score' },
          },
          {
            text: 'Automated multi-provider enrichment and net-new account discovery with an AI prospecting agent, adding ~30% more tracked companies and cutting email bounce from 8% to under 3%.',
            link: { text: 'multi-provider enrichment', caseStudy: 'gtm-enrichment-engine' },
          },
          {
            text: 'Increased outbound volume 5-fold and democratised campaign creation, dropping time-to-market from 3 days to 30 minutes so any GTM operator can launch their own.',
            link: { text: 'democratised campaign creation', caseStudy: 'outbound-campaign-democratization' },
          },
        ],
      },
      {
        company: 'Gorgias',
        title: 'GTM Data Scientist',
        period: 'Aug 2023 - May 2025',
        logo: 'gorgias.png',
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
        logo: 'daredata.png',
        bullets: [
          { text: "Advanced-analytics data scientist for the world's second-largest beer producer." },
          { text: "Built a route-optimisation model (Google OR-Tools) that increased account managers' client visits by +40% nationally." },
          { text: 'Shipped a price recommender that strengthened negotiation power, profit margin and quota prediction.' },
          { text: 'Contributed to a customer-segmentation model informing sales and marketing strategy, and an internal revenue/volume/cash-flow projection tool adopted by product owners and upper management.' },
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
        logo: 'analytics-accelerator.png',
        bullets: [
          { text: 'Mentoring people transitioning into data analyst roles or upskilling. Average time to land a new job: 2.5 months; average salary increase: 32%.' },
        ],
      },
      {
        company: 'Ironhack',
        title: 'Lead Teacher, Data Analytics',
        period: 'Feb 2022 - Jun 2025',
        logo: 'ironhack.png',
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
  logo?: string;
}

export const education: Education[] = [
  { school: 'ISEG, Lisbon School of Economics and Management', qualification: "Master's, Industrial Management and Strategy", period: '2018 - 2021', logo: 'iseg.png' },
  { school: 'Instituto Superior Técnico (IST)', qualification: "Bachelor's, Engineering", period: '2013 - 2018', logo: 'ist.png' },
  { school: 'Ironhack', qualification: 'Data Analytics Bootcamp', period: '2021', logo: 'ironhack.png' },
  { school: 'Lisbon Data Science Academy (LDSA)', qualification: 'Data Science Course', period: '2022', logo: 'ldsa.png' },
  { school: 'DataTalks.Club', qualification: 'MLOps Zoomcamp (MLflow, Prefect)', period: '2023', logo: 'dtc.png' },
];
