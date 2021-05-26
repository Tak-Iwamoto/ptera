import { tzOffset } from "./timezone_offset.ts";
import { DateInfo, Timezone } from "./types.ts";
import { dateInfoToJSDate, jsDateToDateInfo } from "./utils.ts";
import { toOtherZonedTime, zonedTimeToUTC } from "./zoned_time.ts";

type Config = {
  timezone: Timezone;
};

function isDateInfo(arg: DateInfo | string): arg is DateInfo {
  return (arg as DateInfo).year !== undefined;
}

function parseArg(date: DateInfo | string) {
  if (isDateInfo(date)) {
    return date;
  } else {
    const d = new Date(date);
    return jsDateToDateInfo(d);
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
}
