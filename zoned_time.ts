import { tzOffset } from "./timezone_offset.ts";
import { DateInfo, Timezone } from "./types.ts";
import { dateInfoToJSDate, dateInfoToTS, jsDateToDateInfo } from "./utils.ts";

export function utcToZonedTime(date: DateInfo, tz: Timezone): DateInfo {
  const offset = tzOffset(dateInfoToJSDate(date), tz);
  const d = new Date(dateInfoToTS(date) + offset);
  return jsDateToDateInfo(d)
}

export function zonedTimeToUTC(date: DateInfo, tz: Timezone): DateInfo {
  const offset = tzOffset(dateInfoToJSDate(date), tz);
  const d = new Date(dateInfoToTS(date) - offset);
  return jsDateToDateInfo(d)
}
