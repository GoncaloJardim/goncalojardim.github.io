import type { Day } from './contributions';

export type Contributions = { total: number; days: Day[] };

/**
 * Parse GitHub's public contributions HTML (the `/users/<login>/contributions`
 * fragment) into a total and a date-ascending list of day cells.
 *
 * Each day is a `<td class="ContributionCalendar-day" data-date="YYYY-MM-DD"
 * data-level="0-4" id="...">`. Per-day counts live in sibling
 * `<tool-tip for="<id>">N contributions on ...</tool-tip>` elements, so we map
 * those back by id where available. Attribute order is not assumed.
 */
export function parseContributionsHtml(html: string): Contributions {
  // Total, e.g. "1,335 contributions in the last year".
  const totalMatch = html.match(/([\d,]+)\s+contribution/i);
  const total = totalMatch ? Number(totalMatch[1].replace(/,/g, '')) : 0;

  // id -> count, from the accessible tool-tip text.
  const counts = new Map<string, number>();
  const tipRe = /<tool-tip[^>]*\bfor="([^"]+)"[^>]*>\s*(No|[\d,]+)\s+contribution/gi;
  for (let m; (m = tipRe.exec(html)); ) {
    counts.set(m[1], m[2].toLowerCase() === 'no' ? 0 : Number(m[2].replace(/,/g, '')));
  }

  const days: Day[] = [];
  const cellRe = /<td[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>/g;
  for (let m; (m = cellRe.exec(html)); ) {
    const tag = m[0];
    const date = /\bdata-date="(\d{4}-\d{2}-\d{2})"/.exec(tag)?.[1];
    const level = /\bdata-level="(\d+)"/.exec(tag)?.[1];
    if (!date || level == null) continue; // padding cells have no date
    const id = /\bid="([^"]+)"/.exec(tag)?.[1];
    days.push({ date, level: Number(level), count: id ? counts.get(id) : undefined });
  }

  days.sort((a, b) => a.date.localeCompare(b.date));
  return { total, days };
}

/**
 * Fetch and parse a user's last-year contributions straight from GitHub at
 * build time. Returns null on any failure (offline build, rate limit, markup
 * change) so callers can fall back gracefully rather than break the build.
 */
export async function fetchContributions(username: string): Promise<Contributions | null> {
  try {
    const res = await fetch(`https://github.com/users/${encodeURIComponent(username)}/contributions`, {
      headers: {
        'User-Agent': 'portfolio-build (contribution-graph)',
        Accept: 'text/html',
      },
    });
    if (!res.ok) return null;
    const parsed = parseContributionsHtml(await res.text());
    return parsed.days.length ? parsed : null;
  } catch {
    return null;
  }
}
