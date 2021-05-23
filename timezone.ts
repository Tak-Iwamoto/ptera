import { tzOffset } from "./timezone_offset.ts";
import { DateInfo, Timezone } from "./types.ts";
import { toDateInfo } from "./utils.ts";

type Config = {
  timezone: Timezone;
};

export class DD {
  readonly year: number;
  readonly month: number;
  readonly day?: number;
  readonly hours?: number;
  readonly minutes?: number;
  readonly seconds?: number;
  readonly milliseconds?: number;
  readonly timezone?: Timezone;

  constructor(date: DateInfo | string, config?: Config) {
    const { year, month, day, hours, minutes, seconds, milliseconds } =
      toDateInfo(date);
    this.year = year;
    this.month = month;
    this.day = day;
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
    this.milliseconds = milliseconds;
    this.timezone = config?.timezone;
  }

  toUTC() {
  }

  offset() {
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
