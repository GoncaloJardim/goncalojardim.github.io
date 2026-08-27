export const site = {
  name: 'Gonçalo Jardim',
  tagline: 'GTM Data Scientist / Engineer',
  valueProp:
    "Scoring models, prospecting and enrichment automation, and outbound infrastructure, built from scratch and driving real numbers: 5x outbound volume, $1.5M+ in quarterly pipeline, and email bounce down from 8% to under 3%. If your GTM motion still runs on gut feel and manual lists, that's what I fix.",
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
