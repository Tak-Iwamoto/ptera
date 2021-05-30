import {
  MILLISECONDS_IN_DAY,
  MILLISECONDS_IN_HOUR,
  MILLISECONDS_IN_MINUTE,
} from "./constants.ts";
import { DateInfo, OptionalNumber } from "./types.ts";
import { dateInfoToJSDate, formatToTwoDigits, parseInteger } from "./utils.ts";

const dateFormatType = [
  "YY",
  "YYYY",
  "M",
  "MM",
  "MMM",
  "MMMM",
  "d",
  "dd",
  "D",
  "DD",
  "H",
  "HH",
  "h",
  "hh",
  "m",
  "mm",
  "s",
  "ss",
  "S",
  "SSS",
  "WWW",
  "WWWW",
  "a",
] as const;

type DateFormatType = typeof dateFormatType[number];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export function format(dateInfo: DateInfo, formatStr: DateFormatType): string {
  const { year, month, day, hours, minutes, seconds, milliseconds } = dateInfo;
  const twelveHours = (hours || 0) % 12;

  const jsDate = dateInfoToJSDate(dateInfo);
  const weekNumber = jsDate.getUTCDay();

  switch (formatStr) {
    case "YY":
      return year.toString().slice(-2);
    case "YYYY":
      return year.toString();
    case "M":
      return month.toString();
    case "MM":
      return month <= 9 ? `0${month}` : month.toString();
    case "MMM":
      return months[month - 1].slice(0, 3);
    case "MMMM":
      return months[month - 1];
    case "d":
      return day ? day.toString() : "0";
    case "dd":
      return day ? formatToTwoDigits(day) : "00";
    case "D":
      return utcDayOfYear(jsDate).toString();
    case "DD":
      return formatToTwoDigits(utcDayOfYear(jsDate));
    case "H":
      return String(hours);
    case "HH":
      return hours ? formatToTwoDigits(hours) : "00";
    case "h":
      return (twelveHours || 12).toString();
    case "hh":
      return formatToTwoDigits(twelveHours || 12).toString();
    case "m":
      return minutes ? minutes.toString() : "0";
    case "mm":
      return minutes ? formatToTwoDigits(minutes).toString() : "00";
    case "s":
      return seconds ? seconds.toString() : "0";
    case "ss":
      return seconds ? formatToTwoDigits(seconds).toString() : "00";
    case "S":
      return milliseconds
        ? milliseconds <= 99 ? "0${milliseconds}" : milliseconds.toString()
        : "000";
    case "WWW":
      return weekdays[weekNumber].slice(0, 3);
    case "WWWW":
      return weekdays[weekNumber];
    case "a":
      return (hours || 0) / 12 <= 1 ? "AM" : "PM";
    default:
      throw new TypeError("Please input valid format.");
  }
}

export function parseFormat(
  format: string,
): { value: string; isLiteral: boolean }[] {
  const result = [];

  let currentValue = "";
  let previousChar = null;
  let isLiteral = false;

  for (const char of format) {
    if (char === "'") {
      if (currentValue !== "") {
        result.push({ value: currentValue, isLiteral: isLiteral });
      }
      currentValue = "";
      previousChar = null;
      isLiteral = !isLiteral;
    } else if (isLiteral) {
      currentValue += char;
    } else if (char === previousChar) {
      currentValue += char;
    } else {
      if (currentValue !== "") {
        result.push({ value: currentValue, isLiteral: isLiteral });
      }
      currentValue = char;
      previousChar = char;
    }
  }

  if (currentValue !== "") {
    result.push({ value: currentValue, isLiteral: isLiteral });
  }

  return result;
}

function isFormatDateType(format: string): format is DateFormatType {
  return dateFormatType.includes(format as DateFormatType);
}

export function formatDate(dateInfo: DateInfo, formatStr: string) {
  const parsedFormat = parseFormat(formatStr);
  let result = "";

  for (const f of parsedFormat) {
    if (f.isLiteral) {
      result += f.value;
    } else if (isFormatDateType(f.value)) {
      result += format(dateInfo, f.value);
    } else {
      result += f.value;
    }
  }
  return result;
}

function utcDayOfYear(date: Date): number {
  const utc = date.getTime();

  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);

  const startOfYear = date.getTime();
  const diff = utc - startOfYear;
  return Math.floor(diff / MILLISECONDS_IN_DAY) + 1;
}

// const isoOrdinalDateRegex = /(\d{4})-(\d{3})/;
// const isoWeekRegex = /(\d{4})-W(\d{2})/;
// const weekDayRegex = /[1-7]/;
const isoDateRegex = /(\d{4})-?(\d{2})-?(\d{2})/;
const isoTimeRegex = /(\d{2}):?(\d{2}):?(\d{2})(?:.)?(\d{3})?/;
// const isoOffsetRegex = /(?:(Z)|([+-]\d\d)(?::?(\d\d))?)?/
const isoOffsetRegex = /(Z)|([+-]\d{2})(?::?(\d{2}))/;

function extractIsoDate(
  isoFormat: string,
): { year: number; month: number; day: OptionalNumber } | undefined {
  const matches = isoDateRegex.exec(isoFormat);
  const year = parseInteger(matches?.[1]);
  const month = parseInteger(matches?.[2]);
  if (!year) return undefined;
  if (!month) return undefined;
  return { year, month, day: parseInteger(matches?.[3]) };
}

function extractIsoTime(
  isoFormat: string,
): {
  hours: OptionalNumber;
  minutes: OptionalNumber;
  seconds: OptionalNumber;
  milliseconds: OptionalNumber;
} {
  const matches = isoTimeRegex.exec(isoFormat);
  const hours = parseInteger(matches?.[1]);
  const minutes = parseInteger(matches?.[2]);
  const seconds = parseInteger(matches?.[3]);
  const milliseconds = parseInteger(matches?.[4]);
  return { hours, minutes, seconds, milliseconds };
}

export function extractIsoOffset(isoFormat: string): number {
  const matches = isoOffsetRegex.exec(isoFormat);
  const isUTC = matches?.[1] === "Z";
  const offsetHours = parseInteger(matches?.[2]) ?? 0;
  const offsetMinutes = parseInteger(matches?.[3]) ?? 0;
  return isUTC ? 0 : toMillisecondsOffset(offsetHours, offsetMinutes);
}

function toMillisecondsOffset(
  offsetHours: number,
  offsetMinutes: number,
): number {
  const isNegative = offsetHours < 0;
  const offset = Math.abs(offsetHours) * MILLISECONDS_IN_HOUR +
    offsetMinutes * MILLISECONDS_IN_MINUTE;
  return isNegative ? -offset : offset;
}

export function isoToDateInfo(isoFormat: string): DateInfo | undefined {
  const isoDate = extractIsoDate(isoFormat);
  const isoTime = extractIsoTime(isoFormat);

  if (!isoDate) return undefined;
  return {
    year: isoDate.year,
    month: isoDate.month,
    day: isoDate.day,
    hours: isoTime.hours,
    minutes: isoTime.minutes,
    seconds: isoTime.seconds,
    milliseconds: isoTime.milliseconds,
  };
}

// console.log(extractIsoDate('2017-04-20T11:32:59.999-04:00'))
// console.log(extractIsoTime('2017-04-20T11:32:59.999-04:00'))
// console.log(extractIsoOffset('2017-04-20T11:32:00.000-04:00'))
// console.log(extractIsoOffset('2017-04-20T11:32:00.000Z'))
// console.log(extractIsoOffset('2017-04-20T11:32:00.000+09:00'))
