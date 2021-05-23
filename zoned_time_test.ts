import { utcToZonedTime, zonedTimeToUTC } from "./zoned_time.ts";
import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { DateInfo, Timezone } from "./types.ts";

type Test = {
  date: DateInfo;
  tz: Timezone;
  expected: DateInfo;
};

Deno.test("utcToZonedTime", () => {
  const tests: Test[] = [
    {
      date: {
        year: 2021,
        month: 5,
        day: 13,
        hours: 12,
        minutes: 15,
        seconds: 30,
        milliseconds: 0,
      },
      tz: "UTC",
      expected: {
        year: 2021,
        month: 5,
        day: 13,
        hours: 12,
        minutes: 15,
        seconds: 30,
        milliseconds: 0,
      },
    },
    {
      date: {
        year: 2021,
        month: 5,
        day: 13,
        hours: 12,
        minutes: 15,
        seconds: 30,
        milliseconds: 0,
      },
      tz: "Asia/Tokyo",
      expected: {
        year: 2021,
        month: 5,
        day: 13,
        hours: 21,
        minutes: 15,
        seconds: 30,
        milliseconds: 0,
      },
    },
    {
      date: {
        year: 2021,
        month: 5,
        day: 13,
        hours: 12,
        minutes: 15,
        seconds: 30,
        milliseconds: 0,
      },
      tz: "America/New_York",
      expected: {
        year: 2021,
        month: 5,
        day: 13,
        hours: 8,
        minutes: 15,
        seconds: 30,
        milliseconds: 0,
      },
    },
    {
      date: {
        year: 2021,
        month: 11,
        day: 13,
        hours: 12,
        minutes: 15,
        seconds: 30,
        milliseconds: 0,
      },
      tz: "America/New_York",
      expected: {
        year: 2021,
        month: 11,
        day: 13,
        hours: 7,
        minutes: 15,
        seconds: 30,
        milliseconds: 0,
      },
    },
  ];

  tests.forEach((t) => {
    assertEquals(utcToZonedTime(t.date, t.tz), t.expected);
  });
});

Deno.test("zonedTimeToUTC", () => {
  const tests: Test[] = [
    {
      date: {
        year: 2021,
        month: 5,
        day: 13,
        hours: 12,
        minutes: 15,
        seconds: 30,
        milliseconds: 0,
      },
      tz: "UTC",
      expected: {
        year: 2021,
        month: 5,
        day: 13,
        hours: 12,
        minutes: 15,
        seconds: 30,
        milliseconds: 0,
      },
    },
    {
      date: {
        year: 2021,
        month: 5,
        day: 13,
        hours: 21,
        minutes: 15,
        seconds: 30,
        milliseconds: 0,
      },
      tz: "Asia/Tokyo",
      expected: {
        year: 2021,
        month: 5,
        day: 13,
        hours: 12,
        minutes: 15,
        seconds: 30,
        milliseconds: 0,
      },
    },
    {
      date: {
        year: 2021,
        month: 5,
        day: 13,
        hours: 8,
        minutes: 15,
        seconds: 30,
        milliseconds: 0,
      },
      tz: "America/New_York",
      expected: {
        year: 2021,
        month: 5,
        day: 13,
        hours: 12,
        minutes: 15,
        seconds: 30,
        milliseconds: 0,
      },
    },
    {
      date: {
        year: 2021,
        month: 11,
        day: 13,
        hours: 7,
        minutes: 15,
        seconds: 30,
        milliseconds: 0,
      },
      tz: "America/New_York",
      expected: {
        year: 2021,
        month: 11,
        day: 13,
        hours: 12,
        minutes: 15,
        seconds: 30,
        milliseconds: 0,
      },
    },
  ];

  tests.forEach((t) => {
    assertEquals(zonedTimeToUTC(t.date, t.tz), t.expected);
  });
});
