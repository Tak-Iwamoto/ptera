import { MILLISECONDS_IN_DAY } from "./constants.ts";

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

function formatToTwoDigits(n: number): string {
  return n <= 9 ? `0${n}` : n.toString();
}

export function format(date: Date, formatStr: DateFormatType): string {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hours = date.getUTCHours();
  const twelveHours = date.getUTCHours() % 12;
  const minutes = date.getUTCMinutes();
  const weekNumber = date.getUTCDay();

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
      return day.toString();
    case "dd":
      return formatToTwoDigits(day);
    case "D":
      return utcDayOfYear(date).toString();
    case "DD":
      const dayOfYear = utcDayOfYear(date);
      return formatToTwoDigits(dayOfYear);
    case "H":
      return hours.toString();
    case "HH":
      return formatToTwoDigits(hours);
    case "h":
      return (twelveHours || 12).toString();
    case "hh":
      return formatToTwoDigits(twelveHours || 12).toString();
    case "m":
      return minutes.toString();
    case "mm":
      return formatToTwoDigits(minutes).toString();
    case "WWW":
      return weekdays[weekNumber].slice(0, 3);
    case "WWWW":
      return weekdays[weekNumber];
    case "a":
      return hours / 12 <= 1 ? "AM" : "PM";
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

export function formatDate(date: Date, formatStr: string) {
  const parsedFormat = parseFormat(formatStr);
  let result = "";

  for (const f of parsedFormat) {
    if (f.isLiteral) {
      result += f.value;
    } else if (isFormatDateType(f.value)) {
      result += format(date, f.value);
    } else {
      result += f.value;
    }
  }
  return result;
}

function utcDayOfYear(date: Date): number {
  const timestamp = date.getTime();

  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);

  const startOfYearTimestamp = date.getTime();
  const diff = timestamp - startOfYearTimestamp;
  return Math.floor(diff / MILLISECONDS_IN_DAY) + 1;
}
