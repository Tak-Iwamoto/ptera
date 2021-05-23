import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { DD } from "./timezone.ts";
import { MILLISECONDS_IN_HOUR } from "./constants.ts";

Deno.test("TZ", () => {
  const tests = [
    {
      input: new DD("2021-01-01T12:30:30.000Z", { timezone: "Asia/Tokyo" })
        .offset(),
      expected: 9,
    },
    {
      input: new DD("2021-01-01T12:30:30.000Z", {
        timezone: "America/New_York",
      })
        .offset(),
      expected: -5,
    },
    {
      input: new DD("2021-05-15T12:30:30.000Z", {
        timezone: "America/New_York",
      })
        .offset(),
      expected: -4,
    },
    {
      input: new DD("2021-05-15T12:30:30.000Z", {
        timezone: "America/New_York",
      })
        .offset(),
      expected: -4,
    },
    {
      input: new DD("2021-05-15T12:30:30.000Z", { timezone: "UTC" })
        .offset(),
      expected: 0,
    },
  ];
  tests.forEach((t) => {
    assertEquals(t.input / MILLISECONDS_IN_HOUR, t.expected);
  });
});
