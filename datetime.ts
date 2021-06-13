import {
  MILLISECONDS_IN_DAY,
  MILLISECONDS_IN_HOUR,
  MILLISECONDS_IN_MINUTE,
} from "./constants.ts";
import { adjustedUnixTimeStamp } from "./diff.ts";
import { formatDate } from "./format.ts";
import { isoToDateInfo } from "./format.ts";
import { getLocalName, utcToLocalTime } from "./local_time.ts";
import { tzOffset } from "./timezone_offset.ts";
import {
  Config,
  DateArg,
  DateDiff,
  DateInfo,
  DateInfoArray,
  Timezone,
} from "./types.ts";
import { formatToTwoDigits, isValidDate } from "./utils.ts";
import {
  dateArrayToDate,
  dateToArray,
  dateToJSDate,
  dateToTS,
} from "./convert.ts";

import { dateToDayOfYear, tsToDate } from "./convert.ts";
import { toOtherZonedTime, zonedTimeToUTC } from "./zoned_time.ts";

function isDateInfo(arg: DateArg): arg is DateInfo {
  return (arg as DateInfo).year !== undefined;
}

function isDateArray(arg: DateArg): arg is number[] {
  return (Array.isArray(arg));
}

function parseArg(date: DateArg): DateInfo {
  if (typeof date === "number") {
    return tsToDate(date);
  }

  if (isDateInfo(date)) {
    return date;
  }

  if (isDateArray(date)) {
    return dateArrayToDate(date);
  } else {
    const parsed = isoToDateInfo(date);
    if (!parsed) throw new Error("Invalid format");
    return parsed;
  }
}

export class Datetime {
  readonly year: number;
  readonly month: number;
  readonly day?: number;
  readonly hours?: number;
  readonly minutes?: number;
  readonly seconds?: number;
  readonly milliseconds?: number;
  readonly timezone: Timezone;
  readonly valid: boolean;
  readonly #config?: Config;

  constructor(date: DateArg, config?: Config) {
    const dateInfo = parseArg(date);
    const { year, month, day, hours, minutes, seconds, milliseconds } =
      dateInfo;
    this.valid = isValidDate(dateInfo);

    if (this.valid) {
      this.year = year;
      this.month = month;
      this.day = day;
      this.hours = hours;
      this.minutes = minutes;
      this.seconds = seconds;
      this.milliseconds = milliseconds;
    } else {
      this.year = NaN;
      this.month = NaN;
      this.day = NaN;
      this.hours = NaN;
      this.minutes = NaN;
      this.seconds = NaN;
      this.milliseconds = NaN;
    }
    this.#config = config;
    this.timezone = config?.timezone ?? "UTC";
  }

  static now(config?: Config): Datetime {
    const utcDatetime = new Datetime(new Date().getTime());
    if (config?.timezone) {
      return utcDatetime.toZonedTime(config?.timezone);
    }

    const localDate = utcToLocalTime(utcDatetime.toDateInfo());
    return new Datetime(localDate, { timezone: getLocalName() as Timezone });
  }

  static diffInMillisec(baseDate: Datetime, compareDate: Datetime): number {
    return Math.abs(
      baseDate.toUTC().toTimestamp() - compareDate.toUTC().toTimestamp(),
    );
  }

  static diffInSec(baseDate: Datetime, compareDate: Datetime): number {
    return Math.floor(this.diffInMillisec(baseDate, compareDate) / 1000);
  }

  static diffInMin(baseDate: Datetime, compareDate: Datetime): number {
    return Math.floor(
      this.diffInMillisec(baseDate, compareDate) / MILLISECONDS_IN_MINUTE,
    );
  }

  static diffInHours(baseDate: Datetime, compareDate: Datetime): number {
    return Math.floor(
      this.diffInMillisec(baseDate, compareDate) / MILLISECONDS_IN_HOUR,
    );
  }

  static diffInDays(baseDate: Datetime, compareDate: Datetime): number {
    return Math.floor(
      this.diffInMillisec(baseDate, compareDate) / MILLISECONDS_IN_DAY,
    );
  }

  static isValidZone(tz: string): boolean {
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: tz }).format();
      return true;
    } catch {
      return false;
    }
  }

  isValid(): boolean {
    return isValidDate(this.toDateInfo());
  }

  toDateInfo(): DateInfo {
    const { year, month, day, hours, minutes, seconds, milliseconds } = this;
    return {
      year,
      month,
      day,
      hours,
      minutes,
      seconds,
      milliseconds,
    };
  }

  toISO(): string {
    const offset = this.offsetHours() >= 0
      ? `+${formatToTwoDigits(this.offsetHours())}:00`
      : `-${formatToTwoDigits(this.offsetHours() * -1)}:00`;
    const tz = this.timezone === "UTC" ? "Z" : offset;
    return `${this.toISODate()}T${this.toISOTime()}${tz}`;
  }

  toISODate(): string {
    return formatDate(this.toDateInfo(), "YYYY-MM-dd");
  }

  toISOWeekDate(): string {
    return formatDate(this.toDateInfo(), "YYYY-'W'WW-w");
  }

  toISOTime(): string {
    return formatDate(this.toDateInfo(), "HH:mm:ss.S");
  }

  toUTC(): Datetime {
    const utcDateInfo = zonedTimeToUTC(
      this.toDateInfo(),
      this.timezone,
    );
    return new Datetime(utcDateInfo, { timezone: "UTC" });
  }

  toZonedTime(tz: Timezone): Datetime {
    const zonedDateInfo = toOtherZonedTime(
      this.toDateInfo(),
      this.timezone,
      tz,
    );
    return new Datetime(zonedDateInfo, { timezone: tz });
  }

  toJSDate(): Date {
    return dateToJSDate(this.toDateInfo());
  }

  toDateArray(): DateInfoArray {
    return dateToArray(this.toDateInfo());
  }

  toTimestamp(): number {
    return dateToTS(this.toDateInfo());
  }

  dayOfYear(): number {
    return dateToDayOfYear(this.toDateInfo());
  }

  add(addDateDiff: DateDiff): Datetime {
    const dt = new Datetime(
      adjustedUnixTimeStamp(this.toDateInfo(), addDateDiff, { positive: true }),
      this.#config,
    );
    return dt;
  }

  substract(subDateInfo: Partial<DateInfo>): Datetime {
    return new Datetime(
      adjustedUnixTimeStamp(this.toDateInfo(), subDateInfo, {
        positive: false,
      }),
      this.#config,
    );
  }

  offset(): number {
    return tzOffset(
      new Date(
        this.year,
        this.month - 1,
        this.day,
        this.hours,
        this.minutes,
        this.seconds,
        this.milliseconds,
      ),
      this?.timezone ?? "UTC",
    );
  }

  offsetHours(): number {
    return this.offset() / MILLISECONDS_IN_HOUR;
  }
}
