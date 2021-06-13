import { MILLISECONDS_IN_MINUTE } from "./constants.ts";
import { DateInfo } from "./types.ts";
import { dateToJSDate, jsDateToDate } from "./convert.ts";

export function getLocalName(): string {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getLocalOffset(dateInfo: DateInfo): number {
  return -dateToJSDate(dateInfo).getTimezoneOffset() *
    MILLISECONDS_IN_MINUTE;
}

export function utcToLocalTime(dateInfo: DateInfo): DateInfo {
  const ts = dateToJSDate(dateInfo).getTime() +
    getLocalOffset(dateInfo);
  return jsDateToDate(new Date(ts));
}
