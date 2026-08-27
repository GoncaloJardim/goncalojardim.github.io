export const site = {
  name: 'Gonçalo Jardim',
  tagline: 'GTM Data Scientist / Engineer',
  valueProp:
    "From TAM building and enrichment, to account and lead scoring, to scaling your growth channels (outbound & ads) and making data plain easy to access from the ground up — whether through your AI tool or your reporting. I build the systems and the engine end to end, from TAM prospecting to data activation. An engineer, not a list builder.",
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
