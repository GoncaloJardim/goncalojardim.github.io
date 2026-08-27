import { useEffect, useMemo, useState } from 'react';
import {
  type Day,
  SCALE,
  levelOf,
  toWeeks,
  monthLabels,
  totalContributions,
} from '../lib/contributions';

type ApiResponse = { contributions: Day[] };

export default function ContributionGraph({ username }: { username: string }) {
  const [days, setDays] = useState<Day[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`https://github-contributions-api.jogruber.dev/v4/${username}?y=last`)
      .then((r) => (r.ok ? (r.json() as Promise<ApiResponse>) : Promise.reject(r.status)))
      .then((data) => {
        if (!cancelled) setDays(data.contributions ?? []);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [username]);

  const weeks = useMemo(() => (days ? toWeeks(days) : []), [days]);
  const total = useMemo(() => (days ? totalContributions(days) : 0), [days]);
  const labels = useMemo(() => monthLabels(weeks), [weeks]);

  if (failed) {
    return (
      <p className="cg-fallback">
        Live GitHub graph unavailable right now —{' '}
        <a href={`https://github.com/${username}`} target="_blank" rel="noopener">
          see it on GitHub →
        </a>
      </p>
    );
  }

  const loading = days === null;
  // Skeleton keeps the layout from jumping while the real data loads.
  const columns = loading ? 53 : weeks.length;

  return (
    <figure
      className="cg"
      role="img"
      aria-label={
        loading
          ? 'Loading GitHub contribution graph'
          : `${total.toLocaleString()} GitHub contributions in the last year`
      }
    >
      <figcaption className="cg-cap">
        {loading ? (
          ' '
        ) : (
          <>
            <strong>{total.toLocaleString()}</strong> contributions in the last year
          </>
        )}
      </figcaption>

      <div className="cg-scroll">
        <div className="cg-inner">
          <div className="cg-months">
            <span className="cg-days-spacer" aria-hidden="true" />
            <div className="cg-months-grid" style={{ gridTemplateColumns: `repeat(${columns}, var(--cell))` }}>
              {(loading ? new Array(columns).fill('') : labels).map((label, i) => (
                <span key={i} className="cg-month">{label}</span>
              ))}
            </div>
          </div>

          <div className="cg-body">
            <div className="cg-days" aria-hidden="true">
              <span style={{ gridRow: 2 }}>Mon</span>
              <span style={{ gridRow: 4 }}>Wed</span>
              <span style={{ gridRow: 6 }}>Fri</span>
            </div>
            <div className="cg-cells">
              {loading
                ? new Array(columns * 7).fill(null).map((_, i) => (
                    <span key={i} className="cg-cell" style={{ background: SCALE[0] }} />
                  ))
                : weeks.flatMap((week, w) =>
                    week.map((d, r) => (
                      <span
                        key={`${w}-${r}`}
                        className="cg-cell"
                        style={{ background: SCALE[d ? levelOf(d) : 0] }}
                        title={d ? `${d.count} on ${d.date}` : undefined}
                      />
                    )),
                  )}
            </div>
          </div>
        </div>
      </div>

      <div className="cg-legend" aria-hidden="true">
        <span>Less</span>
        {SCALE.map((c, i) => (
          <span key={i} className="cg-cell" style={{ background: c }} />
        ))}
        <span>More</span>
      </div>
    </figure>
  );
}
