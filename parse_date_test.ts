import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { parseDateStr } from "./parse_date.ts";

Deno.test("parseDateStr", () => {
  const tests = [
    {
      dateStr: "2021-05-31 21:05:30",
      format: "YYYY-MM-dd HH:mm:ss",
      expected: {
        year: 2021,
        month: 5,
        day: 31,
        hours: 21,
        minutes: 5,
        seconds: 30,
        milliseconds: undefined,
        offset: undefined,
      },
    },
    {
      dateStr: "2021-05-31 09:30 AM",
      format: "YYYY-MM-dd hh:mm a",
      expected: {
        year: 2021,
        month: 5,
        day: 31,
        hours: 9,
        minutes: 30,
        seconds: undefined,
        milliseconds: undefined,
        offset: undefined,
      },
    },
    {
      dateStr: "2021-05-31 09:30 PM",
      format: "YYYY-MM-dd hh:mm a",
      expected: {
        year: 2021,
        month: 5,
        day: 31,
        hours: 21,
        minutes: 30,
        seconds: undefined,
        milliseconds: undefined,
        offset: undefined,
      },
    },
    {
      dateStr: "2021-05-31 09:30Z",
      format: "YYYY-MM-dd hh:mmZ",
      expected: {
        year: 2021,
        month: 5,
        day: 31,
        hours: 9,
        minutes: 30,
        seconds: undefined,
        milliseconds: undefined,
        offset: 0,
      },
    },
    {
      dateStr: "2021-05-31 09:30 +09:00",
      format: "YYYY-MM-dd hh:mm Z",
      expected: {
        year: 2021,
        month: 5,
        day: 31,
        hours: 9,
        minutes: 30,
        seconds: undefined,
        milliseconds: undefined,
        offset: 540,
      },
    },
    {
      dateStr: "2021-05-31 09:30 -09:00",
      format: "YYYY-MM-dd hh:mm Z",
      expected: {
        year: 2021,
        month: 5,
        day: 31,
        hours: 9,
        minutes: 30,
        seconds: undefined,
        milliseconds: undefined,
        offset: -540,
      },
    },
    {
      dateStr: "2021-1",
      format: "YYYY-D",
      expected: {
        year: 2021,
        month: 1,
        day: 1,
        hours: undefined,
        minutes: undefined,
        seconds: undefined,
        milliseconds: undefined,
        offset: undefined,
      },
    },
    {
      dateStr: "2021-365",
      format: "YYYY-D",
      expected: {
        year: 2021,
        month: 12,
        day: 31,
        hours: undefined,
        minutes: undefined,
        seconds: undefined,
        milliseconds: undefined,
        offset: undefined,
      },
    },
    {
      dateStr: "2021-365",
      format: "YYYY-DDD",
      expected: {
        year: 2021,
        month: 12,
        day: 31,
        hours: undefined,
        minutes: undefined,
        seconds: undefined,
        milliseconds: undefined,
        offset: undefined,
      },
    },
    // {
    //   dateStr: "2021-05-31 21:05:30",
    //   format: "dd-MM",
    //   expected: {
    //     year: undefined,
    //     month: undefined,
    //     day: undefined,
    //     hours: undefined,
    //     minutes: undefined,
    //     seconds: undefined,
    //     milliseconds: undefined,
    //     offset: undefined
    //   },
    // },
  ];
  tests.forEach((t) => {
    assertEquals(parseDateStr(t.dateStr, t.format), t.expected);
  });
});
