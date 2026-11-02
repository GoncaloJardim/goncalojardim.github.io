export const site = {
  name: 'Gonçalo Jardim',
  tagline: 'GTM Data Scientist / Engineer',
  valueProp:
    "I plug and play the systems that every GTM department needs to perform at scale. An in-house operator or a fractional hire takes months to show results. With our approach, you leverage our systems from day one. Hit the ground running and earn clear measurable ROI.",
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
