import { adjustedUnixTimeStamp } from "./diff.ts";
import { formatDate } from "./format.ts";
import { isoToDateInfo } from "./format.ts";
import { getLocalName, utcToLocalTime } from "./local_time.ts";
import { tzOffset } from "./timezone.ts";
import { dateToDayOfYear, tsToDate } from "./convert.ts";
import { toOtherZonedTime, zonedTimeToUTC } from "./zoned_time.ts";
import { arrayToDate, dateToArray, dateToJSDate, dateToTS } from "./convert.ts";
import { Locale } from "./locale.ts";
import { isLeapYear, isValidDate, weeksInWeekYear } from "./utils.ts";
import {
  Config,
  DateDiff,
  DateInfo,
  DateInfoArray,
  Timezone,
} from "./types.ts";
import {
  MILLISECONDS_IN_DAY,
  MILLISECONDS_IN_HOUR,
  MILLISECONDS_IN_MINUTE,
} from "./constants.ts";

type DateArg = DateInfo | Date | number[] | string | number;

function isDateInfo(arg: DateArg): arg is DateInfo {
  return (arg as DateInfo).year !== undefined;
}

function isArray(arg: DateArg): arg is number[] {
  return (Array.isArray(arg));
}

function parseArg(date: DateArg): DateInfo {
  if (typeof date === "number") {
    return tsToDate(date);
  }

  if (date instanceof Date) {
    return tsToDate(date.getTime());
  }

  if (isDateInfo(date)) {
    return date;
  }

  if (isArray(date)) {
    return arrayToDate(date);
  }

  const parsed = isoToDateInfo(date);
  if (!parsed) throw new Error("Invalid format");
  return parsed;
}

export class Time {
  readonly year: number;
  readonly month: number;
  readonly day?: number;
  readonly hours?: number;
  readonly minutes?: number;
  readonly seconds?: number;
  readonly milliseconds?: number;
  readonly timezone: Timezone;
  readonly valid: boolean;
  readonly locale: string;
  readonly #localeClass: Locale;

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
    this.timezone = config?.timezone ?? "UTC";
    this.locale = config?.locale ?? "en";
    this.#localeClass = new Locale(this.locale);
  }

  static now(config?: Config): Time {
    const utcTime = new Time(new Date().getTime());
    if (config?.timezone) {
      return utcTime.toZonedTime(config?.timezone, config);
    }

    const localDate = utcToLocalTime(utcTime.toDateInfo());
    return new Time(localDate, {
      ...config,
      timezone: getLocalName() as Timezone,
    });
  }

  static diffInMillisec(baseDate: Time, compareDate: Time): number {
    return Math.abs(
      baseDate.toUTC().toTimestamp() - compareDate.toUTC().toTimestamp(),
    );
  }

  static diffInSec(baseDate: Time, compareDate: Time): number {
    return Math.floor(this.diffInMillisec(baseDate, compareDate) / 1000);
  }

  static diffInMin(baseDate: Time, compareDate: Time): number {
    return Math.floor(
      this.diffInMillisec(baseDate, compareDate) / MILLISECONDS_IN_MINUTE,
    );
  }

  static diffInHours(baseDate: Time, compareDate: Time): number {
    return Math.floor(
      this.diffInMillisec(baseDate, compareDate) / MILLISECONDS_IN_HOUR,
    );
  }

  static diffInDays(baseDate: Time, compareDate: Time): number {
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
    const offset = formatDate(this.toDateInfo(), "Z", this.#config());
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

  #config(): Config {
    return {
      offsetMillisec: this.offsetMillisec(),
      timezone: this.timezone,
      locale: this.locale,
    };
  }

  format(formatStr: string) {
    return formatDate(this.toDateInfo(), formatStr, this.#config());
  }

  toUTC(): Time {
    const utcDateInfo = zonedTimeToUTC(
      this.toDateInfo(),
      this.timezone,
    );
    return new Time(utcDateInfo, { ...this.#config(), timezone: "UTC" });
  }

  toZonedTime(tz: Timezone, config?: Config): Time {
    const zonedDateInfo = toOtherZonedTime(
      this.toDateInfo(),
      this.timezone,
      tz,
    );
    return new Time(zonedDateInfo, { ...config, timezone: tz });
  }

  toJSDate(): Date {
    return dateToJSDate(this.toDateInfo());
  }

  toArray(): DateInfoArray {
    return dateToArray(this.toDateInfo());
  }

  toTimestamp(): number {
    return dateToTS(this.toDateInfo());
  }

  dayOfYear(): number {
    return dateToDayOfYear(this.toDateInfo());
  }

  weeksInWeekYear(): number {
    return weeksInWeekYear(this.year);
  }

  quarter(): number {
    return Math.ceil(this.month / 3);
  }

  isLeapYear(): boolean {
    return isLeapYear(this.year);
  }

  add(addDateDiff: DateDiff): Time {
    const dt = new Time(
      adjustedUnixTimeStamp(this.toDateInfo(), addDateDiff, { positive: true }),
      this.#config(),
    );
    return dt;
  }

  substract(subDateInfo: Partial<DateInfo>): Time {
    return new Time(
      adjustedUnixTimeStamp(this.toDateInfo(), subDateInfo, {
        positive: false,
      }),
      this.#config(),
    );
  }

  offsetMillisec(): number {
    if (this.valid) {
      return tzOffset(
        new Date(
          this.year,
          this.month - 1,
          this.day ?? 0,
          this.hours ?? 0,
          this.minutes ?? 0,
          this.seconds ?? 0,
          this.milliseconds ?? 0,
        ),
        this?.timezone ?? "UTC",
      );
    } else {
      return 0;
    }
  }

  offsetHours(): number {
    return this.offsetMillisec
      ? this.offsetMillisec() / MILLISECONDS_IN_HOUR
      : 0;
  }

  toDateTimeFormat(options?: Intl.DateTimeFormatOptions) {
    return this.#localeClass.dtfFormat(this.toJSDate(), options);
  }

  toDateTimeFormatParts(options?: Intl.DateTimeFormatOptions) {
    return this.#localeClass.dtfFormatToParts(this.toJSDate(), options);
  }
}
