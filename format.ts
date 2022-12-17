import { DateFormatType, DateObj, isFormatDateType, Option } from "./types.ts";
import { Locale } from "./locale.ts";
import {
  formatToThreeDigits,
  formatToTwoDigits,
  millisecToMin,
  weeksOfYear,
} from "./utils.ts";
import { dateToDayOfYear, dateToTS, dateToWeekDay } from "./convert.ts";

export function formatDateObj(
  dateObj: DateObj,
  formatStr: DateFormatType,
  option?: Option,
): string {
  const { year, month, day, hour, minute, second, millisecond } = dateObj;
  const twelveHours = (hour || 0) % 12;

  const locale = new Locale(option?.locale ?? "en");
  switch (formatStr) {
    case "YY": {
      return year.toString().slice(-2);
    }
    case "YYYY": {
      return year.toString();
    }
    case "M": {
      return month.toString();
    }
    case "MM": {
      return month <= 9 ? `0${month}` : month.toString();
    }
    case "MMM": {
      return locale.monthList("short")[month - 1];
    }
    case "MMMM": {
      return locale.monthList("long")[month - 1];
    }
    case "d": {
      return day ? day.toString() : "0";
    }
    case "dd": {
      return day ? formatToTwoDigits(day) : "00";
    }
    case "D": {
      return dateToDayOfYear(dateObj).toString();
    }
    case "DDD": {
      return formatToThreeDigits(dateToDayOfYear(dateObj));
    }
    case "H": {
      return String(hour);
    }
    case "HH": {
      return hour ? formatToTwoDigits(hour) : "00";
    }
    case "h": {
      return (twelveHours || 12).toString();
    }
    case "hh": {
      return formatToTwoDigits(twelveHours || 12).toString();
    }
    case "m": {
      return minute ? minute.toString() : "0";
    }
    case "mm": {
      return minute ? formatToTwoDigits(minute).toString() : "00";
    }
    case "s": {
      return second ? second.toString() : "0";
    }
    case "ss": {
      return second ? formatToTwoDigits(second).toString() : "00";
    }
    case "S": {
      return millisecond
        ? millisecond <= 99 ? `0${millisecond}` : millisecond.toString()
        : "000";
    }
    case "w": {
      return dateToWeekDay(dateObj).toString();
    }
    case "www": {
      return locale.weekList("short")[dateToWeekDay(dateObj)];
    }
    case "wwww": {
      return locale.weekList("long")[dateToWeekDay(dateObj)];
    }
    case "W": {
      return isoWeekNumber(dateObj).toString();
    }
    case "WW": {
      return formatToTwoDigits(isoWeekNumber(dateObj));
    }
    case "a": {
      return (hour || 0) / 12 <= 1 ? "AM" : "PM";
    }
    case "X": {
      return (dateToTS(dateObj) / 1000).toString();
    }
    case "x": {
      return dateToTS(dateObj).toString();
    }
    case "z": {
      return option?.timezone ?? "";
    }
    case "Z": {
      return option?.offsetMillisec
        ? formatOffsetMillisec(option.offsetMillisec, "Z")
        : "";
    }
    case "ZZ": {
      return option?.offsetMillisec
        ? formatOffsetMillisec(option.offsetMillisec, "ZZ")
        : "";
    }
    case "ZZZ": {
      return locale.offsetName(
        new Date(dateToTS(dateObj)),
        "short",
        option?.timezone,
      ) ?? "";
    }
    case "ZZZZ": {
      return locale.offsetName(
        new Date(dateToTS(dateObj)),
        "long",
        option?.timezone,
      ) ?? "";
    }
    default: {
      throw new TypeError("Please input valid format.");
    }
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
  dateObj: DateObj,
  formatStr: string,
  option?: Option,
) {
  const parsedFormat = parseFormat(formatStr);
  let result = "";

  for (const f of parsedFormat) {
    if (f.isLiteral) {
      result += f.value;
    } else if (isFormatDateType(f.value)) {
      result += formatDateObj(dateObj, f.value, option);
    } else {
      result += f.value;
    }
  }
  return result;
}

function isoWeekNumber(dateObj: DateObj) {
  const ordinalDate = dateToDayOfYear(dateObj);
  const weekIndex = dateToWeekDay(dateObj);

  const weekNumber = Math.floor((ordinalDate - weekIndex + 10) / 7);

  if (weekNumber < 1) return weeksOfYear(dateObj.year - 1);
  if (weekNumber > weeksOfYear(dateObj.year)) return 1;

  return weekNumber;
}
