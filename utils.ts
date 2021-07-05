import { MILLISECONDS_IN_MINUTE } from "./constants.ts";
import { DateObj } from "./types.ts";

export const INVALID_DATE = {
  year: NaN,
  month: NaN,
  day: NaN,
  hour: NaN,
  minute: NaN,
  second: NaN,
  millisecond: NaN,
  offsetMillisec: NaN,
} as const;

export function isLeapYear(year: number): boolean {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

export function daysInYear(year: number): number {
  return isLeapYear(year) ? 366 : 365;
}

export function daysInMonth(year: number, month: number): number {
  const modMonth = floorMod(month - 1, 12) + 1,
    modYear = year + (month - modMonth) / 12;
  if (modMonth === 2) {
    return isLeapYear(modYear) ? 29 : 28;
  } else {
    return [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][modMonth - 1];
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

function isValidMonth(month: number): boolean {
  return isBetween(month, 1, 12);
}

function isValidDay(day: number, year: number, month: number): boolean {
  return isBetween(day, 1, daysInMonth(year, month));
}

function isValidHour(hour: number): boolean {
  return isBetween(hour, 1, 23);
}

function isValidMinute(minute: number): boolean {
  return isBetween(minute, 0, 59);
}

function isValidSec(sec: number): boolean {
  return isBetween(sec, 0, 59);
}

function isValidMillisec(millisecond: number): boolean {
  return isBetween(millisecond, 0, 999);
}

export function isValidDate(dateObj: Partial<DateObj>): boolean {
  const { year, month, day, hour, minute, second, millisecond } = dateObj;

  if (!year || isNaN(year)) return false;

  if (month && !isValidMonth(month)) return false;

  if (month && day) {
    if (!isValidDay(day, year, month)) return false;
  }

  if (hour) {
    const isValid = isValidHour(hour) ||
      (hour === 24 && minute === 0 && second === 0 && millisecond === 0);
    if (!isValid) return false;
  }

  if (minute) {
    if (!isValidMinute(minute)) return false;
  }

  if (second) {
    if (!isValidSec(second)) return false;
  }

  if (millisecond) {
    if (!isValidMillisec(millisecond)) return false;
  }

  return true;
}

export function isValidOrdinalDate(year: number, ordinal: number): boolean {
  const days = daysInYear(year);

  return isBetween(ordinal, 1, days);
}

export function parseInteger(value: string | undefined): number | undefined {
  if (!value) return undefined;

  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) return undefined;

  return parsed;
}

export function formatToTwoDigits(n: number): string {
  return n <= 9 ? `0${n}` : n.toString();
}

export function formatToThreeDigits(n: number): string {
  if (n <= 9) return `00${n}`;
  if (n <= 99) return `0${n}`;
  return n.toString();
}

export function weeksOfYear(year: number): number {
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

export function truncNumber(n?: number): number {
  if (!n || isNaN(n)) {
    return 0;
  }
  return Math.trunc(n);
}

export function floorMod(x: number, n: number) {
  return x - n * Math.floor(x / n);
}

export function millisecToMin(millisec: number): number {
  return millisec / MILLISECONDS_IN_MINUTE;
}

export function minToMillisec(min: number) {
  return min * MILLISECONDS_IN_MINUTE;
}
