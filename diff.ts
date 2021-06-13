import { DateDiff, DateInfo } from "./types.ts";
import { daysInMonth, truncNumber } from "./utils.ts";
import { dateToTS } from "./convert.ts";

export function adjustedUnixTimeStamp(
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

  const sign = option.positive ? 1 : -1;

  const diffYear = diff.year && diff.quarter
    ? truncNumber(diff.year + diff.quarter * 3)
    : truncNumber(diff.year);
  const adjustedYear = baseYear + (sign * diffYear);

  const diffMonth = truncNumber(diff.month);
  const adjustedMonth = baseMonth + (sign * diffMonth);

  const diffDay = diff.day && diff.weeks
    ? truncNumber(diff.day + diff.weeks * 7)
    : truncNumber(diff.day);
  const diffHours = truncNumber(diff.hours);
  const diffMinutes = truncNumber(diff.minutes);
  const diffSeconds = truncNumber(diff.seconds);
  const diffMilliSeconds = truncNumber(diff.milliseconds);

  return dateToTS({
    year: adjustedYear,
    month: adjustedMonth,
    day: baseDay
      ? Math.min(baseDay, daysInMonth(adjustedYear, adjustedMonth)) +
        (sign * diffDay)
      : (sign * diffDay),
    hours: baseHours ? baseHours + (sign * diffHours) : (sign * diffHours),
    minutes: baseMinutes
      ? baseMinutes + (sign * diffMinutes)
      : (sign * diffMinutes),
    seconds: baseSeconds
      ? baseSeconds + (sign * diffSeconds)
      : (sign * diffSeconds),
    milliseconds: baseMilliseconds
      ? baseMilliseconds + (sign * diffMilliSeconds)
      : (sign * diffMilliSeconds),
  });
}
