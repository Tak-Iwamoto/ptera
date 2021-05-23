import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { UTCDateTime } from "./utc.ts";

Deno.test("UTCDateTime", () => {
  const tests = [
    { input: new UTCDateTime("2021-01-01T12:30:30.000Z").year, expected: 2021 },
    { input: new UTCDateTime("2021-01-01T12:30:30.000Z").month, expected: 1 },
    { input: new UTCDateTime("2021-01-01T12:30:30.000Z").day, expected: 1 },
    { input: new UTCDateTime("2021-01-01T12:30:30.000Z").hours, expected: 12 },
    {
      input: new UTCDateTime("2021-01-01T12:30:30.000Z").minutes,
      expected: 30,
    },
    {
      input: new UTCDateTime("2021-01-01T12:30:30.000Z").seconds,
      expected: 30,
    },
    {
      input: new UTCDateTime("2021-01-01T12:30:30.000Z").milliseconds,
      expected: 0,
    },
  ];
  tests.forEach((t) => {
    assertEquals(t.input, t.expected);
  });
});
