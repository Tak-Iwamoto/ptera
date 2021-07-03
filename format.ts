import { DateFormatType, DateInfo, isFormatDateType, Option } from "./types.ts";
import { Locale } from "./locale.ts";
import {
  formatToThreeDigits,
  formatToTwoDigits,
  millisecToMin,
  weeksOfYear,
} from "./utils.ts";
import { dateToDayOfYear, dateToTS, dateToWeekDay } from "./convert.ts";

export function formatDateInfo(
  dateInfo: DateInfo,
  formatStr: DateFormatType,
  option?: Option,
): string {
  const { year, month, day, hour, minute, second, millisecond } = dateInfo;
  const twelveHours = (hour || 0) % 12;

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
      return String(hour);
    case "HH":
      return hour ? formatToTwoDigits(hour) : "00";
    case "h":
      return (twelveHours || 12).toString();
    case "hh":
      return formatToTwoDigits(twelveHours || 12).toString();
    case "m":
      return minute ? minute.toString() : "0";
    case "mm":
      return minute ? formatToTwoDigits(minute).toString() : "00";
    case "s":
      return second ? second.toString() : "0";
    case "ss":
      return second ? formatToTwoDigits(second).toString() : "00";
    case "S":
      return millisecond
        ? millisecond <= 99 ? "0${millisecond}" : millisecond.toString()
        : "000";
    case "w":
      return dateToWeekDay(dateInfo).toString();
    case "www":
      return locale.weekList("short")[dateToWeekDay(dateInfo) - 1];
    case "wwww":
      return locale.weekList("long")[dateToWeekDay(dateInfo) - 1];
    case "W":
      return isoWeekNumber(dateInfo).toString();
    case "WW":
      return formatToTwoDigits(isoWeekNumber(dateInfo));
    case "a":
      return (hour || 0) / 12 <= 1 ? "AM" : "PM";
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
  const weekIndex = dateToWeekDay(dateInfo);

  const weekNumber = Math.floor((ordinalDate - weekIndex + 10) / 7);

  if (weekNumber < 1) return weeksOfYear(dateInfo.year - 1);
  if (weekNumber > weeksOfYear(dateInfo.year)) return 1;

  return weekNumber;
}
