import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { parseDateStr } from "./parse_date.ts";
import { INVALID_DATE } from "./utils.ts";

Deno.test("parseDateStr valid", () => {
  const tests = [
    {
      dateStr: "20210531",
      format: "YYYYMMdd",
      expected: {
        year: 2021,
        month: 5,
        day: 31,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        offsetMillisec: 0,
      },
    },
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
        milliseconds: 0,
        offsetMillisec: 0,
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
        seconds: 0,
        milliseconds: 0,
        offsetMillisec: 0,
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
        seconds: 0,
        milliseconds: 0,
        offsetMillisec: 0,
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
        seconds: 0,
        milliseconds: 0,
        offsetMillisec: 0,
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
        seconds: 0,
        milliseconds: 0,
        offsetMillisec: 32400000,
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
        seconds: 0,
        milliseconds: 0,
        offsetMillisec: -32400000,
      },
    },
    {
      dateStr: "2021-1",
      format: "YYYY-D",
      expected: {
        year: 2021,
        month: 1,
        day: 1,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        offsetMillisec: 0,
      },
    },
    {
      dateStr: "2021-365",
      format: "YYYY-D",
      expected: {
        year: 2021,
        month: 12,
        day: 31,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        offsetMillisec: 0,
      },
    },
    {
      dateStr: "2021-365",
      format: "YYYY-DDD",
      expected: {
        year: 2021,
        month: 12,
        day: 31,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        offsetMillisec: 0,
      },
    },
    {
      dateStr: "2021 January",
      format: "YYYY MMMM",
      expected: {
        year: 2021,
        month: 1,
        day: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        offsetMillisec: 0,
      },
    },
    {
      dateStr: "2021 Jan",
      format: "YYYY MMM",
      expected: {
        year: 2021,
        month: 1,
        day: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        offsetMillisec: 0,
      },
    },
    {
      dateStr: "2021-06-20 01:02:03.004 AM +01:00",
      format: "YYYY-MM-dd HH:mm:ss.S a Z",
      expected: {
        year: 2021,
        month: 6,
        day: 20,
        hours: 1,
        minutes: 2,
        seconds: 3,
        milliseconds: 4,
        offsetMillisec: 3600000,
      },
    },
    {
      dateStr: "5/Aug/2021:14:15:30 +0900",
      format: "d/MMM/YYYY:HH:mm:ss ZZ",
      expected: {
        year: 2021,
        month: 8,
        day: 5,
        hours: 14,
        minutes: 15,
        seconds: 30,
        milliseconds: 0,
        offsetMillisec: 32400000,
      },
    },
    {
      dateStr: "1.1.2021 1:2:3:4 PM -0100",
      format: "d/M/YYYY H:m:s:S a ZZ",
      expected: {
        year: 2021,
        month: 1,
        day: 1,
        hours: 13,
        minutes: 2,
        seconds: 3,
        milliseconds: 4,
        offsetMillisec: -3600000,
      },
    },
    {
      dateStr: "23_Jan_2021_141523",
      format: "dd_MMM_YYYY_hhmmss",
      expected: {
        year: 2021,
        month: 1,
        day: 23,
        hours: 14,
        minutes: 15,
        seconds: 23,
        milliseconds: 0,
        offsetMillisec: 0,
      },
    },
  ];
  tests.forEach((t) => {
    assertEquals(parseDateStr(t.dateStr, t.format), t.expected);
  });
});

Deno.test("parseDateStr invalid", () => {
  const tests = [
    {
      dateStr: "21-04-2021",
      format: "YYYY-MM-dd",
    },
    {
      dateStr: "21/04/2021",
      format: "YYYY-MM-dd",
    },
    {
      dateStr: "2021 Jan",
      format: "YY DDD",
    },
    {
      dateStr: "2021 Turnip 03",
      format: "YYYY MMMM DD",
    },
    {
      dateStr: "2021-18-03-01",
      format: "YYYY-MM-dd",
    },
    {
      dateStr: "2021-01-32",
      format: "YYYY-MM-dd",
    },
  ];
  tests.forEach((t) => {
    assertEquals(parseDateStr(t.dateStr, t.format), INVALID_DATE);
  });
});

Deno.test("parseDateStr locale", () => {
  const tests = [
    {
      dateStr: "2021 1月",
      format: "YYYY MMM",
      locale: "ja",
      expected: {
        year: 2021,
        month: 1,
        day: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        offsetMillisec: 0,
      },
    },
    {
      dateStr: "2021 лютий 03",
      format: "YYYY MMMM dd",
      locale: "uk",
      expected: {
        year: 2021,
        month: 2,
        day: 3,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        offsetMillisec: 0,
      },
    },
  ];
  tests.forEach((t) => {
    assertEquals(
      parseDateStr(t.dateStr, t.format, { locale: t.locale }),
      t.expected,
    );
  });
});
