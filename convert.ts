import { MILLISECONDS_IN_DAY } from "./constants.ts";
import { adjustedTS } from "./diff.ts";
import { DateObj } from "./types.ts";
import { isLeapYear } from "./utils.ts";

export function dateToArray(
  dateObj: DateObj,
  option?: { jsMonth: boolean },
): [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
] {
  const { year, month, day, hour, minute, second, millisecond } = dateObj;
  return [
    year,
    option?.jsMonth ? month - 1 : month,
    day ?? 0,
    hour ?? 0,
    minute ?? 0,
    second ?? 0,
    millisecond ?? 0,
  ];
}

export function dateToTS(dateObj: DateObj): number {
  return Date.UTC(...dateToArray(dateObj, { jsMonth: true }));
}

export function dateToJSDate(
  date: DateObj,
): Date {
  return new Date(dateToTS(date));
}

export function jsDateToDate(jsDate: Date): DateObj {
  return {
    year: jsDate.getUTCFullYear(),
    month: jsDate.getUTCMonth() + 1,
    day: jsDate.getUTCDate(),
    hour: jsDate.getUTCHours(),
    minute: jsDate.getUTCMinutes(),
    second: jsDate.getUTCSeconds(),
    millisecond: jsDate.getUTCMilliseconds(),
  };
}

export function arrayToDate(dateArray: number[]): DateObj {
  const result = [NaN, 1, 1, 0, 0, 0, 0];
  for (const [i, v] of dateArray.entries()) {
    result[i] = v;
  }
  const year = result[0];
  const month = result[1];
  const day = result[2];
  const hour = result[3];
  const minute = result[4];
  const second = result[5];
  const millisecond = result[6];
  return { year, month, day, hour, minute, second, millisecond };
}

export function tsToDate(ts: number): DateObj {
  const date = new Date(ts);
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes(),
    second: date.getUTCSeconds(),
    millisecond: date.getUTCMilliseconds(),
  };
}

export function dayOfYearToDate(dayOfYear: number, year: number) {
  const ts = adjustedTS({
    year,
    month: 1,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  }, {
    day: dayOfYear - 1,
  }, { positive: true });
  return tsToDate(ts);
}

export function dateToWeekDay(dateObj: DateObj): number {
  const jsDate = dateToJSDate(dateObj);
  return jsDate.getUTCDay();
}

export function dateToDayOfYear(dateObj: DateObj): number {
  const jsDate = dateToJSDate(dateObj);
  const utc = jsDate.getTime();

  jsDate.setUTCMonth(0, 1);
  jsDate.setUTCHours(0, 0, 0, 0);
  const startOfYear = jsDate.getTime();

  const diff = utc - startOfYear;
  return Math.floor(diff / MILLISECONDS_IN_DAY) + 1;
}

export function ordinalToDate(year: number, ordinal: number): DateObj {
  const nonLeapFirstDayOfMonth = [
    0,
    31,
    59,
    90,
    120,
    151,
    181,
    212,
    243,
    273,
    304,
    334,
  ];

  const leapFirstDayOfMonth = [
    0,
    31,
    60,
    91,
    121,
    152,
    182,
    213,
    244,
    274,
    305,
    335,
  ];

  const table = isLeapYear(year) ? leapFirstDayOfMonth : nonLeapFirstDayOfMonth;
  const monthIndex = table.map((i) => i < ordinal).lastIndexOf(true);
  const day = ordinal - table[monthIndex];
  return {
    year,
    month: monthIndex + 1,
    day,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  };
}
