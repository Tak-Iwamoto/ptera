import { DateTime } from "./datetime.ts";
import { dateToWeekDay } from "./convert.ts";

export function isMonday(t: DateTime) {
  return dateToWeekDay(t.toDateObj()) === 1;
}

export function isTuesday(t: DateTime) {
  return dateToWeekDay(t.toDateObj()) === 2;
}

export function isWednesday(t: DateTime) {
  return dateToWeekDay(t.toDateObj()) === 3;
}

export function isThursday(t: DateTime) {
  return dateToWeekDay(t.toDateObj()) === 4;
}

export function isFriday(t: DateTime) {
  return dateToWeekDay(t.toDateObj()) === 5;
}

export function isSaturday(t: DateTime) {
  return dateToWeekDay(t.toDateObj()) === 6;
}

export function isSunday(t: DateTime) {
  return dateToWeekDay(t.toDateObj()) === 7;
}
