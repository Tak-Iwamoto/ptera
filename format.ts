import { MILLISECONDS_IN_HOUR, MILLISECONDS_IN_MINUTE } from "./constants.ts";
import { DateInfo, OptionalNumber } from "./types.ts";
import {
  dayOfWeek,
  dayOfYear,
  formatToThreeDigits,
  formatToTwoDigits,
  isValidHour,
  isValidMillisec,
  isValidMinutes,
  isValidMonth,
  isValidOrdinalDate,
  isValidSec,
  ordinalToDateInfo,
  parseInteger,
  weeksOfYear,
} from "./utils.ts";

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
  "DDD",
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
  "w",
  "www",
  "wwww",
  "W",
  "WW",
  "a",
] as const;

type DateFormatType = typeof dateFormatType[number];

const shortMonths = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

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
];

const shortWeekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export function formatDateInfo(
  dateInfo: DateInfo,
  formatStr: DateFormatType,
): string {
  const { year, month, day, hours, minutes, seconds, milliseconds } = dateInfo;
  const twelveHours = (hours || 0) % 12;

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
      return dayOfYear(dateInfo).toString();
    case "DDD":
      return formatToThreeDigits(dayOfYear(dateInfo));
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
    case "w":
      return dayOfWeek(dateInfo).toString();
    case "www":
      return weekdays[dayOfWeek(dateInfo) - 1].slice(0, 3);
    case "wwww":
      return weekdays[dayOfWeek(dateInfo) - 1];
    case "W":
      return isoWeekNumber(dateInfo).toString();
    case "WW":
      return formatToTwoDigits(isoWeekNumber(dateInfo));
    case "a":
      return (hours || 0) / 12 <= 1 ? "AM" : "PM";
    default:
      throw new TypeError("Please input valid format.");
  }
}

function parseFormat(
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
      result += formatDateInfo(dateInfo, f.value);
    } else {
      result += f.value;
    }
  }
  return result;
}

function isoWeekNumber(dateInfo: DateInfo) {
  const ordinalDate = dayOfYear(dateInfo);
  const weekIndex = dayOfWeek(dateInfo);

  const weekNumber = Math.floor((ordinalDate - weekIndex + 10) / 7);

  if (weekNumber < 1) return weeksOfYear(dateInfo.year - 1);
  if (weekNumber > weeksOfYear(dateInfo.year)) return 1;

  return weekNumber;
}

const isoOrdinalDateRegex = /(\d{4})-(\d{3})/;
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

export function isoOrdinalToDateInfo(isoFormat: string): DateInfo | undefined {
  const matches = isoOrdinalDateRegex.exec(isoFormat);
  const year = parseInteger(matches?.[1]);
  const ordinalDate = parseInteger(matches?.[2]);
  if (!year) return undefined;
  if (!ordinalDate) return undefined;
  if (!isValidOrdinalDate(year, ordinalDate)) return undefined;
  return ordinalToDateInfo(year, ordinalDate);
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
  const fromISOOrdinal = isoOrdinalToDateInfo(isoFormat);
  if (fromISOOrdinal) return fromISOOrdinal;

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

export function parseFromFormat(dateStr: string, format: string) {
  const parsedFormat = parseFormat(format);

  let cursor = 0;
  let currentValue = "";
  const result: { [key: string]: string } = {};

  for (const f of parsedFormat) {
    if (isFormatDateType(f.value)) {
      result[formatTypeName(f.value)] = dateStr.slice(
        cursor,
        cursor + f.value.length,
      );
    }

    cursor += f.value.length;
  }
  return result;
}

function isFinishedFormat(value: string, format: string) {
  switch (format) {
    case "YY":
    case "YYYY":
    case "M":
    case "MM":
    case "d":
    case "dd":
    case "H":
    case "HH":
    case "h":
    case "hh":
    case "m":
    case "mm":
    case "s":
    case "ss":
      return value.length === format.length;
    case "MMM":
      return shortMonths.includes(value);
    case "MMMM":
      return months.includes(value);
    case "D":
    case "DDD":
      return "dayOfYear";
    case "S":
      return value.length === 3;
    case "w":
      return "weekNumber";
    case "www":
      return "shortWeekdays";
    case "wwww":
      return "weekdays";
    case "W":
    case "WW":
      return "isoWeekNumber";
    case "a":
      ["AM", "PM"].includes(value);
    default:
      return format;
  }
}

function formatTypeName(format: string) {
  switch (format) {
    case "YY":
    case "YYYY":
      return "year";
    case "M":
    case "MM":
      return "month";
    case "MMM":
    case "MMMM":
      return "monthString";
    case "d":
    case "dd":
      return "day";
    case "D":
    case "DDD":
      return "dayOfYear";
    case "H":
    case "HH":
      return "hour";
    case "h":
    case "hh":
      return "twelveHour";
    case "m":
    case "mm":
      return "minute";
    case "s":
    case "ss":
      return "second";
    case "S":
      return "millisecond";
    case "w":
      return "weekNumber";
    case "www":
      return "shortWeekdays";
    case "wwww":
      return "weekdays";
    case "W":
    case "WW":
      return "isoWeekNumber";
    case "a":
      return "AMPM";
    default:
      return format;
  }
}

function parseStringByFormat(value: string, format: DateFormatType) {
  const parsedAsInt = parseInteger(value);
  switch (format) {
    case "YY":
    case "YYYY":
      return parseInteger(value);
    case "M":
    case "MM":
      if (!parsedAsInt || !isValidMonth(parsedAsInt)) return undefined;
      return parsedAsInt;
    case "MMM":
      if (!shortMonths.includes(value)) return undefined;
      return value;
    case "MMMM":
      if (!months.includes(value)) return undefined;
      return value;
    case "d":
    case "dd":
      if (!parsedAsInt || parsedAsInt < 1 || parsedAsInt > 31) return undefined;
      return parsedAsInt;
    case "D":
    case "DDD":
      if (!parsedAsInt || parsedAsInt < 1 || parsedAsInt > 366) {
        return undefined;
      }
      return parsedAsInt;
    case "H":
    case "HH":
      if (!parsedAsInt || isValidHour(parsedAsInt)) return undefined;
      return parsedAsInt;
    case "h":
    case "hh":
      if (!parsedAsInt || isValidHour(parsedAsInt)) return undefined;
      return (parsedAsInt % 12);
    case "m":
    case "mm":
      if (!parsedAsInt || isValidMinutes(parsedAsInt)) return undefined;
      return parsedAsInt;
    case "s":
    case "ss":
      if (!parsedAsInt || isValidSec(parsedAsInt)) return undefined;
      return parsedAsInt;
    case "S":
      if (!parsedAsInt || isValidMillisec(parsedAsInt)) return undefined;
      return parsedAsInt;
    case "w":
      if (!parsedAsInt || parsedAsInt < 1 || parsedAsInt > 7) return undefined;
      return parsedAsInt;
    case "www":
      if (!shortWeekdays.includes(value)) return undefined;
      return value;
    case "wwww":
      if (!weekdays.includes(value)) return undefined;
      return value;
    case "W":
    case "WW":
      if (!parsedAsInt || parsedAsInt < 1 || parsedAsInt > 53) return undefined;
      return parsedAsInt;
    case "a":
      if (value === "AM" || value === "PM") return value;
      return undefined;
    default:
      throw new TypeError("Please input valid format.");
  }
}

console.log(parseFromFormat("January-2021-04-22", "MMMM-YYYY-MM-dd"));
