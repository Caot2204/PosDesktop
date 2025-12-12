import { parseLocalDate, toInputDateValue, formatOnlyDate, formatDateForSearch } from '../../src/ui/utils/FormatUtils';

describe('FormatUtils date helpers', () => {
  test('parseLocalDate parses YYYY-MM-DD as local date', () => {
    const d = parseLocalDate('2025-12-10');
    expect(d).not.toBeNull();
    expect(d!.getFullYear()).toBe(2025);
    expect(d!.getMonth()).toBe(11); // December is 11
    expect(d!.getDate()).toBe(10);
  });

  test('parseLocalDate returns null for invalid input', () => {
    expect(parseLocalDate('')).toBeNull();
    expect(parseLocalDate('abc')).toBeNull();
    expect(parseLocalDate(null)).toBeNull();
    expect(parseLocalDate(undefined)).toBeNull();
  });

  test('toInputDateValue returns YYYY-MM-DD for Date', () => {
    const date = new Date(2021, 0, 5); // 2021-01-05
    expect(toInputDateValue(date)).toBe('2021-01-05');
  });

  test('round-trip: parseLocalDate(toInputDateValue(date)) preserves local date', () => {
    const date = new Date(1999, 11, 31); // 1999-12-31
    const s = toInputDateValue(date);
    const parsed = parseLocalDate(s);
    expect(parsed).not.toBeNull();
    expect(parsed!.getFullYear()).toBe(1999);
    expect(parsed!.getMonth()).toBe(11);
    expect(parsed!.getDate()).toBe(31);
  });

  test('formatOnlyDate and formatDateForSearch return zero-padded YYYY-MM-DD', () => {
    const date = new Date(2000, 0, 9); // 2000-01-09
    expect(formatOnlyDate(date)).toBe('2000-01-09');
    expect(formatDateForSearch(date)).toBe('2000-01-09');
  });
});
