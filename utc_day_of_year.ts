import { MILLISECONDS_IN_DAY } from "./constants.ts";
import { parseDate } from "./parse_date.ts";
import { DateArg } from "./types.ts";

export function utcDayOfYear(dateArg: DateArg): number {
  const date = parseDate(dateArg);
  const timestamp = date.getTime();

  date.setUTCMonth(0, 1);
  date.setUTCHours(0, 0, 0, 0);

  const startOfYearTimestamp = date.getTime();
  const diff = timestamp - startOfYearTimestamp;
  return Math.floor(diff / MILLISECONDS_IN_DAY) + 1;
}
