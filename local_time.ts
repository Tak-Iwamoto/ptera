import { MILLISECONDS_IN_MINUTE } from "./constants.ts";
import { Timestamp } from "./types.ts";

export function getLocalName(): string {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getLocalOffset(timestamp: Timestamp): number {
  return -new Date(timestamp).getTimezoneOffset() * MILLISECONDS_IN_MINUTE;
}

export function getLocalTime(timestamp: Timestamp): Date {
  const utcTimestamp = new Date(timestamp).getTime() +
    getLocalOffset(timestamp);
  return new Date(utcTimestamp);
}
