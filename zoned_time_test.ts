import { utcToZonedTime } from "./zoned_time.ts";
import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { Timezone } from "./types.ts";
import { utcTime } from "./utc_time.ts";

type Test = {
  date: Date;
  tz: Timezone;
  expected: string;
};

Deno.test("utcToZonedTime", () => {
  const tests: Test[] = [
    {
      date: utcTime(2021, 5, 13, 12, 15, 30),
      tz: "UTC",
      expected: "2021-05-13T12:15:30.000Z",
    },
    {
      date: utcTime(2021, 5, 13, 12, 15, 30),
      tz: "Asia/Tokyo",
      expected: "2021-05-13T21:15:30.000Z",
    },
    {
      date: utcTime(2021, 5, 13, 12, 15, 30),
      tz: "America/New_York",
      expected: "2021-05-13T08:15:30.000Z",
    },
    {
      date: new Date("Sun Nov 1 2020 06:45:00 GMT-0000 (Greenwich Mean Time)"),
      tz: "America/Los_Angeles",
      expected: "2020-10-31T23:45:00.000Z",
    },
  ];

  tests.forEach((t) => {
    assertEquals(utcToZonedTime(t.date, t.tz).toISOString(), t.expected);
  });
});
