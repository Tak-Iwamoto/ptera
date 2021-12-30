import { adjustedTS } from "./diff.ts";
import { formatDate, formatDateObj } from "./format.ts";
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
  dateToWeekDay,
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
    return tsToDate(date, { isLocal: true });
  }

  if (date instanceof Date) {
    return tsToDate(date.getTime(), { isLocal: true });
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

export function latestDateTime(datetimes: DateTime[]) {
  return datetimes.reduce((a, b) =>
    a.toUTC().toMilliseconds() > b.toUTC().toMilliseconds() ? a : b
  );
}

export function oldestDateTime(datetimes: DateTime[]) {
  return datetimes.reduce((a, b) =>
    a.toUTC().toMilliseconds() < b.toUTC().toMilliseconds() ? a : b
  );
}

type DiffOption = { showDecimal: boolean };

export function diffInMillisec(
  baseDate: DateTime,
  otherDate: DateTime,
): number {
  return Math.abs(
    baseDate.toUTC().toMilliseconds() - otherDate.toUTC().toMilliseconds(),
  );
}

export function diffInSec(baseDate: DateTime, otherDate: DateTime): number {
  return Math.floor(diffInMillisec(baseDate, otherDate) / 1000);
}

export function diffInMin(
  baseDate: DateTime,
  otherDate: DateTime,
  option: DiffOption = { showDecimal: false },
): number {
  const diff = diffInMillisec(baseDate, otherDate) / MILLISECONDS_IN_MINUTE;
  return option.showDecimal ? diff : Math.floor(diff);
}

export function diffInHours(
  baseDate: DateTime,
  otherDate: DateTime,
  option: DiffOption = { showDecimal: false },
): number {
  const diff = diffInMillisec(baseDate, otherDate) / MILLISECONDS_IN_HOUR;
  return option.showDecimal ? diff : Math.floor(diff);
}

export function diffInDays(
  baseDate: DateTime,
  otherDate: DateTime,
  option: DiffOption = { showDecimal: false },
): number {
  const diff = diffInMillisec(baseDate, otherDate) / MILLISECONDS_IN_DAY;
  return option.showDecimal ? diff : Math.floor(diff);
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
    this.timezone = option?.timezone ?? getLocalName();
    this.locale = option?.locale ?? "en";
    this.#localeClass = new Locale(this.locale);

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
  }

  static now(option?: Option): DateTime {
    const localTime = new DateTime(new Date().getTime(), option);
    if (option?.timezone) {
      return localTime.toZonedTime(option?.timezone).setOption(option);
    }

    return localTime;
  }

  toLocal(): DateTime {
    return this.toZonedTime(getLocalName());
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

  parse(
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
    } = parseDateStr(dateStr, formatStr, { locale: option?.locale ?? "en" });

    const tz = option?.timezone ?? getLocalName();
    return new DateTime({
      year,
      month,
      day,
      hour,
      minute,
      second,
      millisecond,
    }, { ...option, timezone: tz });
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
    return dateToJSDate(this.toUTC().toDateObj());
  }

  toArray(): DateArray {
    return dateToArray(this.toDateObj());
  }

  toMilliseconds(): number {
    return dateToTS(this.toUTC().toDateObj());
  }

  dayOfYear(): number {
    return dateToDayOfYear(this.toDateObj());
  }

  weeksInWeekYear(): number {
    return weeksInWeekYear(this.year);
  }

  weekDay(): number {
    return dateToWeekDay(this.toDateObj());
  }

  weekDayShort(): string {
    return formatDateObj(this.toDateObj(), "www", this.#option());
  }

  weekDayLong(): string {
    return formatDateObj(this.toDateObj(), "wwww", this.#option());
  }

  monthShort(): string {
    return formatDateObj(this.toDateObj(), "MMM", this.#option());
  }

  monthLong(): string {
    return formatDateObj(this.toDateObj(), "MMMM", this.#option());
  }

  quarter(): number {
    return Math.ceil(this.month / 3);
  }

  isBefore(otherDate?: DateTime): boolean {
    return otherDate
      ? this.toMilliseconds() < otherDate.toMilliseconds()
      : this.toMilliseconds() < new Date().getTime();
  }

  isAfter(otherDate?: DateTime): boolean {
    return otherDate
      ? this.toMilliseconds() > otherDate.toMilliseconds()
      : this.toMilliseconds() > new Date().getTime();
  }

  isBetween(startDate: DateTime, endDate: DateTime): boolean {
    return this.toMilliseconds() >= startDate.toMilliseconds() &&
      this.toMilliseconds() <= endDate.toMilliseconds();
  }

  isLeapYear(): boolean {
    return isLeapYear(this.year);
  }

  startOfYear(): DateTime {
    return datetime({
      ...this.toDateObj(),
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    }, this.#option());
  }

  startOfMonth(): DateTime {
    return datetime({
      ...this.toDateObj(),
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    }, this.#option());
  }

  startOfDay(): DateTime {
    return datetime({
      ...this.toDateObj(),
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    }, this.#option());
  }

  startOfHour(): DateTime {
    return datetime({
      ...this.toDateObj(),
      minute: 0,
      second: 0,
      millisecond: 0,
    }, this.#option());
  }

  startOfMinute(): DateTime {
    return datetime({
      ...this.toDateObj(),
      second: 0,
      millisecond: 0,
    }, this.#option());
  }

  startOfSecond(): DateTime {
    return datetime({
      ...this.toDateObj(),
      millisecond: 0,
    }, this.#option());
  }

  startOfQuarter(): DateTime {
    return datetime({
      ...this.toDateObj(),
      month: 1 + (this.quarter() - 1) * 3,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    }, this.#option());
  }

  endOfYear(): DateTime {
    return datetime({
      ...this.toDateObj(),
      month: 12,
      day: 31,
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 999,
    }, this.#option());
  }

  endOfMonth(): DateTime {
    const dateObj = this.toDateObj();
    return datetime({
      ...dateObj,
      day: daysInMonth(dateObj.year, dateObj.month),
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 999,
    }, this.#option());
  }

  endOfDay(): DateTime {
    return datetime({
      ...this.toDateObj(),
      hour: 23,
      minute: 59,
      second: 59,
      millisecond: 999,
    }, this.#option());
  }

  endOfHour(): DateTime {
    return datetime({
      ...this.toDateObj(),
      minute: 59,
      second: 59,
      millisecond: 999,
    }, this.#option());
  }

  endOfMinute(): DateTime {
    return datetime({
      ...this.toDateObj(),
      second: 59,
      millisecond: 999,
    }, this.#option());
  }

  endOfSecond(): DateTime {
    return datetime({
      ...this.toDateObj(),
      millisecond: 999,
    }, this.#option());
  }

  endOfQuarter(): DateTime {
    const month = 3 * this.quarter();
    const dateObj = this.toDateObj();
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

  add(diff: DateDiff): DateTime {
    return datetime(
      adjustedTS(this.toUTC().toDateObj(), diff, { positive: true }),
      this.#option(),
    );
  }

  subtract(diff: DateDiff): DateTime {
    return datetime(
      adjustedTS(this.toUTC().toDateObj(), diff, {
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
