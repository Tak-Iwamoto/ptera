import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { initDateTimeFormat } from "./date_time_format.ts";

Deno.test("dateTimeFormat: Asia/Tokyo", () => {
  assertEquals(
    initDateTimeFormat("Asia/Tokyo").format(
      new Date("2021-05-15T04:00:00.123Z"),
    ),
    "05/15/2021, 13:00:00",
  );
});

Deno.test("dateTimeFormat: America/NewYork", () => {
  assertEquals(
    initDateTimeFormat("America/New_York").format(
      new Date("2021-05-15T04:00:00.123Z"),
    ),
    "05/15/2021, 00:00:00",
  );
});
