import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { parseDateStr, parseISO } from "./parse_date.ts";
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
        timezone: undefined,
        locale: "en",
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
        timezone: undefined,
        locale: "en",
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
        timezone: undefined,
        locale: "en",
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
        timezone: undefined,
        locale: "en",
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
        timezone: undefined,
        locale: "en",
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
        timezone: undefined,
        locale: "en",
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
        timezone: undefined,
        locale: "en",
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
        timezone: undefined,
        locale: "en",
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
        timezone: undefined,
        locale: "en",
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
        timezone: undefined,
        locale: "en",
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
        timezone: undefined,
        locale: "en",
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
        timezone: undefined,
        locale: "en",
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
        timezone: undefined,
        locale: "en",
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
        timezone: undefined,
        locale: "en",
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
        timezone: undefined,
        locale: "en",
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
        timezone: undefined,
        locale: "en",
      },
    },
    {
      dateStr: "20210112 Asia/Tokyo",
      format: "YYYYMMdd z",
      expected: {
        year: 2021,
        month: 1,
        day: 12,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        offsetMillisec: 0,
        timezone: "Asia/Tokyo",
        locale: "en",
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
        timezone: undefined,
        locale: "ja",
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
        timezone: undefined,
        locale: "uk",
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

Deno.test("parseISO", () => {
  const tests = [
    {
      dateStr: "2021",
      expected: {
        year: 2021,
        month: 0,
        day: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        offsetMillisec: 0,
        locale: "en",
        timezone: undefined,
      },
    },
    {
      dateStr: "202106",
      expected: {
        year: 2021,
        month: 6,
        day: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        offsetMillisec: 0,
        locale: "en",
        timezone: undefined,
      },
    },
    {
      dateStr: "2021-06",
      expected: {
        year: 2021,
        month: 6,
        day: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        offsetMillisec: 0,
        locale: "en",
        timezone: undefined,
      },
    },
    {
      dateStr: "2021-365",
      expected: {
        year: 2021,
        month: 12,
        day: 31,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        offsetMillisec: 0,
        locale: "en",
        timezone: undefined,
      },
    },
    {
      dateStr: "20210430",
      expected: {
        year: 2021,
        month: 4,
        day: 30,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        offsetMillisec: 0,
        locale: "en",
        timezone: undefined,
      },
    },
    {
      dateStr: "2021-001",
      expected: {
        year: 2021,
        month: 1,
        day: 1,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        offsetMillisec: 0,
        locale: "en",
        timezone: undefined,
      },
    },
    // length 10
    // {
    //   dateStr: "2021-W25-6",
    //   expected: {
    //     year: 2021,
    //     month: 6,
    //     day: 26,
    //     hours: 0,
    //     minutes: 0,
    //     seconds: 0,
    //     milliseconds: 0,
    //     offsetMillisec: 0,
    //     locale: 'en',
    //     timezone: undefined,
    //   },
    // },
    // length 12
    {
      dateStr: "2021-06-30T21",
      expected: {
        year: 2021,
        month: 6,
        day: 30,
        hours: 21,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
        offsetMillisec: 0,
        locale: "en",
        timezone: undefined,
      },
    },
    // length 15
    {
      dateStr: "2021-06-30T2115",
      expected: {
        year: 2021,
        month: 6,
        day: 30,
        hours: 21,
        minutes: 15,
        seconds: 0,
        milliseconds: 0,
        offsetMillisec: 0,
        locale: "en",
        timezone: undefined,
      },
    },
    // length 16
    {
      dateStr: "2021-06-30T21:15",
      expected: {
        year: 2021,
        month: 6,
        day: 30,
        hours: 21,
        minutes: 15,
        seconds: 0,
        milliseconds: 0,
        offsetMillisec: 0,
        locale: "en",
        timezone: undefined,
      },
    },
    // length 17
    {
      dateStr: "2021-06-30T211530",
      expected: {
        year: 2021,
        month: 6,
        day: 30,
        hours: 21,
        minutes: 15,
        seconds: 30,
        milliseconds: 0,
        offsetMillisec: 0,
        locale: "en",
        timezone: undefined,
      },
    },
    // length 19
    {
      dateStr: "2021-06-30T21:15:30",
      expected: {
        year: 2021,
        month: 6,
        day: 30,
        hours: 21,
        minutes: 15,
        seconds: 30,
        milliseconds: 0,
        offsetMillisec: 0,
        locale: "en",
        timezone: undefined,
      },
    },
    // length 21
    {
      dateStr: "2021-06-30T211530.200",
      expected: {
        year: 2021,
        month: 6,
        day: 30,
        hours: 21,
        minutes: 15,
        seconds: 30,
        milliseconds: 200,
        offsetMillisec: 0,
        locale: "en",
        timezone: undefined,
      },
    },
    // length 23
    {
      dateStr: "2021-06-30T21:15:30.200",
      expected: {
        year: 2021,
        month: 6,
        day: 30,
        hours: 21,
        minutes: 15,
        seconds: 30,
        milliseconds: 200,
        offsetMillisec: 0,
        locale: "en",
        timezone: undefined,
      },
    },
  ];
  tests.forEach((t) => {
    assertEquals(
      parseISO(t.dateStr),
      t.expected,
    );
  });
});
