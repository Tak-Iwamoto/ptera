import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { formatDate, formatDateInfo, isoToDateInfo } from "./format.ts";
import { Locale } from "./locale.ts";
import { Config, DateInfo, Timezone } from "./types.ts";

const defaultLocale = new Locale("en");
Deno.test("format: YY", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1 }, expected: "21" },
    {
      input: { year: 1900, month: 3, day: 1 },
      expected: "00",
    },
  ];
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "YY", defaultLocale), t.expected);
  });
});

Deno.test("format: YYYY", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1 }, expected: "2021" },
    {
      input: { year: 1900, month: 3, day: 1 },
      expected: "1900",
    },
  ];
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "YYYY", defaultLocale), t.expected);
  });
});

Deno.test("format: M", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1 }, expected: "1" },
    { input: { year: 2021, month: 8, day: 1 }, expected: "8" },
    { input: { year: 2021, month: 11, day: 15 }, expected: "11" },
  ];
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "M", defaultLocale), t.expected);
  });
});

Deno.test("format: MM", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1 }, expected: "01" },
    { input: { year: 2021, month: 8, day: 1 }, expected: "08" },
    { input: { year: 2021, month: 11, day: 15 }, expected: "11" },
  ];
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "MM", defaultLocale), t.expected);
  });
});

Deno.test("format: MMM", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1 }, expected: "Jan" },
    { input: { year: 2021, month: 8, day: 1 }, expected: "Aug" },
    { input: { year: 2021, month: 11, day: 15 }, expected: "Nov" },
  ];
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "MMM", defaultLocale), t.expected);
  });
});

Deno.test("format: MMM jp", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1 }, expected: "1月" },
    { input: { year: 2021, month: 8, day: 1 }, expected: "8月" },
    { input: { year: 2021, month: 11, day: 15 }, expected: "11月" },
  ];
  const locale = new Locale("jp");
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "MMM", locale), t.expected);
  });
});

Deno.test("format: MMMM", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1 }, expected: "January" },
    { input: { year: 2021, month: 8, day: 1 }, expected: "August" },
    { input: { year: 2021, month: 11, day: 15 }, expected: "November" },
  ];
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "MMMM", defaultLocale), t.expected);
  });
});

Deno.test("format: MMMM jp", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1 }, expected: "1月" },
    { input: { year: 2021, month: 8, day: 1 }, expected: "8月" },
    { input: { year: 2021, month: 11, day: 15 }, expected: "11月" },
  ];
  const locale = new Locale("jp");
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "MMMM", locale), t.expected);
  });
});

Deno.test("format: d", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1 }, expected: "1" },
    { input: { year: 2021, month: 11, day: 15 }, expected: "15" },
  ];
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "d", defaultLocale), t.expected);
  });
});

Deno.test("format: dd", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1 }, expected: "01" },
    { input: { year: 2021, month: 11, day: 15 }, expected: "15" },
  ];
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "dd", defaultLocale), t.expected);
  });
});

Deno.test("format: D", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1, hours: 21 }, expected: "1" },
    { input: { year: 2021, month: 12, day: 31, hours: 21 }, expected: "365" },
    { input: { year: 2020, month: 12, day: 31, hours: 21 }, expected: "366" },
  ];
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "D", defaultLocale), t.expected);
  });
});

Deno.test("format: DDD", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1, hours: 0 }, expected: "001" },
    { input: { year: 2021, month: 2, day: 23, hours: 0 }, expected: "054" },
    { input: { year: 2021, month: 12, day: 31, hours: 21 }, expected: "365" },
    { input: { year: 2020, month: 12, day: 31, hours: 21 }, expected: "366" },
  ];
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "DDD", defaultLocale), t.expected);
  });
});

Deno.test("format: H", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1, hours: 4 }, expected: "4" },
    { input: { year: 2021, month: 12, day: 31, hours: 9 }, expected: "9" },
    { input: { year: 2020, month: 12, day: 31, hours: 21 }, expected: "21" },
    { input: { year: 2020, month: 12, day: 31, hours: 23 }, expected: "23" },
  ];
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "H", defaultLocale), t.expected);
  });
});

Deno.test("format: HH", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1, hours: 4 }, expected: "04" },
    { input: { year: 2021, month: 12, day: 31, hours: 9 }, expected: "09" },
    { input: { year: 2020, month: 12, day: 31, hours: 21 }, expected: "21" },
    { input: { year: 2020, month: 12, day: 31, hours: 23 }, expected: "23" },
  ];
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "HH", defaultLocale), t.expected);
  });
});

Deno.test("format: h", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1, hours: 4 }, expected: "4" },
    { input: { year: 2021, month: 12, day: 31, hours: 9 }, expected: "9" },
    { input: { year: 2020, month: 12, day: 31, hours: 21 }, expected: "9" },
    { input: { year: 2020, month: 12, day: 31, hours: 23 }, expected: "11" },
  ];
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "h", defaultLocale), t.expected);
  });
});

Deno.test("format: hh", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1, hours: 4 }, expected: "04" },
    { input: { year: 2021, month: 12, day: 31, hours: 9 }, expected: "09" },
    { input: { year: 2020, month: 12, day: 31, hours: 21 }, expected: "09" },
    { input: { year: 2020, month: 12, day: 31, hours: 23 }, expected: "11" },
  ];
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "hh", defaultLocale), t.expected);
  });
});

Deno.test("format: m", () => {
  const tests = [
    {
      input: { year: 2021, month: 1, day: 1, hours: 1, minutes: 0 },
      expected: "0",
    },
    {
      input: { year: 2021, month: 12, day: 31, hours: 1, minutes: 1 },
      expected: "1",
    },
    {
      input: { year: 2020, month: 12, day: 31, hours: 1, minutes: 10 },
      expected: "10",
    },
    {
      input: { year: 2020, month: 12, day: 31, hours: 1, minutes: 59 },
      expected: "59",
    },
  ];
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "m", defaultLocale), t.expected);
  });
});

Deno.test("format: mm", () => {
  const tests = [
    {
      input: { year: 2021, month: 1, day: 1, hours: 1, minutes: 0 },
      expected: "00",
    },
    {
      input: { year: 2021, month: 12, day: 31, hours: 1, minutes: 1 },
      expected: "01",
    },
    {
      input: { year: 2020, month: 12, day: 31, hours: 1, minutes: 10 },
      expected: "10",
    },
    {
      input: { year: 2020, month: 12, day: 31, hours: 1, minutes: 59 },
      expected: "59",
    },
  ];
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "mm", defaultLocale), t.expected);
  });
});

Deno.test("format: a", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1, hours: 4 }, expected: "AM" },
    { input: { year: 2021, month: 12, day: 31, hours: 12 }, expected: "AM" },
    { input: { year: 2020, month: 12, day: 31, hours: 13 }, expected: "PM" },
    { input: { year: 2020, month: 12, day: 31, hours: 23 }, expected: "PM" },
  ];
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "a", defaultLocale), t.expected);
  });
});

Deno.test("format: w", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 2 }, expected: "6" },
    { input: { year: 2021, month: 1, day: 3 }, expected: "7" },
    { input: { year: 2021, month: 5, day: 3 }, expected: "1" },
    { input: { year: 2021, month: 5, day: 7 }, expected: "5" },
  ];
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "w", defaultLocale), t.expected);
  });
});

Deno.test("format: www", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 2 }, expected: "Sat" },
    { input: { year: 2021, month: 1, day: 3 }, expected: "Sun" },
    { input: { year: 2021, month: 5, day: 3 }, expected: "Mon" },
    { input: { year: 2021, month: 5, day: 7 }, expected: "Fri" },
  ];
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "www", defaultLocale), t.expected);
  });
});

Deno.test("format: www jp", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 2 }, expected: "土" },
    { input: { year: 2021, month: 1, day: 3 }, expected: "日" },
    { input: { year: 2021, month: 5, day: 3 }, expected: "月" },
    { input: { year: 2021, month: 5, day: 7 }, expected: "金" },
  ];
  const locale = new Locale("jp");
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "www", locale), t.expected);
  });
});

Deno.test("format: wwww", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 2 }, expected: "Saturday" },
    { input: { year: 2021, month: 1, day: 3 }, expected: "Sunday" },
    { input: { year: 2021, month: 5, day: 3 }, expected: "Monday" },
    { input: { year: 2021, month: 5, day: 7 }, expected: "Friday" },
  ];
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "wwww", defaultLocale), t.expected);
  });
});

Deno.test("format: wwww jp", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 2 }, expected: "土曜日" },
    { input: { year: 2021, month: 1, day: 3 }, expected: "日曜日" },
    { input: { year: 2021, month: 5, day: 3 }, expected: "月曜日" },
    { input: { year: 2021, month: 5, day: 7 }, expected: "金曜日" },
  ];
  const locale = new Locale("jp");
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "wwww", locale), t.expected);
  });
});

Deno.test("format: W", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1 }, expected: "53" },
    { input: { year: 2021, month: 1, day: 4 }, expected: "1" },
    { input: { year: 2021, month: 5, day: 25 }, expected: "21" },
    { input: { year: 2021, month: 11, day: 4 }, expected: "44" },
    { input: { year: 2021, month: 12, day: 31 }, expected: "52" },
    { input: { year: 2020, month: 12, day: 31 }, expected: "53" },
  ];
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "W", defaultLocale), t.expected);
  });
});

Deno.test("format: WW", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1 }, expected: "53" },
    { input: { year: 2021, month: 1, day: 4 }, expected: "01" },
    { input: { year: 2021, month: 5, day: 25 }, expected: "21" },
    { input: { year: 2021, month: 11, day: 4 }, expected: "44" },
    { input: { year: 2021, month: 12, day: 31 }, expected: "52" },
    { input: { year: 2020, month: 12, day: 31 }, expected: "53" },
  ];
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "WW", defaultLocale), t.expected);
  });
});

Deno.test("format: X", () => {
  const tests = [
    {
      input: { year: 2021, month: 1, day: 1, hours: 13, minutes: 30 },
      expected: "1609507800",
    },
    { input: { year: 2021, month: 1, day: 4 }, expected: "1609718400" },
    { input: { year: 2021, month: 5, day: 25 }, expected: "1621900800" },
  ];
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "X", defaultLocale), t.expected);
  });
});

Deno.test("format: x", () => {
  const tests = [
    {
      input: { year: 2021, month: 1, day: 1, hours: 13, minutes: 30 },
      expected: "1609507800000",
    },
    { input: { year: 2021, month: 1, day: 4 }, expected: "1609718400000" },
    { input: { year: 2021, month: 5, day: 25 }, expected: "1621900800000" },
  ];
  tests.forEach((t) => {
    assertEquals(formatDateInfo(t.input, "x", defaultLocale), t.expected);
  });
});

Deno.test("format: z", () => {
  const tests = [
    {
      input: { year: 2021, month: 1, day: 1 },
      timezone: "Asia/Tokyo",
      expected: "Asia/Tokyo",
    },
    {
      input: { year: 2021, month: 1, day: 4 },
      timezone: "America/New_York",
      expected: "America/New_York",
    },
  ];
  tests.forEach((t) => {
    assertEquals(
      formatDateInfo(t.input, "z", { timezone: t.timezone as Timezone }),
      t.expected,
    );
  });
});

Deno.test("format: Z", () => {
  const tests = [
    {
      input: { year: 2021, month: 1, day: 1 },
      offset: 10800000,
      expected: "+03:00",
    },
    {
      input: { year: 2021, month: 1, day: 4 },
      offset: 19800000,
      expected: "+05:30",
    },
    {
      input: { year: 2021, month: 1, day: 4 },
      offset: -19800000,
      expected: "-05:30",
    },
  ];
  tests.forEach((t) => {
    assertEquals(
      formatDateInfo(t.input, "Z", { offsetMillisec: t.offset }),
      t.expected,
    );
  });
});

Deno.test("format: ZZ", () => {
  const tests = [
    {
      input: { year: 2021, month: 1, day: 1 },
      offset: 10800000,
      expected: "+0300",
    },
    {
      input: { year: 2021, month: 1, day: 4 },
      offset: 19800000,
      expected: "+0530",
    },
    {
      input: { year: 2021, month: 1, day: 4 },
      offset: -19800000,
      expected: "-0530",
    },
  ];
  tests.forEach((t) => {
    assertEquals(
      formatDateInfo(t.input, "ZZ", { offsetMillisec: t.offset }),
      t.expected,
    );
  });
});

Deno.test("formatDate", () => {
  type Test = {
    input: DateInfo;
    formatStr: string;
    config?: Config;
    expected: string;
  };
  const tests: Test[] = [
    {
      input: {
        year: 2021,
        month: 6,
        day: 1,
        hours: 9,
      },
      formatStr: "MMMM YYYY",
      config: undefined,
      expected: "June 2021",
    },
    {
      input: {
        year: 2021,
        month: 6,
        day: 1,
      },
      formatStr: "x YYYY",
      config: undefined,
      expected: "1622505600000 2021",
    },
    {
      input: {
        year: 2021,
        month: 6,
        day: 1,
      },
      formatStr: "z MMMM",
      config: { timezone: "Asia/Tokyo" },
      expected: "Asia/Tokyo June",
    },
  ];
  tests.forEach((t) => {
    assertEquals(
      formatDate(t.input, t.formatStr, t.config),
      t.expected,
    );
  });
});

Deno.test("isoToDateInfo", () => {
  type Test = {
    input: string;
    expected: DateInfo | undefined;
  };
  const tests: Test[] = [
    {
      input: "2021-05-25T09:08:34",
      expected: {
        year: 2021,
        month: 5,
        day: 25,
        hours: 9,
        minutes: 8,
        seconds: 34,
        milliseconds: undefined,
      },
    },
    {
      input: "2021-11-01T09:08:34.123",
      expected: {
        year: 2021,
        month: 11,
        day: 1,
        hours: 9,
        minutes: 8,
        seconds: 34,
        milliseconds: 123,
      },
    },
    {
      input: "2021-11-01T09:08:34Z",
      expected: {
        year: 2021,
        month: 11,
        day: 1,
        hours: 9,
        minutes: 8,
        seconds: 34,
        milliseconds: undefined,
      },
    },
    {
      input: "2021-11-01T09:08:34+09:00",
      expected: {
        year: 2021,
        month: 11,
        day: 1,
        hours: 9,
        minutes: 8,
        seconds: 34,
        milliseconds: undefined,
      },
    },
    {
      input: "2021-11-01T09:08:34-04:00",
      expected: {
        year: 2021,
        month: 11,
        day: 1,
        hours: 9,
        minutes: 8,
        seconds: 34,
        milliseconds: undefined,
      },
    },
    {
      input: "2021-150",
      expected: {
        year: 2021,
        month: 5,
        day: 30,
      },
    },
    {
      input: "2021-001",
      expected: {
        year: 2021,
        month: 1,
        day: 1,
      },
    },
    {
      input: "2021-366",
      expected: undefined,
    },
  ];

  tests.forEach((t) => {
    assertEquals(isoToDateInfo(t.input), t.expected);
  });
});
