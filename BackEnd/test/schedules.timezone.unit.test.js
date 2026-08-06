import { jest } from '@jest/globals';

const mockQuery = jest.fn().mockResolvedValue([[]]);

jest.unstable_mockModule('../models/index.js', () => ({
  sequelize: { query: mockQuery },
}));

const { getAvailableSchedulesByDocSpecLoc } = await import(
  '../services/schedules.service.js'
);

describe('Schedule availability timezone handling', () => {
  it('converts Argentina wall-clock slots to UTC before matching appointments', async () => {
    await getAvailableSchedulesByDocSpecLoc(2, 3, 1, '2026-08-07');

    const [sql, options] = mockQuery.mock.calls[0];
    expect(sql).toContain("CONVERT_TZ(CONCAT(fe.date, ' ', ts.start_time), ?, '+00:00')");
    expect(options.replacements).toEqual([
      2,
      3,
      1,
      '-03:00',
      2,
      3,
      1,
      '2026-08-07',
    ]);
  });
});
