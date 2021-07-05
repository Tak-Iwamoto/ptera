import { DateDiff, DateObj } from "./types.ts";
import { daysInMonth, truncNumber } from "./utils.ts";
import { dateToTS } from "./convert.ts";

export function adjustedTS(
  baseDateObj: DateObj,
  diff: DateDiff,
  option: {
    positive: boolean;
  },
) {
  const {
    year: baseYear,
    month: baseMonth,
    day: baseDay,
    hour: basehour,
    minute: baseminute,
    second: basesecond,
    millisecond: baseMillisecond,
  } = baseDateObj;

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
  const diffhour = truncNumber(diff.hour);
  const diffminute = truncNumber(diff.minute);
  const diffsecond = truncNumber(diff.second);
  const diffMillisecond = truncNumber(diff.millisecond);

  return dateToTS({
    year: adjustedYear,
    month: adjustedMonth,
    day: baseDay
      ? Math.min(baseDay, daysInMonth(adjustedYear, adjustedMonth)) +
        (sign * diffDay)
      : (sign * diffDay),
    hour: basehour ? basehour + (sign * diffhour) : (sign * diffhour),
    minute: baseminute ? baseminute + (sign * diffminute) : (sign * diffminute),
    second: basesecond ? basesecond + (sign * diffsecond) : (sign * diffsecond),
    millisecond: baseMillisecond
      ? baseMillisecond + (sign * diffMillisecond)
      : (sign * diffMillisecond),
  });
}
