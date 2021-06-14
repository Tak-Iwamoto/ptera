import { Time } from "./time.ts";
import { dateToWeekNumber } from "./convert.ts";

export function isMonday(t: Time) {
  return dateToWeekNumber(t.toDateInfo()) === 1;
}

export function isTuesday(t: Time) {
  return dateToWeekNumber(t.toDateInfo()) === 2;
}

export function isWednesday(t: Time) {
  return dateToWeekNumber(t.toDateInfo()) === 3;
}

export function isThursday(t: Time) {
  return dateToWeekNumber(t.toDateInfo()) === 4;
}

export function isFriday(t: Time) {
  return dateToWeekNumber(t.toDateInfo()) === 5;
}

export function isSaturday(t: Time) {
  return dateToWeekNumber(t.toDateInfo()) === 6;
}

export function isSunday(t: Time) {
  return dateToWeekNumber(t.toDateInfo()) === 7;
}
