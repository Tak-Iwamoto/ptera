import { zonedTime } from "./zoned_time.ts";
import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";

// Deno.test("zonedTime UTC", () => {
//   const zTime = zonedTime(new Date("2021-05-13T12:15:30Z"), "UTC");
//   assertEquals(zTime.toISOString(), '2021-05-13T12:15:30.000Z');
// });

Deno.test("zonedTime Asia/Tokyo", () => {
  const zTime = zonedTime(new Date("2021-05-13T12:15:30Z"), "Asia/Tokyo");
  assertEquals(zTime.toISOString(), '2021-05-13T21:15:30.000Z');
});

// Deno.test("zonedTime America/NewYork", () => {
//   const zTime = zonedTime("2021-05-13T12:15:30Z", "America/New_York");
//   assertEquals(zTime.toISOString(), '2021-05-13T07:15:30.000Z');
// });

// Deno.test("zonedTime America/Los_Angeles", () => {
//   const zTime = zonedTime(
//     new Date("Sun Nov 1 2020 06:45:00 GMT-0000 (Greenwich Mean Time)"),
//     "America/Los_Angeles",
//   );

//   assertEquals(zTime.toISOString(), "2020-10-31T23:45:00.000Z");
// });
