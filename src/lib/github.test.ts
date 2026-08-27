import { describe, it, expect } from 'vitest';
import { parseContributionsHtml } from './github';

// Trimmed shape of GitHub's /users/<login>/contributions fragment: an <h2>
// total, day <td>s (row-major, so out of date order), one visibility-hidden
// padding cell, and sibling <tool-tip>s carrying per-day counts by id.
const HTML = `
  <h2 class="f4 text-normal mb-2">3 contributions in the last year</h2>
  <table class="ContributionCalendar-grid"><tbody>
    <tr>
      <td class="ContributionCalendar-day" data-date="2024-06-30" data-level="0" id="c-0"></td>
      <td tabindex="-1" data-level="2" class="ContributionCalendar-day" data-date="2024-07-01" id="c-1"></td>
    </tr>
    <tr>
      <td class="ContributionCalendar-day" data-date="2024-06-29" data-level="1" id="c-2"></td>
      <td class="ContributionCalendar-day" style="visibility:hidden"></td>
    </tr>
  </tbody></table>
  <tool-tip for="c-1" class="sr-only position-absolute">2 contributions on Monday, July 1, 2024</tool-tip>
  <tool-tip for="c-2">1 contribution on Saturday, June 29, 2024</tool-tip>
  <tool-tip for="c-0">No contributions on Sunday, June 30, 2024</tool-tip>
`;

describe('parseContributionsHtml', () => {
  const { total, days } = parseContributionsHtml(HTML);

  it('reads the yearly total from the heading', () => {
    expect(total).toBe(3);
  });

  it('returns days sorted ascending by date, skipping padding cells', () => {
    expect(days.map((d) => d.date)).toEqual(['2024-06-29', '2024-06-30', '2024-07-01']);
  });

  it('captures the intensity level regardless of attribute order', () => {
    expect(days.find((d) => d.date === '2024-07-01')?.level).toBe(2);
    expect(days.find((d) => d.date === '2024-06-29')?.level).toBe(1);
  });

  it('maps per-day counts back from tool-tips by id, incl. "No contributions"', () => {
    expect(days.find((d) => d.date === '2024-07-01')?.count).toBe(2);
    expect(days.find((d) => d.date === '2024-06-29')?.count).toBe(1);
    expect(days.find((d) => d.date === '2024-06-30')?.count).toBe(0);
  });

  it('parses a comma-formatted total', () => {
    expect(parseContributionsHtml('<h2>1,335 contributions in the last year</h2>').total).toBe(1335);
  });
});
