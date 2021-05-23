import { DateInfo } from "./types.ts";

type UTCDateTimeArg = DateInfo | string;

function isDateInfo(arg: UTCDateTimeArg): arg is DateInfo {
  return (arg as DateInfo).year !== undefined;
}

export class UTCDateTime {
  readonly year: number;
  readonly month: number;
  readonly day?: number;
  readonly hours?: number;
  readonly minutes?: number;
  readonly seconds?: number;
  readonly milliseconds?: number;
  readonly timezone = "UTC";

  constructor(date: DateInfo | string) {
    if (isDateInfo(date)) {
      this.year = date.year;
      this.month = date.month;
      this.day = date.day;
      this.hours = date.hours;
      this.minutes = date.minutes;
      this.seconds = date.seconds;
      this.milliseconds = date.milliseconds;
    } else {
      const d = new Date(date);
      this.year = d.getUTCFullYear();
      this.month = d.getUTCMonth() + 1;
      this.day = d.getUTCDate();
      this.hours = d.getUTCHours();
      this.minutes = d.getUTCMinutes();
      this.seconds = d.getUTCSeconds();
      this.milliseconds = d.getUTCMilliseconds();
    }
  }
}
