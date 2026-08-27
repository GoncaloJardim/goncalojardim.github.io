export type Day = { date: string; level: number | string; count?: number };

/** Blue scale (0 = empty → 4 = most active), recoded from GitHub's green.
 *  Saturated ramp so low-activity days still read clearly against the empty cell. */
export const SCALE = ['#e9edf4', '#b3c1ff', '#7d97fb', '#4f6cf5', '#2a44c8'];

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Coerce whatever the API sends (number 0-4, quartile string, or nothing) into 0-4. */
export function levelOf(d: Day): number {
  if (typeof d.level === 'number') return Math.max(0, Math.min(4, Math.round(d.level)));
  const byName: Record<string, number> = {
    NONE: 0,
    FIRST_QUARTILE: 1,
    SECOND_QUARTILE: 2,
    THIRD_QUARTILE: 3,
    FOURTH_QUARTILE: 4,
  };
  if (typeof d.level === 'string' && d.level in byName) return byName[d.level];
  const c = d.count ?? 0;
  if (c <= 0) return 0;
  if (c <= 2) return 1;
  if (c <= 5) return 2;
  if (c <= 9) return 3;
  return 4;
}

/**
 * Group a flat, date-ascending list into calendar weeks (columns), each 7 slots
 * indexed Sun(0)→Sat(6). Leading/trailing slots with no data are null so the grid
 * always aligns to weekday rows.
 */
export function toWeeks(days: Day[]): (Day | null)[][] {
  const weeks: (Day | null)[][] = [];
  let current: (Day | null)[] = new Array(7).fill(null);
  for (const d of days) {
    const wd = new Date(`${d.date}T00:00:00Z`).getUTCDay();
    if (wd === 0 && current.some((x) => x !== null)) {
      weeks.push(current);
      current = new Array(7).fill(null);
    }
    current[wd] = d;
  }
  weeks.push(current);
  return weeks;
}

/** Month abbreviation per week, shown only when a week begins a new month. */
export function monthLabels(weeks: (Day | null)[][]): string[] {
  let last = -1;
  return weeks.map((week) => {
    const first = week.find((d) => d !== null);
    if (!first) return '';
    const m = new Date(`${first.date}T00:00:00Z`).getUTCMonth();
    if (m !== last) {
      last = m;
      return MONTHS[m];
    }
    return '';
  });
}

/** Total contributions — summed from counts where present. */
export function totalContributions(days: Day[]): number {
  return days.reduce((sum, d) => sum + (d.count ?? 0), 0);
}
