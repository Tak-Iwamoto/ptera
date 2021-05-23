import { DateInfo, OptionalNumber } from "./types.ts";

type DateTimeArg = DateInfo | string;

function isDateInfo(arg: DateTimeArg): arg is DateInfo {
  return (arg as DateInfo).year !== undefined;
}

export function toDateInfo(date: DateInfo | string) {
  if (isDateInfo(date)) {
    return date;
  } else {
    const d = new Date(date);
    return jsDateToDateInfo(d);
  }
}

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
  return [year, month - 1, day, hours, minutes, seconds, milliseconds];
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
