import { DateFormatType, DateInfo, isFormatDateType, Option } from "./types.ts";
import { Locale } from "./locale.ts";
import { MILLISECONDS_IN_HOUR, MILLISECONDS_IN_MINUTE } from "./constants.ts";
import {
  formatToThreeDigits,
  formatToTwoDigits,
  isValidOrdinalDate,
  millisecToMin,
  parseInteger,
  weeksOfYear,
} from "./utils.ts";
import {
  dateToDayOfYear,
  dateToTS,
  dateToWeekNumber,
  ordinalToDate,
} from "./convert.ts";

export function formatDateInfo(
  dateInfo: DateInfo,
  formatStr: DateFormatType,
  option?: Option,
): string {
  const { year, month, day, hours, minutes, seconds, milliseconds } = dateInfo;
  const twelveHours = (hours || 0) % 12;

  const locale = new Locale(option?.locale ?? "en");
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
      return locale.monthList("short")[month - 1];
    case "MMMM":
      return locale.monthList("long")[month - 1];
    case "d":
      return day ? day.toString() : "0";
    case "dd":
      return day ? formatToTwoDigits(day) : "00";
    case "D":
      return dateToDayOfYear(dateInfo).toString();
    case "DDD":
      return formatToThreeDigits(dateToDayOfYear(dateInfo));
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
      return dateToWeekNumber(dateInfo).toString();
    case "www":
      return locale.weekList("short")[dateToWeekNumber(dateInfo) - 1];
    case "wwww":
      return locale.weekList("long")[dateToWeekNumber(dateInfo) - 1];
    case "W":
      return isoWeekNumber(dateInfo).toString();
    case "WW":
      return formatToTwoDigits(isoWeekNumber(dateInfo));
    case "a":
      return (hours || 0) / 12 <= 1 ? "AM" : "PM";
    case "X":
      return (dateToTS(dateInfo) / 1000).toString();
    case "x":
      return dateToTS(dateInfo).toString();
    case "z":
      return option?.timezone ?? "";
    case "Z":
      return option?.offsetMillisec
        ? formatOffsetMillisec(option.offsetMillisec, "Z")
        : "";
    case "ZZ":
      return option?.offsetMillisec
        ? formatOffsetMillisec(option.offsetMillisec, "ZZ")
        : "";
    case "ZZZ":
      return locale.offsetName(
        new Date(dateToTS(dateInfo)),
        "short",
        option?.timezone,
      ) ?? "";
    case "ZZZZ":
      return locale.offsetName(
        new Date(dateToTS(dateInfo)),
        "long",
        option?.timezone,
      ) ?? "";
    default:
      throw new TypeError("Please input valid format.");
  }
}

function formatOffsetMillisec(offsetMillisec: number, format: "Z" | "ZZ") {
  const offsetMin = millisecToMin(offsetMillisec);
  const hour = Math.floor(Math.abs(offsetMin) / 60);
  const min = Math.abs(offsetMin) % 60;
  const sign = offsetMin >= 0 ? "+" : "-";

  switch (format) {
    case "Z":
      return `${sign}${formatToTwoDigits(hour)}:${formatToTwoDigits(min)}`;
    case "ZZ":
      return `${sign}${formatToTwoDigits(hour)}${formatToTwoDigits(min)}`;
    default:
      throw new TypeError("Please input valid offset format.");
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

export function formatDate(
  dateInfo: DateInfo,
  formatStr: string,
  option?: Option,
) {
  const parsedFormat = parseFormat(formatStr);
  let result = "";

  for (const f of parsedFormat) {
    if (f.isLiteral) {
      result += f.value;
    } else if (isFormatDateType(f.value)) {
      result += formatDateInfo(dateInfo, f.value, option);
    } else {
      result += f.value;
    }
  }
  return result;
}

function isoWeekNumber(dateInfo: DateInfo) {
  const ordinalDate = dateToDayOfYear(dateInfo);
  const weekIndex = dateToWeekNumber(dateInfo);

  const weekNumber = Math.floor((ordinalDate - weekIndex + 10) / 7);

  if (weekNumber < 1) return weeksOfYear(dateInfo.year - 1);
  if (weekNumber > weeksOfYear(dateInfo.year)) return 1;

  return weekNumber;
}

const isoOrdinalDateRegex = /(\d{4})-(\d{3})/;
const isoDateRegex = /(\d{4})-?(\d{2})-?(\d{2})/;
const isoTimeRegex = /(\d{2}):?(\d{2}):?(\d{2})(?:.)?(\d{3})?/;
const isoOffsetRegex = /(Z)|([+-]\d{2})(?::?(\d{2})?)/;

function extractIsoDate(
  isoFormat: string,
): { year: number; month: number; day?: number } | undefined {
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
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
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

function isoOrdinalToDateInfo(isoFormat: string): DateInfo | undefined {
  const matches = isoOrdinalDateRegex.exec(isoFormat);
  const year = parseInteger(matches?.[1]);
  const ordinalDate = parseInteger(matches?.[2]);
  if (!year) return undefined;
  if (!ordinalDate) return undefined;
  if (!isValidOrdinalDate(year, ordinalDate)) return undefined;
  return ordinalToDate(year, ordinalDate);
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
    day: isoDate.day ?? 1,
    hours: isoTime.hours ?? 0,
    minutes: isoTime.minutes ?? 0,
    seconds: isoTime.seconds ?? 0,
    milliseconds: isoTime.milliseconds ?? 0,
  };
}
