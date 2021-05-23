import { MILLISECONDS_IN_MINUTE } from "./constants.ts";
import { DateInfo } from "./types.ts";
import { dateInfoToJSDate, jsDateToDateInfo } from "./utils.ts";

export function getLocalName(): string {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getLocalOffset(dateInfo: DateInfo): number {
  return -dateInfoToJSDate(dateInfo).getTimezoneOffset() *
    MILLISECONDS_IN_MINUTE;
}

export function utcToLocalTime(dateInfo: DateInfo): DateInfo {
  const ts = dateInfoToJSDate(dateInfo).getTime() +
    getLocalOffset(dateInfo);
  return jsDateToDateInfo(new Date(ts));
}
