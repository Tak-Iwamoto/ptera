import { MILLISECONDS_IN_MINUTE } from "./constants.ts";
import { DateArg } from "./types.ts";

export function getLocalName(): string {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function getLocalOffset(dateArg: DateArg): number {
  return -new Date(dateArg).getTimezoneOffset() * MILLISECONDS_IN_MINUTE;
}

export function utcToLocalTime(dateArg: DateArg): Date {
  const utcDate = new Date(dateArg).getTime() +
    getLocalOffset(dateArg);
  return new Date(utcDate);
}
