import {
  diffOffset,
  toOtherZonedTime,
  utcToZonedTime,
  zonedTimeToUTC,
} from "./zoned_time.ts";
import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { DateObj, Timezone } from "./types.ts";
import { MILLISECONDS_IN_HOUR } from "./constants.ts";

Deno.test("utcToZonedTime", () => {
  type Test = {
    date: DateObj;
    tz: Timezone;
    expected: DateObj;
  };
  const tests: Test[] = [
    {
      date: {
        year: 2021,
        month: 5,
        day: 13,
        hour: 12,
        minute: 15,
        second: 30,
        millisecond: 0,
      },
      tz: "UTC",
      expected: {
        year: 2021,
        month: 5,
        day: 13,
        hour: 12,
        minute: 15,
        second: 30,
        millisecond: 0,
      },
    },
    {
      date: {
        year: 2021,
        month: 5,
        day: 13,
        hour: 12,
        minute: 15,
        second: 30,
        millisecond: 0,
      },
      tz: "Asia/Tokyo",
      expected: {
        year: 2021,
        month: 5,
        day: 13,
        hour: 21,
        minute: 15,
        second: 30,
        millisecond: 0,
      },
    },
    {
      date: {
        year: 2021,
        month: 5,
        day: 13,
        hour: 12,
        minute: 15,
        second: 30,
        millisecond: 0,
      },
      tz: "America/New_York",
      expected: {
        year: 2021,
        month: 5,
        day: 13,
        hour: 8,
        minute: 15,
        second: 30,
        millisecond: 0,
      },
    },
    {
      date: {
        year: 2021,
        month: 11,
        day: 13,
        hour: 12,
        minute: 15,
        second: 30,
        millisecond: 0,
      },
      tz: "America/New_York",
      expected: {
        year: 2021,
        month: 11,
        day: 13,
        hour: 7,
        minute: 15,
        second: 30,
        millisecond: 0,
      },
    },
  ];

  tests.forEach((t) => {
    assertEquals(utcToZonedTime(t.date, t.tz), t.expected);
  });
});

Deno.test("zonedTimeToUTC", () => {
  type Test = {
    date: DateObj;
    tz: Timezone;
    expected: DateObj;
  };

  const tests: Test[] = [
    {
      date: {
        year: 2021,
        month: 5,
        day: 13,
        hour: 12,
        minute: 15,
        second: 30,
        millisecond: 0,
      },
      tz: "UTC",
      expected: {
        year: 2021,
        month: 5,
        day: 13,
        hour: 12,
        minute: 15,
        second: 30,
        millisecond: 0,
      },
    },
    {
      date: {
        year: 2021,
        month: 5,
        day: 13,
        hour: 21,
        minute: 15,
        second: 30,
        millisecond: 0,
      },
      tz: "Asia/Tokyo",
      expected: {
        year: 2021,
        month: 5,
        day: 13,
        hour: 12,
        minute: 15,
        second: 30,
        millisecond: 0,
      },
    },
    {
      date: {
        year: 2021,
        month: 5,
        day: 13,
        hour: 8,
        minute: 15,
        second: 30,
        millisecond: 0,
      },
      tz: "America/New_York",
      expected: {
        year: 2021,
        month: 5,
        day: 13,
        hour: 12,
        minute: 15,
        second: 30,
        millisecond: 0,
      },
    },
    {
      date: {
        year: 2021,
        month: 11,
        day: 13,
        hour: 7,
        minute: 15,
        second: 30,
        millisecond: 0,
      },
      tz: "America/New_York",
      expected: {
        year: 2021,
        month: 11,
        day: 13,
        hour: 12,
        minute: 15,
        second: 30,
        millisecond: 0,
      },
    },
  ];

  tests.forEach((t) => {
    assertEquals(zonedTimeToUTC(t.date, t.tz), t.expected);
  });
});

Deno.test("diffOffset", () => {
  type Test = {
    date: DateObj;
    baseTZ: Timezone;
    compareTZ: Timezone;
    expected: number;
  };

  const tests: Test[] = [
    {
      date: {
        year: 2021,
        month: 5,
        day: 13,
        hour: 12,
        minute: 15,
        second: 30,
        millisecond: 0,
      },
      baseTZ: "UTC",
      compareTZ: "Asia/Tokyo",
      expected: -9,
    },
    {
      date: {
        year: 2021,
        month: 5,
        day: 13,
        hour: 12,
        minute: 15,
        second: 30,
        millisecond: 0,
      },
      baseTZ: "Asia/Tokyo",
      compareTZ: "America/New_York",
      expected: 13,
    },
  ];

  tests.forEach((t) => {
    assertEquals(
      diffOffset(t.date, t.baseTZ, t.compareTZ) / MILLISECONDS_IN_HOUR,
      t.expected,
    );
  });
});

Deno.test("toOtherZonedTime", () => {
  type Test = {
    date: DateObj;
    baseTZ: Timezone;
    compareTZ: Timezone;
    expected: DateObj;
  };

  const tests: Test[] = [
    {
      date: {
        year: 2021,
        month: 5,
        day: 13,
        hour: 12,
        minute: 15,
        second: 30,
        millisecond: 0,
      },
      baseTZ: "UTC",
      compareTZ: "Asia/Tokyo",
      expected: {
        year: 2021,
        month: 5,
        day: 13,
        hour: 21,
        minute: 15,
        second: 30,
        millisecond: 0,
      },
    },
    {
      date: {
        year: 2021,
        month: 5,
        day: 13,
        hour: 12,
        minute: 15,
        second: 30,
        millisecond: 0,
      },
      baseTZ: "Asia/Tokyo",
      compareTZ: "America/New_York",
      expected: {
        year: 2021,
        month: 5,
        day: 12,
        hour: 23,
        minute: 15,
        second: 30,
        millisecond: 0,
      },
    },
  ];

  tests.forEach((t) => {
    assertEquals(
      toOtherZonedTime(t.date, t.baseTZ, t.compareTZ),
      t.expected,
    );
  });
});
