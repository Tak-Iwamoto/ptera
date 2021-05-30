import { MILLISECONDS_IN_HOUR } from "./constants.ts";
import { formatDate } from "./format.ts";
import { isoToDateInfo } from "./format.ts";
import { tzOffset } from "./timezone_offset.ts";
import { Config, DateInfo, DateInfoArray, Timezone } from "./types.ts";
import {
  dateInfoToArray,
  dateInfoToJSDate,
  formatToTwoDigits,
  isValidDate,
} from "./utils.ts";
import { toOtherZonedTime, zonedTimeToUTC } from "./zoned_time.ts";

function isDateInfo(arg: DateInfo | string): arg is DateInfo {
  return (arg as DateInfo).year !== undefined;
}

function parseArg(date: DateInfo | string): DateInfo {
  if (isDateInfo(date)) {
    return date;
  } else {
    // TODO: 現状iso8601のみ
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

  constructor(date: DateInfo | string, config?: Config) {
    const { year, month, day, hours, minutes, seconds, milliseconds } =
      parseArg(date);
    this.year = year;
    this.month = month;
    this.day = day;
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
    this.milliseconds = milliseconds;
    this.timezone = config?.timezone ?? "UTC";
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

  toISOTime(): string {
    return formatDate(this.toDateInfo(), "HH:mm:ss.S");
  }

  toUTC(): Datetime {
    const utcDateInfo = zonedTimeToUTC(this.toDateInfo(), this.timezone);
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
    return dateInfoToJSDate(this.toDateInfo());
  }

  toDateArray(): DateInfoArray {
    return dateInfoToArray(this.toDateInfo());
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
