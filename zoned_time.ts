import { tzOffset } from "./timezone_offset.ts";
import { Timezone } from "./types.ts";
import { utcToLocalTime } from "./local_time.ts";

export function utcToZonedTime(date: Date, tz: Timezone): Date {
  const offset = tzOffset(date, tz);
  const d = new Date(utcToLocalTime(date).getTime() + offset);

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
