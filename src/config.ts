export const site = {
  name: 'Gonçalo Jardim',
  tagline: 'GTM Data Scientist / Engineer',
  valueProp:
    "That's the sharp end of it. Underneath sits the whole pipeline: the models that prioritise your market, the enrichment engine that finds and validates the people to contact, and the outbound infrastructure that actually works them, without anyone fat-fingering a send. All on a modern data stack (Python, Snowflake, dbt, n8n).",
  email: 'goncalodajardim@gmail.com',
  calendly: 'https://calendly.com/goncalojardim/30min',
  github: 'https://github.com/GoncaloJardim',
  linkedin: 'https://www.linkedin.com/in/goncalo-jardim/',
} as const;

/** Prefix an internal path with the configured base path (e.g. "/portfolio"). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL; // e.g. "/portfolio/" or "/"
  return `${base}/${path}`.replace(/\/{2,}/g, '/');
}
