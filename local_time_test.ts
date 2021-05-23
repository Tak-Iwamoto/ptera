import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { utcToLocalTime } from "./local_time.ts";

Deno.test("utcToLocalTime", () => {
  const tests = [
    {
      input: new Date(2021, 0, 1, 12, 30, 30),
      expected: "2021-01-01T12:30:30.000Z",
    },
  ];
  tests.forEach((t) => {
    assertEquals(utcToLocalTime(t.input).toISOString(), t.expected);
  });
});
