import {
  assertEquals,
} from "https://deno.land/std@0.95.0/testing/asserts.ts"
import { format } from "./format.ts"

Deno.test("format: YY", () => {
  const formatted = format(new Date(2021, 1, 1), "YY")
  assertEquals(formatted, "21")
})


Deno.test("format: YYYY", () => {
  const formatted = format(new Date(2021, 1, 1), "YYYY")
  assertEquals(formatted, "2021")
})

Deno.test("format: M", () => {
  const Jan = format(new Date(2021, 1, 1), "M")
  const Sep = format(new Date(2021, 9, 1), "M")
  const Dec = format(new Date(2021, 12, 1), "M")
  assertEquals(Jan, "1")
  assertEquals(Sep, "9")
  assertEquals(Dec, "12")
})

Deno.test("format: MM", () => {
  const Jan = format(new Date(2021, 1, 1), "MM")
  const Sep = format(new Date(2021, 9, 1), "MM")
  const Dec = format(new Date(2021, 12, 1), "MM")
  assertEquals(Jan, "01")
  assertEquals(Sep, "09")
  assertEquals(Dec, "12")
})