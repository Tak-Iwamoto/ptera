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
