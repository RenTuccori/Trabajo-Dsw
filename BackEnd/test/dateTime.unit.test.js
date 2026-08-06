import {
  CLINIC_TIMEZONE_OFFSET,
  normalizeClinicDateTimeToUtc,
} from '../utils/dateTime.js';

describe('Clinic date and time normalization', () => {
  it('uses the Argentina offset by default', () => {
    expect(CLINIC_TIMEZONE_OFFSET).toBe('-03:00');
  });

  it('converts an Argentina wall-clock time to UTC', () => {
    const result = normalizeClinicDateTimeToUtc('2026-08-07 10:00:00');

    expect(result.toISOString()).toBe('2026-08-07T13:00:00.000Z');
  });

  it('preserves an ISO instant that already includes its timezone', () => {
    const result = normalizeClinicDateTimeToUtc('2026-08-07T13:00:00.000Z');

    expect(result.toISOString()).toBe('2026-08-07T13:00:00.000Z');
  });

  it('rejects impossible local dates', () => {
    expect(() => normalizeClinicDateTimeToUtc('2026-02-30 10:00:00')).toThrow(
      'Invalid appointment date and time.'
    );
  });
});
