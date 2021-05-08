import { parseDate } from "./parse_date.ts"
import { DateArg } from "./types.ts"
// const REGEX_FORMAT_PATTERN = /Y{2}|Y{4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|m{1,2}|W{3,4}|a{1,2}/

/**
 * @name format
 * @summary format Date
 * @param  {string} params
 * @description
 * Return the formmated date string
 */

type FormatDateType =
  | "YY"
  | "YYYY"
  | "M"
  | "MM"
  | "MMM"
  | "MMMM"
  | "D"
  | "DD"
  | "d"
  | "dd"
  | "ddd"
  | "dddd"
  | "H"
  | "HH"
  | "h"
  | "hh"
  | "m"
  | "mm"
  | "WWW"
  | "WWWW"
  | "a"
  | "aa"

export function format(dateArg: DateArg, formatStr: FormatDateType): string {
  const date = parseDate(dateArg)

  switch (formatStr) {
    case "YY":
      return date.getUTCFullYear().toString().slice(-2)
    case "YYYY":
      return date.getUTCFullYear().toString()
    case "M":
      return (date.getUTCMonth() + 1).toString()
    case "MM":
      const month = date.getUTCMonth() + 1
      return month <= 9 ? `0${month}` : month.toString()
    default:
      throw new TypeError("Please input valid format.")
  }
}
