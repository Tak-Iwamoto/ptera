import { DateInfo } from "./types.ts";

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

export function isValidMonth(month: number): boolean {
  return isBetween(month, 1, 12);
}

export function isValidDay(day: number, year: number, month: number): boolean {
  return isBetween(day, 1, daysInMonth(year, month));
}

export function isValidHour(hours: number): boolean {
  return isBetween(hours, 1, 23);
}

export function isValidMinutes(minutes: number): boolean {
  return isBetween(minutes, 0, 59);
}

export function isValidSec(sec: number): boolean {
  return isBetween(sec, 0, 59);
}

export function isValidMillisec(milliseconds: number): boolean {
  return isBetween(milliseconds, 0, 999);
}

export function isValidDate(dateInfo: DateInfo): boolean {
  const { year, month, day, hours, minutes, seconds, milliseconds } = dateInfo;

  if (!isValidMonth(month)) return false;

  if (day) {
    if (!isValidDay(day, year, month)) return false;
  }

  if (hours) {
    const isValid = isValidHour(hours) ||
      (hours === 24 && minutes === 0 && seconds === 0 && milliseconds === 0);
    if (!isValid) return false;
  }

  if (minutes) {
    if (!isValidMinutes(minutes)) return false;
  }

  if (seconds) {
    if (!isValidSec(seconds)) return false;
  }

  if (milliseconds) {
    if (!isValidMillisec(milliseconds)) return false;
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
