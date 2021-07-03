import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { arrayToDate } from "./convert.ts";

Deno.test("arrayToDate", () => {
  const tests = [
    {
      input: [2021],
      expected: {
        year: 2021,
        month: 1,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      },
    },
    {
      input: [2021, 12],
      expected: {
        year: 2021,
        month: 12,
        day: 1,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      },
    },
    {
      input: [2021, 12, 15],
      expected: {
        year: 2021,
        month: 12,
        day: 15,
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      },
    },
    {
      input: [2021, 12, 15, 13],
      expected: {
        year: 2021,
        month: 12,
        day: 15,
        hour: 13,
        minute: 0,
        second: 0,
        millisecond: 0,
      },
    },
    {
      input: [2021, 12, 15, 13, 30],
      expected: {
        year: 2021,
        month: 12,
        day: 15,
        hour: 13,
        minute: 30,
        second: 0,
        millisecond: 0,
      },
    },
    {
      input: [2021, 12, 15, 13, 30, 40],
      expected: {
        year: 2021,
        month: 12,
        day: 15,
        hour: 13,
        minute: 30,
        second: 40,
        millisecond: 0,
      },
    },
    {
      input: [2021, 12, 15, 13, 30, 40, 10],
      expected: {
        year: 2021,
        month: 12,
        day: 15,
        hour: 13,
        minute: 30,
        second: 40,
        millisecond: 10,
      },
    },
    {
      input: [2021, 12, 15, 13, 30, 40, 10, 30],
      expected: {
        year: 2021,
        month: 12,
        day: 15,
        hour: 13,
        minute: 30,
        second: 40,
        millisecond: 10,
      },
    },
  ];

  tests.forEach((t) => {
    assertEquals(arrayToDate(t.input), t.expected);
  });
});
