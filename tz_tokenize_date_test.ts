import { tzTokenizeDate } from "./tz_tokenize_date.ts"
import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts"

Deno.test('tzTokenizeDate Asia/Tokyo', () => {
  const result = tzTokenizeDate(new Date('2021-05-13T12:15:30Z'), 'Asia/Tokyo')
  assertEquals(result, { year: 2021, month: 5, day: 13, hour: 21, minute: 15, second: 30 })
})

Deno.test('tzTokenizeDate UTC', () => {
  const result = tzTokenizeDate(new Date('2021-05-13T12:15:30Z'), 'UTC')
  assertEquals(result, { year: 2021, month: 5, day: 13, hour: 12, minute: 15, second: 30 })
})

Deno.test('tzTokenizeDate America/New_York', () => {
  const result = tzTokenizeDate(new Date('2021-05-13T12:15:30Z'), 'America/New_York')
  assertEquals(result, { year: 2021, month: 5, day: 13, hour: 8, minute: 15, second: 30 })
})