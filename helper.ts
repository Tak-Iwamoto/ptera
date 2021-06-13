import { Datetime } from "./datetime.ts";
import { dateToWeekNumber } from "./convert.ts";

export function isMonday(dt: Datetime) {
  return dateToWeekNumber(dt.toDateInfo()) === 1;
}

export function isTuesday(dt: Datetime) {
  return dateToWeekNumber(dt.toDateInfo()) === 2;
}

export function isWednesday(dt: Datetime) {
  return dateToWeekNumber(dt.toDateInfo()) === 3;
}

export function isThursday(dt: Datetime) {
  return dateToWeekNumber(dt.toDateInfo()) === 4;
}

export function isFriday(dt: Datetime) {
  return dateToWeekNumber(dt.toDateInfo()) === 5;
}

export function isSaturday(dt: Datetime) {
  return dateToWeekNumber(dt.toDateInfo()) === 6;
}

export function isSunday(dt: Datetime) {
  return dateToWeekNumber(dt.toDateInfo()) === 7;
}
