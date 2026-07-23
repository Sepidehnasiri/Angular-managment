import {
  compareDateStrings,
  isBeforeToday,
  isTodayOrFuture,
  parseLocalDate,
} from './date-utils';

describe('date-utils', () => {
  it('parses YYYY-MM-DD values as local midnight dates', () => {
    const date = parseLocalDate('2026-07-21');

    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(6);
    expect(date.getDate()).toBe(21);
    expect(date.getHours()).toBe(0);
  });

  it('sorts date strings chronologically', () => {
    expect(compareDateStrings('2026-07-21', '2026-07-22')).toBeLessThan(0);
    expect(compareDateStrings('2026-07-22', '2026-07-21')).toBeGreaterThan(0);
  });

  it('treats today as upcoming and yesterday as past', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const toDateString = (date: Date) =>
      [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
      ].join('-');

    expect(isTodayOrFuture(toDateString(today))).toBeTrue();
    expect(isBeforeToday(toDateString(yesterday))).toBeTrue();
  });
});
