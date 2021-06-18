import {
  DateFormatType,
  isFormatDateType,
  longMonths,
  shortMonths,
} from "./constants.ts";
import { dayOfYearToDate } from "./convert.ts";
import { DateInfo } from "./types.ts";
import { parseInteger } from "./utils.ts";

const formatsRegex =
  /([-:/.()\s]+)|(YYYY|MMMM|MMM|MM|M|dd?|DDD|D|HH?|hh?|mm?|ss?|S{1,3}|wwww|www|w|WW?|ZZ?|a)/g;

const oneDigitRegex = /\d/;
const fourDigitsRegex = /\d\d\d\d/;
const oneToTwoDigitRegex = /\d\d?/;
const oneToThreeDigitRegex = /\d{1,3}/;
const offsetRegex = /[+-]\d\d:?(\d\d)?|Z/g;
const literalRegex = /\d*[^\s\d-_:/()]+/;
const monthRegex =
  /January|February|March|April|May|June|July|August|September|October|November|December/g;
const shortMonthRegex = /Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/g;
const shortWeekRegex = /Mon|Tue|Wed|Thu|Fri|Sat|Sun/g;
const weekRegex = /Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday/g;

function formatToRegexAndProperty(formatStr: DateFormatType): [RegExp, string] {
  switch (formatStr) {
    case "YY":
    case "YYYY":
      return [fourDigitsRegex, "year"];
    case "M":
    case "MM":
      return [oneToTwoDigitRegex, "month"];
    case "MMM":
      return [shortMonthRegex, "shortMonthStr"];
    case "MMMM":
      return [monthRegex, "monthStr"];
    case "d":
    case "dd":
      return [oneToTwoDigitRegex, "day"];
    case "D":
    case "DDD":
      return [oneToThreeDigitRegex, "dayOfYear"];
    case "H":
    case "HH":
    case "h":
    case "hh":
      return [oneToTwoDigitRegex, "hours"];
    case "m":
    case "mm":
      return [oneToTwoDigitRegex, "minutes"];
    case "s":
    case "ss":
      return [oneToTwoDigitRegex, "seconds"];
    case "S":
      return [oneToThreeDigitRegex, "milliseconds"];
    case "w":
      return [oneDigitRegex, "weekNumber"];
    case "www":
      return [shortWeekRegex, "week"];
    case "wwww":
      return [weekRegex, "week"];
    case "W":
    case "WW":
      return [oneToTwoDigitRegex, "isoweek"];
    case "a":
      return [literalRegex, "AMPM"];
    case "Z":
    case "ZZ":
      return [offsetRegex, "offset"];
    default:
      throw new TypeError("Please input valid format.");
  }
}

export function parseDateStr(dateStr: string, format: string) {
  const hash = dateStrToHash(dateStr, format);
  return hashToDate(hash);
}

function dateStrToHash(
  dateStr: string,
  formatStr: string,
): { [key: string]: string } {
  const parsedFormat = formatStr.match(formatsRegex);
  let cursor = 0;
  const hash: { [key: string]: string } = {};
  if (parsedFormat) {
    for (const f of parsedFormat) {
      if (isFormatDateType(f)) {
        const [regex, property] = formatToRegexAndProperty(f);
        const targetStr = dateStr.substr(cursor);
        const parts = targetStr.match(regex);
        if (parts) {
          cursor += parts[0].length;
          hash[property] = parts[0];
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
): Partial<DateInfo> & { offset?: number } {
  const year = parseInteger(hash["year"]);
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  let month = undefined;
  if (hash["monthStr"]) {
    month = months[longMonths.indexOf(hash["monthStr"])];
  }

  if (hash["shortMonthStr"]) {
    month = months[shortMonths.indexOf(hash["shortMonthStr"])];
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
  const offset = hash["offset"] ? parseOffset(hash["offset"]) : undefined;
  const isPM = hash["AMPM"] === "PM";

  return {
    year,
    month,
    day,
    hours: normalizeHours(hours, isPM),
    minutes,
    seconds,
    milliseconds,
    offset,
  };
}

function normalizeHours(hours: number | undefined, isPM: boolean) {
  if (!hours) return undefined;
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

function parseOffset(offsetStr: string): number {
  if (offsetStr === "Z") return 0;
  const parts = offsetStr.match(/([-+]|\d\d)/g);
  if (!parts) return 0;

  const hours = parseInteger(parts[1]) ?? 0;
  const minutes = parseInteger(parts[2]) ?? 0;
  const result = hours * 60 + minutes;
  if (parts[0] === "-") return result * (-1);
  return result;
}
