import { dayOfYearToDate } from "./convert.ts";
import { Locale } from "./locale.ts";
import {
  DateFormatType,
  DateInfo,
  isFormatDateType,
  TIMEZONE,
  Timezone,
} from "./types.ts";
import {
  INVALID_DATE,
  isValidDate,
  minToMillisec,
  parseInteger,
} from "./utils.ts";

const formatsRegex =
  /([-:/.()\s\_]+)|(YYYY|YY|MMMM|MMM|MM|M|dd?|DDD|D|HH?|hh?|mm?|ss?|S{1,3}|wwww|www|w|WW?|ZZ?|z|a)/g;

const oneDigitRegex = /\d/;
const fourDigitsRegex = /\d\d\d\d/;
const oneToTwoDigitRegex = /\d\d?/;
const oneToThreeDigitRegex = /\d{1,3}/;
const offsetRegex = /[+-]\d\d:?(\d\d)?|Z/;
const literalRegex = /\d*[^\s\d-_:/()]+/;

function arrayToRegex(array: string[]) {
  return new RegExp(array.join("|"), "g");
}

function formatToRegexAndProperty(
  formatStr: DateFormatType,
  locale: Locale,
): [RegExp, string, number | null] {
  switch (formatStr) {
    case "YY":
    case "YYYY":
      return [fourDigitsRegex, "year", 4];
    case "M":
    case "MM":
      return [oneToTwoDigitRegex, "month", 2];
    case "MMM":
      return [arrayToRegex(locale.monthList("short")), "shortMonthStr", null];
    case "MMMM":
      return [arrayToRegex(locale.monthList("long")), "monthStr", null];
    case "d":
    case "dd":
      return [oneToTwoDigitRegex, "day", 2];
    case "D":
    case "DDD":
      return [oneToThreeDigitRegex, "dayOfYear", 3];
    case "H":
    case "HH":
    case "h":
    case "hh":
      return [oneToTwoDigitRegex, "hours", 2];
    case "m":
    case "mm":
      return [oneToTwoDigitRegex, "minutes", 2];
    case "s":
    case "ss":
      return [oneToTwoDigitRegex, "seconds", 2];
    case "S":
      return [oneToThreeDigitRegex, "milliseconds", 3];
    case "w":
      return [oneDigitRegex, "weekNumber", 1];
    case "www":
      return [arrayToRegex(locale.weekList("short")), "week", null];
    case "wwww":
      return [arrayToRegex(locale.weekList("long")), "week", null];
    case "W":
    case "WW":
      return [oneToTwoDigitRegex, "isoweek", 2];
    case "a":
      return [literalRegex, "AMPM", 2];
    case "z":
      return [arrayToRegex(TIMEZONE), "timezone", null];
    case "Z":
    case "ZZ":
      return [offsetRegex, "offset", 6];
    default:
      throw new TypeError("Please input valid format.");
  }
}

export function parseDateStr(
  dateStr: string,
  format: string,
  option?: { locale: string },
) {
  const locale = new Locale(option?.locale ?? "en");
  const hash = dateStrToHash(dateStr, format, locale);
  return hashToDate(hash, locale);
}

function dateStrToHash(
  dateStr: string,
  formatStr: string,
  locale: Locale,
): { [key: string]: string } {
  const parsedFormat = formatStr.match(formatsRegex);
  let cursor = 0;
  const hash: { [key: string]: string } = {};
  if (parsedFormat) {
    for (const f of parsedFormat) {
      if (isFormatDateType(f)) {
        const [regex, property, formatCursor] = formatToRegexAndProperty(
          f,
          locale,
        );
        const targetStr = formatCursor
          ? dateStr.substr(cursor, formatCursor)
          : dateStr.substr(cursor);
        const parts = targetStr.match(regex);
        if (parts) {
          cursor += parts[0].length;
          hash[property] = parts[0];
        } else {
          return {};
        }
      } else {
        cursor += f.length;
      }
    }
  }
  return hash;
}

function hashToDate(
  hash: { [key: string]: string },
  locale: Locale,
): DateInfo & { offsetMillisec: number; timezone?: Timezone } {
  const year = parseInteger(hash["year"]);
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

  let month = undefined;
  if (hash["monthStr"]) {
    month = months[locale.monthList("long").indexOf(hash["monthStr"])];
  }

  if (hash["shortMonthStr"]) {
    month = months[locale.monthList("short").indexOf(hash["shortMonthStr"])];
  }

  if (hash["month"]) {
    month = parseInteger((hash["month"]));
  }

  let day = parseInteger((hash["day"]));

  if (hash["dayOfYear"]) {
    const dayOfYear = parseInteger(hash["dayOfYear"]);
    const date = dayOfYear && year
      ? dayOfYearToDate(dayOfYear, year)
      : undefined;
    month = date?.month;
    day = date?.day;
  }

  const hours = parseInteger((hash["hours"]));
  const minutes = parseInteger((hash["minutes"]));
  const seconds = parseInteger((hash["seconds"]));
  const milliseconds = parseInteger((hash["milliseconds"]));

  if (
    !isValidDate({ year, month, day, hours, minutes, seconds, milliseconds })
  ) {
    return INVALID_DATE;
  }
  const offsetMillisec = hash["offset"]
    ? parseOffsetMillisec(hash["offset"])
    : null;
  const timezone = hash["timezone"];
  const isPM = hash["AMPM"] === "PM";

  return {
    year: year as number,
    month: month ?? 0,
    day: day ?? 0,
    hours: normalizeHours(hours ?? 0, isPM),
    minutes: minutes ?? 0,
    seconds: seconds ?? 0,
    milliseconds: milliseconds ?? 0,
    offsetMillisec: offsetMillisec ?? 0,
    timezone: timezone,
  };
}

function normalizeHours(hours: number, isPM: boolean) {
  if (isPM) {
    if (hours < 12) {
      return hours + 12;
    }
    if (hours === 12) {
      return 0;
    }
  }
  return hours;
}

function parseOffsetMillisec(offsetStr: string): number {
  if (offsetStr === "Z") return 0;
  const parts = offsetStr.match(/([-+]|\d\d)/g);
  if (!parts) return 0;

  const hours = parseInteger(parts[1]) ?? 0;
  const minutes = parseInteger(parts[2]) ?? 0;
  const result = minToMillisec(hours * 60 + minutes);
  if (parts[0] === "-") return result * (-1);
  return result;
}
