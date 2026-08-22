export interface Metric { value: string; label: string; }
export interface HasMetrics { data: { order: number; metrics: Metric[] } }

export function aggregateHeadlineMetrics<T extends HasMetrics>(projects: T[]): Metric[] {
  return [...projects]
    .sort((a, b) => a.data.order - b.data.order)
    .map((p) => p.data.metrics[0])
    .filter((m): m is Metric => Boolean(m));
}
