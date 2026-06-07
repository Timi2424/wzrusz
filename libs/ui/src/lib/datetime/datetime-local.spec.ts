import {
  formatDateTimeLocal,
  isBeforeToday,
  parseDateTimeLocal,
  resolveMinDate,
  startOfToday,
} from './datetime-local';

describe('datetime-local', () => {
  it('formats and parses datetime-local strings', () => {
    const date = new Date(2026, 7, 1, 10, 30);
    const value = formatDateTimeLocal(date);

    expect(value).toBe('2026-08-01T10:30');
    const parsed = parseDateTimeLocal(value);
    expect(parsed).not.toBeNull();
    expect(formatDateTimeLocal(parsed as Date)).toBe(value);
  });

  it('resolveMinDate prefers later floor over today', () => {
    const floor = new Date(2026, 11, 1);
    const min = resolveMinDate({ blockPastDates: true, floor });

    expect(min).toEqual(floor);
  });

  it('detects dates before today', () => {
    const yesterday = startOfToday();
    yesterday.setDate(yesterday.getDate() - 1);

    expect(isBeforeToday(formatDateTimeLocal(yesterday))).toBe(true);
    expect(isBeforeToday(formatDateTimeLocal(startOfToday()))).toBe(false);
  });
});
