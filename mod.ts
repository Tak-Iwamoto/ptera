import { DateArg, DateTime, DateTimeOption } from "./datetime.ts";
export { DateTime } from "./datetime.ts";
export type { TIMEZONE, Timezone } from "./types.ts";
export {
  MILLISECONDS_IN_DAY,
  MILLISECONDS_IN_HOUR,
  MILLISECONDS_IN_MINUTE,
} from "./constants.ts";

export function datetime(date?: DateArg, option?: DateTimeOption) {
  if (date) {
    return new DateTime(date, option);
  }
  return DateTime.now(option);
}
