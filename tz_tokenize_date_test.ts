import { tzTokenizeDate } from "./tz_tokenize_date.ts";
import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { Timezone } from "./types.ts";

type Test = {
  date: Date;
  tz: Timezone;
  expected: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
};

Deno.test("tzTokenizeDate", () => {
  const tests: Test[] = [{
    date: new Date("2021-05-13T12:15:30Z"),
    tz: "Asia/Tokyo",
    expected: {
      year: 2021,
      month: 5,
      day: 13,
      hour: 21,
      minute: 15,
      second: 30,
    },
  }, {
    date: new Date("2021-05-13T12:15:30Z"),
    tz: "UTC",
    expected: {
      year: 2021,
      month: 5,
      day: 13,
      hour: 12,
      minute: 15,
      second: 30,
    },
  }, {
    date: new Date("2021-05-13T12:15:30Z"),
    tz: "America/New_York",
    expected: {
      year: 2021,
      month: 5,
      day: 13,
      hour: 8,
      minute: 15,
      second: 30,
    },
  }, {
    date: new Date("2021-11-13T12:15:30Z"),
    tz: "America/New_York",
    expected: {
      year: 2021,
      month: 11,
      day: 13,
      hour: 7,
      minute: 15,
      second: 30,
    },
  }];
  tests.forEach((t) => {
    assertEquals(tzTokenizeDate(t.date, t.tz), t.expected);
  });
});
