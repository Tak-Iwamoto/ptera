import { MILLISECONDS_IN_HOUR } from "./constants.ts";
import { parseDate } from "./parse_date.ts";
import { millisecondsOffset } from "./timezone_offset.ts";
import { DateArg, Timezone } from "./types.ts";

export function zonedTime(dateArg: DateArg, tz: Timezone) {
  const date = parseDate(dateArg);
  const offset = millisecondsOffset(date, tz);
  console.log(offset / MILLISECONDS_IN_HOUR);
  const d = new Date(date.getTime() - offset);

  return new Date(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
    d.getUTCSeconds(),
    d.getUTCMilliseconds(),
  );
}
