import { millisecondsOffset } from "./offset.ts";
import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts"

const MILLISECONDS_IN_HOUR = 3600000

Deno.test('millisecondsOffset Asia/Tokyo', () => {
  const offset = millisecondsOffset(new Date('2021-05-13T12:15:30Z'), 'Asia/Tokyo')
  assertEquals(offset, 9 * MILLISECONDS_IN_HOUR)
})

Deno.test('millisecondsOffset UTC', () => {
  const offset = millisecondsOffset(new Date('2021-05-13T12:15:30Z'), 'UTC')
  assertEquals(offset, 0)
})

Deno.test('millisecondsOffset America/New_York DST', () => {
  const offset = millisecondsOffset(new Date('2021-05-13T12:15:30Z'), 'America/New_York')
  assertEquals(offset, - (4 * MILLISECONDS_IN_HOUR))
})

Deno.test('millisecondsOffset America/New_York', () => {
  const offset = millisecondsOffset(new Date('2021-12-13T12:15:30Z'), 'America/New_York')
  assertEquals(offset, - (5 * MILLISECONDS_IN_HOUR))
})
