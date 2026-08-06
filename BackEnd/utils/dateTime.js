const OFFSET_PATTERN = /^([+-])(\d{2}):(\d{2})$/;
const LOCAL_DATE_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/;

export const CLINIC_TIMEZONE_OFFSET = OFFSET_PATTERN.test(
  process.env.CLINIC_TIMEZONE_OFFSET || ''
)
  ? process.env.CLINIC_TIMEZONE_OFFSET
  : '-03:00';

const getOffsetMinutes = (offset) => {
  const match = OFFSET_PATTERN.exec(offset);
  if (!match) {
    throw new Error(`Invalid clinic timezone offset: ${offset}`);
  }

  const sign = match[1] === '-' ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3]));
};

export const normalizeClinicDateTimeToUtc = (value) => {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) throw new Error('Invalid appointment date and time.');
    return new Date(value.getTime());
  }

  if (typeof value !== 'string') {
    throw new Error('Invalid appointment date and time.');
  }

  const trimmedValue = value.trim();
  const localMatch = LOCAL_DATE_TIME_PATTERN.exec(trimmedValue);

  if (!localMatch) {
    const parsed = new Date(trimmedValue);
    if (Number.isNaN(parsed.getTime())) throw new Error('Invalid appointment date and time.');
    return parsed;
  }

  const [, year, month, day, hour, minute, second = '0'] = localMatch;
  const parts = [year, month, day, hour, minute, second].map(Number);
  const [numericYear, numericMonth, numericDay, numericHour, numericMinute, numericSecond] = parts;
  const offsetMinutes = getOffsetMinutes(CLINIC_TIMEZONE_OFFSET);
  const utcMilliseconds = Date.UTC(
    numericYear,
    numericMonth - 1,
    numericDay,
    numericHour,
    numericMinute,
    numericSecond
  ) - offsetMinutes * 60 * 1000;

  const localCheck = new Date(utcMilliseconds + offsetMinutes * 60 * 1000);
  const isValid =
    localCheck.getUTCFullYear() === numericYear
    && localCheck.getUTCMonth() === numericMonth - 1
    && localCheck.getUTCDate() === numericDay
    && localCheck.getUTCHours() === numericHour
    && localCheck.getUTCMinutes() === numericMinute
    && localCheck.getUTCSeconds() === numericSecond;

  if (!isValid) throw new Error('Invalid appointment date and time.');

  return new Date(utcMilliseconds);
};
