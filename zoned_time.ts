import { tzOffset } from "./timezone.ts";
import { DateObj, Timezone } from "./types.ts";
import { dateToJSDate, dateToTS, jsDateToDate } from "./convert.ts";

export function utcToZonedTime(date: DateObj, tz: Timezone): DateObj {
  const offset = tzOffset(dateToJSDate(date), tz);
  const d = new Date(dateToTS(date) + offset);
  return jsDateToDate(d);
}

export function zonedTimeToUTC(date: DateObj, tz: Timezone): DateObj {
  const offset = tzOffset(dateToJSDate(date), tz);
  const d = new Date(dateToTS(date) - offset);
  return jsDateToDate(d);
}

export function diffOffset(
  date: DateObj,
  baseTZ: Timezone,
  compareTZ: Timezone,
): number {
  if (baseTZ === compareTZ) return 0;
  const baseOffset = tzOffset(dateToJSDate(date), baseTZ);
  const compareOffset = tzOffset(dateToJSDate(date), compareTZ);
  return baseOffset - compareOffset;
}

export function toOtherZonedTime(
  date: DateObj,
  baseTZ: Timezone,
  compareTZ: Timezone,
): DateObj {
  const d = new Date(dateToTS(date) - diffOffset(date, baseTZ, compareTZ));
  return jsDateToDate(d);
}
