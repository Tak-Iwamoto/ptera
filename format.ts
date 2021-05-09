import { parseDate } from "./parse_date.ts";
import { DateArg } from "./types.ts";
import { utcDayOfYear } from "./utc_day_of_year.ts";

type FormatDateType =
  | "YY"
  | "YYYY"
  | "M"
  | "MM"
  | "MMM"
  | "MMMM"
  | "d"
  | "dd"
  | "D"
  | "DD"
  | "H"
  | "HH"
  | "h"
  | "hh"
  | "m"
  | "mm"
  | "WWW"
  | "WWWW"
  | "a";

type MonthString =
  | "January"
  | "February"
  | "March"
  | "April"
  | "May"
  | "June"
  | "July"
  | "August"
  | "September"
  | "October"
  | "November"
  | "December";

function monthsStr(month: number): MonthString {
  switch (month) {
    case 1:
      return "January";
    case 2:
      return "February";
    case 3:
      return "March";
    case 4:
      return "April";
    case 5:
      return "May";
    case 6:
      return "June";
    case 7:
      return "July";
    case 8:
      return "August";
    case 9:
      return "September";
    case 10:
      return "October";
    case 11:
      return "November";
    case 12:
      return "December";
    default:
      throw new Error("Invalid month");
  }
}

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function formatToTwoDigits(n: number): string {
  return n <= 9 ? `0${n}` : n.toString();
}
export function format(dateArg: DateArg, formatStr: FormatDateType): string {
  const date = parseDate(dateArg);

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
      return monthsStr(month).slice(0, 3);
    case "MMMM":
      return monthsStr(month);
    case "d":
      return day.toString();
    case "dd":
      return formatToTwoDigits(day);
    case "D":
      return utcDayOfYear(dateArg).toString();
    case "DD":
      const dayOfYear = utcDayOfYear(dateArg);
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
