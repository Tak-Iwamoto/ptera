import { tzOffset } from "./timezone_offset.ts";
import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { MILLISECONDS_IN_HOUR } from "./constants.ts";

Deno.test("tzOffset Asia/Tokyo", () => {
  const offset = tzOffset(
    new Date("2021-05-13T12:15:30Z"),
    "Asia/Tokyo",
  );
  assertEquals(offset, 9 * MILLISECONDS_IN_HOUR);
});

Deno.test("tzOffset UTC", () => {
  const offset = tzOffset(new Date("2021-05-13T12:15:30Z"), "UTC");
  assertEquals(offset, 0);
});

Deno.test("tzOffset America/New_York DST", () => {
  const offset = tzOffset(
    new Date("2021-05-13T12:15:30Z"),
    "America/New_York",
  );
  assertEquals(offset, -(4 * MILLISECONDS_IN_HOUR));
});

Deno.test("tzOffset America/New_York", () => {
  const offset = tzOffset(
    new Date("2021-12-13T12:15:30Z"),
    "America/New_York",
  );
  assertEquals(offset, -(5 * MILLISECONDS_IN_HOUR));
});
