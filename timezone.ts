import { Timezone } from "./types.ts";

type TokenizeDate = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

export function tzOffset(date: Date, tz: Timezone): number {
  const tzDate = tzTokenizeDate(date, tz);

  const { year, month, day, hour, minute, second } = tzDate;
  const utc = Date.UTC(year, month - 1, day, hour, minute, second);

  let asTS = date.getTime();
  const over = asTS % 1000;
  asTS -= over >= 0 ? over : 1000 + over;
  return utc - asTS;
}

function tzTokenizeDate(date: Date, tz: Timezone) {
  const dtf = getDateTimeFormat(tz);
  return partsOffset(dtf, date);
}

function partsOffset(dtf: Intl.DateTimeFormat, date: Date): TokenizeDate {
  const formatted = dtf.formatToParts(date);

  const hash: { [key: string]: number } = {};

  for (const f of formatted) {
    hash[f.type] = parseInt(f.value, 10);
  }

  return {
    year: hash["year"],
    month: hash["month"],
    day: hash["day"],
    hour: hash["hour"],
    minute: hash["minute"],
    second: hash["second"],
  };
}

const cache: Map<string, Intl.DateTimeFormat> = new Map();
function getDateTimeFormat(tz: Timezone): Intl.DateTimeFormat {
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
