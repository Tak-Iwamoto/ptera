import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { format } from "./format.ts";

Deno.test("format: YY", () => {
  const formatted = format(new Date(2021, 1, 1), "YY");
  assertEquals(formatted, "21");
});

Deno.test("format: YYYY", () => {
  const formatted = format(new Date(2021, 1, 1), "YYYY");
  assertEquals(formatted, "2021");
});

Deno.test("format: M", () => {
  const Jan = format(new Date(2021, 1, 1), "M");
  const Sep = format(new Date(2021, 9, 1), "M");
  const Dec = format(new Date(2021, 12, 1), "M");
  assertEquals(Jan, "1");
  assertEquals(Sep, "9");
  assertEquals(Dec, "12");
});

Deno.test("format: MM", () => {
  const Jan = format(new Date(2021, 1, 1), "MM");
  const Sep = format(new Date(2021, 9, 1), "MM");
  const Dec = format(new Date(2021, 12, 1), "MM");
  assertEquals(Jan, "01");
  assertEquals(Sep, "09");
  assertEquals(Dec, "12");
});

Deno.test("format: MMM", () => {
  const Jan = format(new Date(2021, 1, 1), "MMM");
  const Sep = format(new Date(2021, 9, 1), "MMM");
  const Dec = format(new Date(2021, 12, 1), "MMM");
  assertEquals(Jan, "Jan");
  assertEquals(Sep, "Sep");
  assertEquals(Dec, "Dec");
});

Deno.test("format: MMMM", () => {
  const Jan = format(new Date(2021, 1, 1), "MMMM");
  const Sep = format(new Date(2021, 9, 1), "MMMM");
  const Dec = format(new Date(2021, 12, 1), "MMMM");
  assertEquals(Jan, "January");
  assertEquals(Sep, "September");
  assertEquals(Dec, "December");
});

Deno.test("format: d", () => {
  const one = format(new Date(2021, 0, 1, 15), "d");
  const fifteen = format(new Date(2021, 8, 15, 15), "d");
  assertEquals(one, "1");
  assertEquals(fifteen, "15");
});

Deno.test("format: dd", () => {
  const one = format(new Date(2021, 0, 1, 15), "dd");
  const fifteen = format(new Date(2021, 9, 15, 15), "dd");
  assertEquals(one, "01");
  assertEquals(fifteen, "15");
});

Deno.test("format: D", () => {
  const first = format(new Date(2021, 0, 1, 15), "D");
  const last = format(new Date(2021, 11, 31, 15), "D");
  assertEquals(first, "1");
  assertEquals(last, "365");
});

Deno.test("format: DD", () => {
  const first = format(new Date(2021, 0, 1, 15), "DD");
  const last = format(new Date(2021, 11, 31, 15), "DD");
  assertEquals(first, "01");
  assertEquals(last, "365");
});

// utcで計算されるので日本時間から9時間引いたものが結果になっている
// TODO: 後で直す
// getTimezoneOffset()を使用してnormalizeする
Deno.test("format: H", () => {
  assertEquals(format(new Date(2021, 1, 1, 15), "H"), "6");
  assertEquals(format(new Date(2021, 1, 1, 9), "H"), "0");
  assertEquals(format(new Date(2021, 1, 1, 21), "H"), "12");
  assertEquals(format(new Date(2021, 1, 1, 23), "H"), "14");
});

Deno.test("format: HH", () => {
  assertEquals(format(new Date(2021, 1, 1, 15), "HH"), "06");
  assertEquals(format(new Date(2021, 1, 1, 9), "HH"), "00");
  assertEquals(format(new Date(2021, 1, 1, 21), "HH"), "12");
  assertEquals(format(new Date(2021, 1, 1, 23), "H"), "14");
});

Deno.test("format: h", () => {
  assertEquals(format(new Date(2021, 1, 1, 15), "h"), "6");
  assertEquals(format(new Date(2021, 1, 1, 9), "h"), "12");
  assertEquals(format(new Date(2021, 1, 1, 21), "h"), "12");
  assertEquals(format(new Date(2021, 1, 1, 23), "h"), "2");
});

Deno.test("format: hh", () => {
  assertEquals(format(new Date(2021, 1, 1, 15), "hh"), "06");
  assertEquals(format(new Date(2021, 1, 1, 9), "hh"), "12");
  assertEquals(format(new Date(2021, 1, 1, 21), "hh"), "12");
  assertEquals(format(new Date(2021, 1, 1, 23), "hh"), "02");
});

Deno.test("format: m", () => {
  assertEquals(format(new Date(2021, 1, 1, 9, 0), "m"), "0");
  assertEquals(format(new Date(2021, 1, 1, 9, 1), "m"), "1");
  assertEquals(format(new Date(2021, 1, 1, 9, 10), "m"), "10");
  assertEquals(format(new Date(2021, 1, 1, 9, 59), "m"), "59");
});

Deno.test("format: mm", () => {
  assertEquals(format(new Date(2021, 1, 1, 9, 0), "mm"), "00");
  assertEquals(format(new Date(2021, 1, 1, 9, 1), "mm"), "01");
  assertEquals(format(new Date(2021, 1, 1, 9, 10), "mm"), "10");
  assertEquals(format(new Date(2021, 1, 1, 9, 59), "mm"), "59");
});

Deno.test("format: a", () => {
  assertEquals(format(new Date(2021, 1, 1, 15), "a"), "AM");
  assertEquals(format(new Date(2021, 1, 1, 9), "a"), "AM");
  assertEquals(format(new Date(2021, 1, 1, 21), "a"), "AM");
  assertEquals(format(new Date(2021, 1, 1, 23), "a"), "PM");
});

// Deno.test("format: WWW", () => {
//   const Sun = format(new Date(2021, 5, 9, 15), "WWW")
//   const Sat = format(new Date(2021, 1, 2, 15), "WWW")
//   assertEquals(Sun, "Sun")
//   assertEquals(Sat, "Sat")
// })

// Deno.test("format: WWWW", () => {
//   const Sun = format(new Date(2021, 5, 9), "WWWW")
//   const Sat = format(new Date(2021, 1, 2), "WWWW")
//   assertEquals(Sun, "Sunday")
//   assertEquals(Sat, "Saturday")
// })
