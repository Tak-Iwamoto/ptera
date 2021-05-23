import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { utcToLocalTime } from "./local_time.ts";

Deno.test("utcToLocalTime", () => {
  const tests = [
    {
      input: {
        year: 2021,
        month: 1,
        day: 1,
        hours: 12,
        minutes: 30,
        seconds: 30,
        milliseconds: 0,
      },
      expected: {
        year: 2021,
        month: 1,
        day: 1,
        hours: 21,
        minutes: 30,
        seconds: 30,
        milliseconds: 0,
      },
    },
  ];
  tests.forEach((t) => {
    assertEquals(utcToLocalTime(t.input), t.expected);
  });
});
