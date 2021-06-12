import { Datetime } from "./datetime.ts";
import { dayOfWeek } from "./utils.ts";

export function isMonday(dt: Datetime) {
  return dayOfWeek(dt.toDateInfo()) === 1;
}

export function isTuesday(dt: Datetime) {
  return dayOfWeek(dt.toDateInfo()) === 2;
}

export function isWednesday(dt: Datetime) {
  return dayOfWeek(dt.toDateInfo()) === 3;
}

export function isThursday(dt: Datetime) {
  return dayOfWeek(dt.toDateInfo()) === 4;
}

export function isFriday(dt: Datetime) {
  return dayOfWeek(dt.toDateInfo()) === 5;
}

export function isSaturday(dt: Datetime) {
  return dayOfWeek(dt.toDateInfo()) === 6;
}

export function isSunday(dt: Datetime) {
  return dayOfWeek(dt.toDateInfo()) === 7;
}
