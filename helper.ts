import { DateTime } from "./datetime.ts";
import { dateToWeekDay } from "./convert.ts";

export function isMonday(t: DateTime) {
  return dateToWeekDay(t.toDateInfo()) === 1;
}

export function isTuesday(t: DateTime) {
  return dateToWeekDay(t.toDateInfo()) === 2;
}

export function isWednesday(t: DateTime) {
  return dateToWeekDay(t.toDateInfo()) === 3;
}

export function isThursday(t: DateTime) {
  return dateToWeekDay(t.toDateInfo()) === 4;
}

export function isFriday(t: DateTime) {
  return dateToWeekDay(t.toDateInfo()) === 5;
}

export function isSaturday(t: DateTime) {
  return dateToWeekDay(t.toDateInfo()) === 6;
}

export function isSunday(t: DateTime) {
  return dateToWeekDay(t.toDateInfo()) === 7;
}
