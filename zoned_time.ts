import { tzOffset } from "./timezone_offset.ts";
import { Timezone } from "./types.ts";

export function zonedTime(date: Date, tz: Timezone) {
  const offset = tzOffset(date, tz);
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
