import { tzOffset } from "./timezone_offset.ts";
import { Timezone } from "./types.ts";
import { getUtcTime } from "./utc_time.ts";

export function zonedTime(date: Date, tz: Timezone): Date {
  const offset = tzOffset(date, tz);
  const d = new Date(getUtcTime(date).getTime() + offset);

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
