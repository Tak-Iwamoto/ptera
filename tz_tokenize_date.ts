import { Timezone } from "./types.ts";

type TokenizeDate = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

export function tzTokenizeDate(date: Date, tz: Timezone) {
  const dtf = getDateTimeFormat(tz);
  return partsOffset(dtf, date);
}

function partsOffset(dtf: Intl.DateTimeFormat, date: Date): TokenizeDate {
  const formatted = dtf.formatToParts(date);

  let hash: { [key: string]: number } = {};

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

// 必要になった時にコメント解除する
// function hackyOffset(dtf: Intl.DateTimeFormat, date: Date): TokenizeDate {
//   const formatted = dtf.format(date).replace(/\u200E/g, "")
//   const parsed = /(\d+)\/(\d+)\/(\d+),? (\d+):(\d+):(\d+)/.exec(formatted)

//   return {
//     year: parseInt(parsed?.[3] as string, 10),
//     month: parseInt(parsed?.[1] as string, 10),
//     day: parseInt(parsed?.[2] as string, 10),
//     hour: parseInt(parsed?.[4] as string, 10),
//     minute: parseInt(parsed?.[5] as string, 10),
//     second: parseInt(parsed?.[6] as string, 10),
//   }
// }

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
