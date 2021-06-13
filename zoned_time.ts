import { tzOffset } from "./timezone.ts";
import { DateInfo, Timezone } from "./types.ts";
import { dateToJSDate, dateToTS, jsDateToDate } from "./convert.ts";

export function utcToZonedTime(date: DateInfo, tz: Timezone): DateInfo {
  const offset = tzOffset(dateToJSDate(date), tz);
  const d = new Date(dateToTS(date) + offset);
  return jsDateToDate(d);
}

export function zonedTimeToUTC(date: DateInfo, tz: Timezone): DateInfo {
  const offset = tzOffset(dateToJSDate(date), tz);
  const d = new Date(dateToTS(date) - offset);
  return jsDateToDate(d);
}

export function diffOffset(
  date: DateInfo,
  baseTZ: Timezone,
  compareTZ: Timezone,
): number {
  if (baseTZ === compareTZ) return 0;
  const baseOffset = tzOffset(dateToJSDate(date), baseTZ);
  const compareOffset = tzOffset(dateToJSDate(date), compareTZ);
  return baseOffset - compareOffset;
}

export function toOtherZonedTime(
  date: DateInfo,
  baseTZ: Timezone,
  compareTZ: Timezone,
): DateInfo {
  const d = new Date(dateToTS(date) - diffOffset(date, baseTZ, compareTZ));
  return jsDateToDate(d);
}
