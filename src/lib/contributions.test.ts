import { describe, it, expect } from 'vitest';
import { type Day, levelOf, toWeeks, monthLabels, totalContributions } from './contributions';

/** Build a year of daily entries starting on a known Sunday (2024-06-30 is a Sunday). */
function makeDays(n: number, start = '2024-06-30'): Day[] {
  const base = new Date(`${start}T00:00:00Z`).getTime();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(base + i * 86400000);
    return { date: d.toISOString().slice(0, 10), count: 0, level: 0 };
  });
}

describe('levelOf', () => {
  it('passes through and clamps numeric levels', () => {
    expect(levelOf({ date: 'x', count: 0, level: 0 })).toBe(0);
    expect(levelOf({ date: 'x', count: 99, level: 4 })).toBe(4);
    expect(levelOf({ date: 'x', count: 99, level: 7 })).toBe(4);
  });

  it('maps GitHub quartile strings', () => {
    expect(levelOf({ date: 'x', count: 3, level: 'THIRD_QUARTILE' })).toBe(3);
    expect(levelOf({ date: 'x', count: 0, level: 'NONE' })).toBe(0);
  });

  it('derives a level from count when level is missing', () => {
    expect(levelOf({ date: 'x', count: 0, level: undefined as unknown as number })).toBe(0);
    expect(levelOf({ date: 'x', count: 2, level: undefined as unknown as number })).toBe(1);
    expect(levelOf({ date: 'x', count: 5, level: undefined as unknown as number })).toBe(2);
    expect(levelOf({ date: 'x', count: 9, level: undefined as unknown as number })).toBe(3);
    expect(levelOf({ date: 'x', count: 20, level: undefined as unknown as number })).toBe(4);
  });
});

describe('toWeeks', () => {
  it('groups a full year into aligned 7-slot week columns', () => {
    const weeks = toWeeks(makeDays(365));
    // 365 days starting on a Sunday spans 53 partial/full weeks.
    expect(weeks.length).toBe(53);
    expect(weeks.every((w) => w.length === 7)).toBe(true);
  });

  it('places each day in its correct weekday row (Sun=0)', () => {
    const days = makeDays(3); // Sun, Mon, Tue
    const [week] = toWeeks(days);
    expect(week[0]?.date).toBe('2024-06-30'); // Sunday
    expect(week[1]?.date).toBe('2024-07-01'); // Monday
    expect(week[2]?.date).toBe('2024-07-02'); // Tuesday
    expect(week[3]).toBeNull();
  });

  it('pads the leading slots when the range starts mid-week', () => {
    const days = makeDays(2, '2024-07-02'); // Tuesday, Wednesday
    const [week] = toWeeks(days);
    expect(week[0]).toBeNull(); // Sun
    expect(week[1]).toBeNull(); // Mon
    expect(week[2]?.date).toBe('2024-07-02'); // Tue
  });
});

describe('monthLabels', () => {
  it('labels only the weeks that begin a new month', () => {
    const weeks = toWeeks(makeDays(70)); // spans June, July, and into September... ~10 weeks
    const labels = monthLabels(weeks);
    // First label is the starting month; labels are non-empty only at month boundaries.
    expect(labels[0]).toBe('Jun');
    expect(labels.filter(Boolean).length).toBeGreaterThanOrEqual(2);
    expect(labels.filter(Boolean).length).toBeLessThan(weeks.length);
  });
});

describe('totalContributions', () => {
  it('sums counts regardless of the API total key', () => {
    const days: Day[] = [
      { date: 'a', count: 3, level: 1 },
      { date: 'b', count: 0, level: 0 },
      { date: 'c', count: 7, level: 4 },
    ];
    expect(totalContributions(days)).toBe(10);
  });
});
