import { adjustedTS } from "./diff.ts";
import { formatDate } from "./format.ts";
import { getLocalName } from "./local_time.ts";
import { tzOffset } from "./timezone.ts";
import { toOtherZonedTime, zonedTimeToUTC } from "./zoned_time.ts";
import { Locale } from "./locale.ts";
import { parseDateStr, parseISO } from "./parse_date.ts";
import {
  arrayToDate,
  dateToArray,
  dateToDayOfYear,
  dateToJSDate,
  dateToTS,
  tsToDate,
} from "./convert.ts";
import {
  daysInMonth,
  INVALID_DATE,
  isLeapYear,
  isValidDate,
  weeksInWeekYear,
} from "./utils.ts";
import { DateArray, DateDiff, DateObj, Option, Timezone } from "./types.ts";
import {
  MILLISECONDS_IN_DAY,
  MILLISECONDS_IN_HOUR,
  MILLISECONDS_IN_MINUTE,
} from "./constants.ts";

export type DateArg = Partial<DateObj> | Date | number[] | string | number;

function isDateObj(arg: DateArg): arg is DateObj {
  return (arg as DateObj).year !== undefined;
}

function isArray(arg: DateArg): arg is number[] {
  return (Array.isArray(arg));
}

function parseArg(date: DateArg): DateObj {
  if (typeof date === "number") {
    return tsToDate(date);
  }

  if (date instanceof Date) {
    return tsToDate(date.getTime());
  }

  if (isDateObj(date)) {
    return date;
  }

  if (isArray(date)) {
    return arrayToDate(date);
  }

  if (typeof date === "string") {
    const parsed = parseISO(date);
    const offset = parsed.offsetMillisec;
    if (!offset || offset === 0) return parsed;

    const normalizeSign = offset > 0 ? false : true;
    return tsToDate(
      adjustedTS(parsed, { millisecond: offset }, { positive: normalizeSign }),
    );
  }

  return INVALID_DATE;
}

export type DateTimeOption = Omit<Option, "offsetMillisec">;

export type DateUnit =
  | "year"
  | "month"
  | "day"
  | "hour"
  | "minute"
  | "second"
  | "quarter";

export function parse(
  dateStr: string,
  formatStr: string,
  option?: DateTimeOption,
): DateTime {
  const {
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
    timezone,
  } = parseDateStr(dateStr, formatStr, { locale: option?.locale ?? "en" });

  const tz = timezone ?? option?.timezone;
  return datetime({
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond,
  }, { ...option, timezone: tz });
}

export function latestDateTime(datetimes: DateTime[]) {
  return datetimes.reduce((a, b) =>
    a.toUTC().toTimestamp() > b.toUTC().toTimestamp() ? a : b
  );
}

export function oldestDateTime(datetimes: DateTime[]) {
  return datetimes.reduce((a, b) =>
    a.toUTC().toTimestamp() < b.toUTC().toTimestamp() ? a : b
  );
}

export function diffInMillisec(
  baseDate: DateTime,
  compareDate: DateTime,
): number {
  return Math.abs(
    baseDate.toUTC().toTimestamp() - compareDate.toUTC().toTimestamp(),
  );
}

export function diffInSec(baseDate: DateTime, compareDate: DateTime): number {
  return Math.floor(diffInMillisec(baseDate, compareDate) / 1000);
}

export function diffInMin(baseDate: DateTime, compareDate: DateTime): number {
  return Math.floor(
    diffInMillisec(baseDate, compareDate) / MILLISECONDS_IN_MINUTE,
  );
}

export function diffInHours(baseDate: DateTime, compareDate: DateTime): number {
  return Math.floor(
    diffInMillisec(baseDate, compareDate) / MILLISECONDS_IN_HOUR,
  );
}

export function diffInDays(baseDate: DateTime, compareDate: DateTime): number {
  return Math.floor(
    diffInMillisec(baseDate, compareDate) / MILLISECONDS_IN_DAY,
  );
}

export function datetime(date?: DateArg, option?: DateTimeOption) {
  if (date) {
    return new DateTime(date, option);
  }
  return DateTime.now(option);
}

export class DateTime {
  readonly year: number;
  readonly month: number;
  readonly day: number;
  readonly hour: number;
  readonly minute: number;
  readonly second: number;
  readonly millisecond: number;
  readonly timezone: Timezone;
  readonly valid: boolean;
  readonly locale: string;
  readonly #localeClass: Locale;

  constructor(date: DateArg, option?: DateTimeOption) {
    const dateObj = parseArg(date);
    const { year, month, day, hour, minute, second, millisecond } = dateObj;
    this.valid = isValidDate(dateObj);

    if (this.valid) {
      this.year = year;
      this.month = month;
      this.day = day ?? 1;
      this.hour = hour ?? 0;
      this.minute = minute ?? 0;
      this.second = second ?? 0;
      this.millisecond = millisecond ?? 0;
    } else {
      this.year = NaN;
      this.month = NaN;
      this.day = NaN;
      this.hour = NaN;
      this.minute = NaN;
      this.second = NaN;
      this.millisecond = NaN;
    }
    this.timezone = option?.timezone ?? "UTC";
    this.locale = option?.locale ?? "en";
    this.#localeClass = new Locale(this.locale);
  }

  static now(option?: Option): DateTime {
    const utcTime = datetime(new Date().getTime());
    if (option?.timezone) {
      return utcTime.toZonedTime(option?.timezone).setOption(option);
    }

    return datetime(utcTime.toDateObj(), {
      ...option,
    });
  }

  toLocal(): DateTime {
    const tz = getLocalName() as Timezone;
    const zonedTime = this.toZonedTime(
      tz,
    );
    return datetime(zonedTime.toDateObj(), {
      timezone: getLocalName() as Timezone,
    });
  }

  isValidZone(): boolean {
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: this.timezone }).format();
      return true;
    } catch {
      return false;
    }
  }

  isValid(): boolean {
    return isValidDate(this.toDateObj());
  }

  toDateObj(): DateObj {
    const { year, month, day, hour, minute, second, millisecond } = this;
    return {
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
    };
  }

  toISO(): string {
    const offset = formatDate(this.toDateObj(), "Z", this.#option());
    const tz = this.timezone === "UTC" ? "Z" : offset;
    return `${this.toISODate()}T${this.toISOTime()}${tz}`;
  }

  toISODate(): string {
    return formatDate(this.toDateObj(), "YYYY-MM-dd");
  }

  toISOWeekDate(): string {
    return formatDate(this.toDateObj(), "YYYY-'W'WW-w");
  }

  toISOTime(): string {
    return formatDate(this.toDateObj(), "HH:mm:ss.S");
  }

  format(formatStr: string) {
    return formatDate(this.toDateObj(), formatStr, this.#option());
  }

  toUTC(): DateTime {
    const utcDateObj = zonedTimeToUTC(
      this.toDateObj(),
      this.timezone,
    );
    return datetime(utcDateObj, { ...this.#option(), timezone: "UTC" });
  }

  toZonedTime(tz: Timezone): DateTime {
    const zonedDateObj = toOtherZonedTime(
      this.toDateObj(),
      this.timezone,
      tz,
    );
    return datetime(zonedDateObj, { ...this.#option, timezone: tz });
  }

  toJSDate(): Date {
    return dateToJSDate(this.toDateObj());
  }

  toArray(): DateArray {
    return dateToArray(this.toDateObj());
  }

  toTimestamp(): number {
    return dateToTS(this.toDateObj());
  }

  dayOfYear(): number {
    return dateToDayOfYear(this.toDateObj());
  }

  weeksInWeekYear(): number {
    return weeksInWeekYear(this.year);
  }

  quarter(): number {
    return Math.ceil(this.month / 3);
  }

  isBefore(): boolean {
    return this.toTimestamp() < new Date().getTime();
  }

  isAfter(): boolean {
    return this.toTimestamp() > new Date().getTime();
  }

  isLeapYear(): boolean {
    return isLeapYear(this.year);
  }

  startOf(unit: DateUnit): DateTime {
    const dateObj = this.toDateObj();
    switch (unit) {
      case "year": {
        return datetime({
          ...dateObj,
          month: 1,
          day: 1,
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        }, this.#option());
      }
      case "month": {
        return datetime({
          ...dateObj,
          day: 1,
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        }, this.#option());
      }
      case "day": {
        return datetime({
          ...dateObj,
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        }, this.#option());
      }
      case "hour": {
        return datetime({
          ...dateObj,
          minute: 0,
          second: 0,
          millisecond: 0,
        }, this.#option());
      }
      case "minute": {
        return datetime({
          ...dateObj,
          second: 0,
          millisecond: 0,
        }, this.#option());
      }
      case "second": {
        return datetime({
          ...dateObj,
          millisecond: 0,
        }, this.#option());
      }
      case "quarter": {
        return datetime({
          ...dateObj,
          month: 1 + (this.quarter() - 1) * 3,
          day: 1,
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        }, this.#option());
      }
      default: {
        throw new Error(`${unit} is invalid unit`);
      }
    }
  }

  endOf(unit: DateUnit): DateTime {
    const dateObj = this.toDateObj();
    switch (unit) {
      case "year": {
        return datetime({
          ...dateObj,
          month: 12,
          day: 31,
          hour: 23,
          minute: 59,
          second: 59,
          millisecond: 999,
        }, this.#option());
      }
      case "month": {
        return datetime({
          ...dateObj,
          day: daysInMonth(dateObj.year, dateObj.month),
          hour: 23,
          minute: 59,
          second: 59,
          millisecond: 999,
        }, this.#option());
      }
      case "day": {
        return datetime({
          ...dateObj,
          hour: 23,
          minute: 59,
          second: 59,
          millisecond: 999,
        }, this.#option());
      }
      case "hour": {
        return datetime({
          ...dateObj,
          minute: 59,
          second: 59,
          millisecond: 999,
        }, this.#option());
      }
      case "minute": {
        return datetime({
          ...dateObj,
          second: 59,
          millisecond: 999,
        }, this.#option());
      }
      case "second": {
        return datetime({
          ...dateObj,
          millisecond: 999,
        }, this.#option());
      }
      case "quarter": {
        const month = 3 * this.quarter();
        return datetime({
          ...dateObj,
          month,
          day: daysInMonth(dateObj.year, month),
          hour: 23,
          minute: 59,
          second: 59,
          millisecond: 999,
        }, this.#option());
      }
      default: {
        throw new Error(`${unit} is invalid unit`);
      }
    }
  }
  add(addDateDiff: DateDiff): DateTime {
    const dt = datetime(
      adjustedTS(this.toDateObj(), addDateDiff, { positive: true }),
      this.#option(),
    );
    return dt;
  }

  substract(subDateObj: Partial<DateObj>): DateTime {
    return datetime(
      adjustedTS(this.toDateObj(), subDateObj, {
        positive: false,
      }),
      this.#option(),
    );
  }

  offsetMillisec(): number {
    if (this.valid) {
      return tzOffset(
        new Date(
          this.year,
          this.month - 1,
          this.day ?? 0,
          this.hour ?? 0,
          this.minute ?? 0,
          this.second ?? 0,
          this.millisecond ?? 0,
        ),
        this?.timezone ?? "UTC",
      );
    } else {
      return 0;
    }
  }

  offsetSec(): number {
    return this.offsetMillisec ? this.offsetMillisec() / 1000 : 0;
  }

  offsetMin(): number {
    return this.offsetMillisec
      ? this.offsetMillisec() / MILLISECONDS_IN_MINUTE
      : 0;
  }

  offsetHour(): number {
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

  setOption(option: DateTimeOption) {
    return datetime(this.toDateObj(), { ...this.#option, ...option });
  }

  setLocale(locale: string) {
    return datetime(this.toDateObj(), { ...this.#option, locale });
  }

  #option(): Option {
    return {
      offsetMillisec: this.offsetMillisec(),
      timezone: this.timezone,
      locale: this.locale,
    };
  }
}
