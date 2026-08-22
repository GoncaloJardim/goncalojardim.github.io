import { describe, it, expect } from 'vitest';
import { aggregateHeadlineMetrics } from './metrics';

const projects = [
  { data: { order: 2, metrics: [{ value: '~190x', label: 'lift' }, { value: 'x', label: 'y' }] } },
  { data: { order: 1, metrics: [{ value: '~10x', label: 'opp rate' }] } },
  { data: { order: 3, metrics: [] } },
];

describe('aggregateHeadlineMetrics', () => {
  it('returns the first metric of each project sorted by order, skipping empty', () => {
    expect(aggregateHeadlineMetrics(projects)).toEqual([
      { value: '~10x', label: 'opp rate' },
      { value: '~190x', label: 'lift' },
    ]);
  });
});
