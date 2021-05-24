import { tzOffset } from "./timezone_offset.ts";
import { DateInfo, Timezone } from "./types.ts";
import { dateInfoToJSDate, dateInfoToTS, jsDateToDateInfo } from "./utils.ts";

export function utcToZonedTime(date: DateInfo, tz: Timezone): DateInfo {
  const offset = tzOffset(dateInfoToJSDate(date), tz);
  const d = new Date(dateInfoToTS(date) + offset);
  return jsDateToDateInfo(d);
}

export function zonedTimeToUTC(date: DateInfo, tz: Timezone): DateInfo {
  const offset = tzOffset(dateInfoToJSDate(date), tz);
  const d = new Date(dateInfoToTS(date) - offset);
  return jsDateToDateInfo(d);
}

export function diffOffset(
  date: DateInfo,
  baseTZ: Timezone,
  compareTZ: Timezone,
): number {
  if (baseTZ === compareTZ) return 0;
  const baseOffset = tzOffset(dateInfoToJSDate(date), baseTZ);
  const compareOffset = tzOffset(dateInfoToJSDate(date), compareTZ);
  return baseOffset - compareOffset;
}

export function toOtherZonedTime(
  date: DateInfo,
  baseTZ: Timezone,
  compareTZ: Timezone,
): DateInfo {
  const d = new Date(dateInfoToTS(date) - diffOffset(date, baseTZ, compareTZ));
  return jsDateToDateInfo(d);
}
