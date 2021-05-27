import { DateInfo, OptionalNumber } from "./types.ts";

function dateInfoToArray(
  dateInfo: DateInfo,
): [
  number,
  number,
  OptionalNumber,
  OptionalNumber,
  OptionalNumber,
  OptionalNumber,
  OptionalNumber,
] {
  const { year, month, day, hours, minutes, seconds, milliseconds } = dateInfo;
  return [
    year,
    month - 1,
    day ?? 0,
    hours ?? 0,
    minutes ?? 0,
    seconds ?? 0,
    milliseconds ?? 0,
  ];
}

export function dateInfoToTS(date: DateInfo) {
  return Date.UTC(...dateInfoToArray(date));
}

export function dateInfoToJSDate(
  date: DateInfo,
): Date {
  return new Date(dateInfoToTS(date));
}

export function jsDateToDateInfo(jsDate: Date): DateInfo {
  return {
    year: jsDate.getUTCFullYear(),
    month: jsDate.getUTCMonth() + 1,
    day: jsDate.getUTCDate(),
    hours: jsDate.getUTCHours(),
    minutes: jsDate.getUTCMinutes(),
    seconds: jsDate.getUTCSeconds(),
    milliseconds: jsDate.getUTCMilliseconds(),
  };
}

export function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function daysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

export function daysInMonth(year: number, month: number): number {
  if (month == 2) {
    return isLeapYear(year) ? 29 : 28;
  } else {
    return [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
  }
}

export function weeksInWeekYear(year: number) {
  const p1 = (year +
      Math.floor(year / 4) -
      Math.floor(year / 100) +
      Math.floor(year / 400)) %
      7,
    last = year - 1,
    p2 = (last + Math.floor(last / 4) - Math.floor(last / 100) +
      Math.floor(last / 400)) % 7;
  return p1 === 4 || p2 === 3 ? 53 : 52;
}

export function isBetween(n: number, min: number, max: number): boolean {
  return min <= n && n <= max;
}

export function isValidDate(dateInfo: DateInfo): boolean {
  const { year, month, day, hours, minutes, seconds, milliseconds } = dateInfo;

  const isValidMonth = isBetween(month, 1, 12);
  if (!isValidMonth) return false;

  if (day) {
    const isValidDay = isBetween(day, 1, daysInMonth(year, month));
    if (!isValidDay) return false;
  }

  if (hours) {
    const isValidHour = isBetween(hours, 1, 23) ||
      (hours === 24 && minutes === 0 && seconds === 0 && milliseconds === 0);
    if (!isValidHour) return false;
  }

  if (minutes) {
    const isValidMinutes = isBetween(minutes, 0, 59);
    if (!isValidMinutes) return false;
  }

  if (seconds) {
    const isValidSeconds = isBetween(seconds, 0, 59);
    if (!isValidSeconds) return false;
  }

  if (milliseconds) {
    const isValidMilliseconds = isBetween(milliseconds, 0, 999);
    if (!isValidMilliseconds) return false;
  }

  return true;
}
