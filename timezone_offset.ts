import { Timezone } from "./types.ts";
import { tzTokenizeDate } from "./tz_tokenize_date.ts";

export function tzOffset(date: Date, tz: Timezone): number {
  const tzDate = (tzTokenizeDate(date, tz));

  const { year, month, day, hour, minute, second } = tzDate;
  const utc = Date.UTC(year, month - 1, day, hour, minute, second);

  let asTS = date.getTime();
  const over = asTS % 1000;
  asTS -= over >= 0 ? over : 1000 + over;
  return utc - asTS;
}
