import { MILLISECONDS_IN_DAY } from "./constants.ts";
import { adjustedUnixTimeStamp } from "./diff.ts";
import { DateInfo } from "./types.ts";
import { isLeapYear } from "./utils.ts";

export function dateToArray(
  dateInfo: DateInfo,
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
  const { year, month, day, hour, minute, second, millisecond } = dateInfo;
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

export function dateToTS(dateInfo: DateInfo): number {
  return Date.UTC(...dateToArray(dateInfo, { jsMonth: true }));
}

export function dateToJSDate(
  date: DateInfo,
): Date {
  return new Date(dateToTS(date));
}

export function jsDateToDate(jsDate: Date): DateInfo {
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

export function arrayToDate(dateArray: number[]): DateInfo {
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

export function tsToDate(ts: number): DateInfo {
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
  const ts = adjustedUnixTimeStamp({
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

export function dateToWeekDay(dateInfo: DateInfo): number {
  const jsDate = dateToJSDate(dateInfo);
  const jsWeekDay = jsDate.getUTCDay();
  if (jsWeekDay === 0) return 7;
  return jsWeekDay;
}

export function dateToDayOfYear(dateInfo: DateInfo): number {
  const jsDate = dateToJSDate(dateInfo);
  const utc = jsDate.getTime();

  jsDate.setUTCMonth(0, 1);
  jsDate.setUTCHours(0, 0, 0, 0);
  const startOfYear = jsDate.getTime();

  const diff = utc - startOfYear;
  return Math.floor(diff / MILLISECONDS_IN_DAY) + 1;
}

export function ordinalToDate(year: number, ordinal: number): DateInfo {
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
