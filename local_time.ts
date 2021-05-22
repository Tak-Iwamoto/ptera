import { MILLISECONDS_IN_MINUTE } from "./constants.ts";
import { TimeStamp } from "./types.ts";

export function getLocalName(): string {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getLocalOffset(timeStamp: TimeStamp): number {
  return -new Date(timeStamp).getTimezoneOffset() * MILLISECONDS_IN_MINUTE;
}
