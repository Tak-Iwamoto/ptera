import { zonedTime } from "./zoned_time.ts";
import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { Timezone } from "./types.ts";

type Test = {
  date: Date;
  tz: Timezone;
  expected: string;
};

Deno.test("zonedTime", () => {
  const tests: Test[] = [
    {
      date: new Date("2021-05-13T12:15:30Z"),
      tz: "UTC",
      expected: "2021-05-13T12:15:30.000Z",
    },
    {
      date: new Date("2021-05-13T12:15:30Z"),
      tz: "Asia/Tokyo",
      expected: "2021-05-13T21:15:30.000Z",
    },
    {
      date: new Date("2021-05-13T12:15:30Z"),
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
    assertEquals(zonedTime(t.date, t.tz).toISOString(), t.expected);
  });
});
