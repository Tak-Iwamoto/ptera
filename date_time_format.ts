import { Timezone } from "./timezoneIds.ts";
const cache: Map<string, Intl.DateTimeFormat> = new Map();

export function initDateTimeFormat(tz: Timezone): Intl.DateTimeFormat {
  if (!cache.get(tz)) {
    const tmpDateFormat = new Intl.DateTimeFormat("en-US", {
      hour12: false,
      timeZone: "America/New_York",
      year: "numeric",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date("2021-05-15T04:00:00.123Z"));

    const isHourCycleSupported = tmpDateFormat ===
        "05/15/2021, 00:00:00" ||
      tmpDateFormat === "‎05‎/15‎/‎2021‎ ‎00‎:‎00‎:‎00";
    const format = isHourCycleSupported
      ? new Intl.DateTimeFormat("en-US", {
        hour12: false,
        timeZone: tz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      : new Intl.DateTimeFormat("en-US", {
        hourCycle: "h23",
        timeZone: tz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    cache.set(tz, format);
  }

  return cache.get(tz) as Intl.DateTimeFormat;
}
