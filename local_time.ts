import { MILLISECONDS_IN_MINUTE } from "./constants.ts";
import { DateObj } from "./types.ts";
import { dateToJSDate, jsDateToDate } from "./convert.ts";

export function getLocalName(): string {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getLocalOffset(dateObj: DateObj): number {
  return -dateToJSDate(dateObj).getTimezoneOffset() *
    MILLISECONDS_IN_MINUTE;
}

export function utcToLocalTime(dateObj: DateObj): DateObj {
  const ts = dateToJSDate(dateObj).getTime() +
    getLocalOffset(dateObj);
  return jsDateToDate(new Date(ts));
}
