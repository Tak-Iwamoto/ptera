import { MILLISECONDS_IN_HOUR } from "./constants.ts";
import { formatDate } from "./format.ts";
import { isoToDateInfo } from "./format.ts";
import { tzOffset } from "./timezone_offset.ts";
import {
  DateArg,
  DateDiff,
  DateInfo,
  DateInfoArray,
  Option,
  Timezone,
} from "./types.ts";
import {
  dateArrayToDateInfo,
  dateInfoToArray,
  dateInfoToJSDate,
  dateInfoToTS,
  dayOfYear,
  daysInMonth,
  formatToTwoDigits,
  isValidDate,
  truncNumber,
  tsToDateInfo,
} from "./utils.ts";
import { toOtherZonedTime, zonedTimeToUTC } from "./zoned_time.ts";

function isDateInfo(arg: DateArg): arg is DateInfo {
  return (arg as DateInfo).year !== undefined;
}

function isDateArray(arg: DateArg): arg is number[] {
  return (Array.isArray(arg));
}

function parseArg(date: DateArg): DateInfo {
  if (typeof date === "number") {
    return tsToDateInfo(date);
  }

  if (isDateInfo(date)) {
    return date;
  }

  if (isDateArray(date)) {
    return dateArrayToDateInfo(date);
  } else {
    // TODO: 現状iso8601のみ
    const parsed = isoToDateInfo(date);
    if (!parsed) throw new Error("Invalid format");
    return parsed;
  }
}

function adjustedUnixTimeStamp(
  baseDateInfo: DateInfo,
  diff: DateDiff,
  option: {
    positive: boolean;
  },
) {
  const {
    year: baseYear,
    month: baseMonth,
    day: baseDay,
    hours: baseHours,
    minutes: baseMinutes,
    seconds: baseSeconds,
    milliseconds: baseMilliseconds,
  } = baseDateInfo;

  const diffYear = diff.year && diff.quarter
    ? truncNumber(diff.year + diff.quarter * 3)
    : truncNumber(diff.year);
  const adjustedYear = option.positive
    ? baseYear + diffYear
    : baseYear - diffYear;

  const diffMonth = truncNumber(diff.month);
  const adjustedMonth = option.positive
    ? baseMonth + diffMonth
    : baseMonth - diffMonth;

  const diffDay = diff.day && diff.weeks
    ? truncNumber(diff.day + diff.weeks * 7)
    : truncNumber(diff.day);
  const diffHours = truncNumber(diff.hours);
  const diffMinutes = truncNumber(diff.minutes);
  const diffSeconds = truncNumber(diff.seconds);
  const diffMilliSeconds = truncNumber(diff.milliseconds);

  if (option.positive) {
    return dateInfoToTS({
      year: adjustedYear,
      month: adjustedMonth,
      day: baseDay
        ? Math.min(baseDay, daysInMonth(adjustedYear, adjustedMonth)) + diffDay
        : diffDay,
      hours: baseHours ? baseHours + diffHours : diffHours,
      minutes: baseMinutes ? baseMinutes + diffMinutes : diffMinutes,
      seconds: baseSeconds ? baseSeconds + diffSeconds : diffSeconds,
      milliseconds: baseMilliseconds
        ? baseMilliseconds + diffMilliSeconds
        : diffMilliSeconds,
    });
  } else {
    return dateInfoToTS({
      year: adjustedYear,
      month: adjustedMonth,
      day: baseDay
        ? Math.min(baseDay, daysInMonth(adjustedYear, adjustedMonth)) - diffDay
        : undefined,
      hours: baseHours ? baseHours - diffHours : undefined,
      minutes: baseMinutes ? baseMinutes - diffMinutes : undefined,
      seconds: baseSeconds ? baseSeconds - diffSeconds : undefined,
      milliseconds: baseMilliseconds
        ? baseMilliseconds - diffMilliSeconds
        : undefined,
    });
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
  readonly #config?: Option;

  constructor(date: DateArg, config?: Option) {
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

  toUTCUnixTimestamp(): number {
    return dateInfoToTS(this.toDateInfo());
  }

  dayOfYear(): number {
    return dayOfYear(this.toDateInfo());
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
