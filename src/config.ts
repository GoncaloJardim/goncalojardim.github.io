export const site = {
  name: 'Gonçalo Jardim',
  tagline: 'GTM Data Scientist / Engineer',
  valueProp:
    "Zero to one across your GTM data infrastructure — prioritization, prospecting, enrichment, campaign deployment, and the reporting and attribution that closes the loop. An engineer focused on revenue, not a list builder.",
  email: 'goncalodajardim@gmail.com',
  calendly: 'https://calendly.com/goncalojardim/30min',
  github: 'https://github.com/GoncaloJardim',
  githubUsername: 'GoncaloJardim',
  linkedin: 'https://www.linkedin.com/in/goncalo-jardim/',
} as const;

/** Prefix an internal path with the configured base path (e.g. "/portfolio"). */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL; // e.g. "/portfolio/" or "/"
  return `${base}/${path}`.replace(/\/{2,}/g, '/');
}
