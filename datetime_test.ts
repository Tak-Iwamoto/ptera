import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { Datetime } from "./datetime.ts";
import { MILLISECONDS_IN_HOUR } from "./constants.ts";
import { Timezone } from "./types.ts";

Deno.test("isValidZone", () => {
  const tests = [
    { input: "Asia/Tokyo", expected: true },
    { input: "Fantasia/Castle", expected: false },
    { input: "America/New_York", expected: true },
    { input: "dummy", expected: false },
    { input: "Osaka", expected: false },
  ];

  tests.forEach((t) => {
    assertEquals(Datetime.isValidZone(t.input), t.expected);
  });
});

Deno.test("isValid", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1 }, expected: true },
    { input: { year: 2020, month: 2, day: 29 }, expected: true },
    { input: { year: 2021, month: 2, day: 29 }, expected: false },
    { input: { year: 2021, month: 4, day: 31 }, expected: false },
    { input: { year: 2021, month: 11, day: 31 }, expected: false },
  ];

  tests.forEach((t) => {
    assertEquals(new Datetime(t.input).isValid(), t.expected);
  });
});

Deno.test("toDateInfo", () => {
  const tests = [
    {
      stringInput: new Datetime("2021-01-01T12:30:30.000Z"),
      dateInfoInput: new Datetime({
        year: 2021,
        month: 1,
        day: 1,
        hours: 12,
        minutes: 30,
        seconds: 30,
        milliseconds: 0,
      }),
      expected: {
        year: 2021,
        month: 1,
        day: 1,
        hours: 12,
        minutes: 30,
        seconds: 30,
        milliseconds: 0,
      },
    },
  ];

  tests.forEach((t) => {
    assertEquals(t.stringInput.toDateInfo(), t.expected);
    assertEquals(t.dateInfoInput.toDateInfo(), t.expected);
  });
});

Deno.test("toUTC", () => {
  const tests = [
    {
      input: new Datetime("2021-01-01T12:30:30.000Z", {
        timezone: "Asia/Tokyo",
      }),
      expected: {
        year: 2021,
        month: 1,
        day: 1,
        hours: 3,
        minutes: 30,
        seconds: 30,
        milliseconds: 0,
      },
    },
    {
      input: new Datetime("2021-01-01T12:30:30.000Z", {
        timezone: "America/New_York",
      }),
      expected: {
        year: 2021,
        month: 1,
        day: 1,
        hours: 17,
        minutes: 30,
        seconds: 30,
        milliseconds: 0,
      },
    },
    {
      input: new Datetime("2021-05-15T12:30:30.000Z", {
        timezone: "America/New_York",
      }),
      expected: {
        year: 2021,
        month: 5,
        day: 15,
        hours: 16,
        minutes: 30,
        seconds: 30,
        milliseconds: 0,
      },
    },
    {
      input: new Datetime("2021-05-15T12:30:30.000Z", {
        timezone: "UTC",
      }),
      expected: {
        year: 2021,
        month: 5,
        day: 15,
        hours: 12,
        minutes: 30,
        seconds: 30,
        milliseconds: 0,
      },
    },
  ];

  tests.forEach((t) => {
    assertEquals(t.input.toUTC().toDateInfo(), t.expected);
  });
});

Deno.test("offset", () => {
  const tests = [
    {
      input: new Datetime("2021-01-01T12:30:30.000Z", {
        timezone: "Asia/Tokyo",
      })
        .offset,
      expected: 9,
    },
    {
      input: new Datetime("2021-01-01T12:30:30.000Z", {
        timezone: "America/New_York",
      })
        .offset,
      expected: -5,
    },
    {
      input: new Datetime("2021-05-15T12:30:30.000Z", {
        timezone: "America/New_York",
      })
        .offset,
      expected: -4,
    },
    {
      input: new Datetime("2021-05-15T12:30:30.000Z", {
        timezone: "America/New_York",
      })
        .offset,
      expected: -4,
    },
    {
      input: new Datetime("2021-05-15T12:30:30.000Z", { timezone: "UTC" })
        .offset,
      expected: 0,
    },
  ];

  tests.forEach((t) => {
    assertEquals(t.input / MILLISECONDS_IN_HOUR, t.expected);
  });
});

Deno.test("toZonedTime", () => {
  type Test = {
    input: Datetime;
    tz: Timezone;
    expected: Datetime;
  };
  const tests: Test[] = [
    {
      input: new Datetime("2021-01-01T12:30:30.000Z", {
        timezone: "Asia/Tokyo",
      }),
      tz: "America/New_York",
      expected: new Datetime("2020-12-31T22:30:30.000Z", {
        timezone: "America/New_York",
      }),
    },
    {
      input: new Datetime("2021-01-01T12:30:30.000Z", {
        timezone: "UTC",
      }),
      tz: "Asia/Tokyo",
      expected: new Datetime("2021-01-01T21:30:30.000Z", {
        timezone: "Asia/Tokyo",
      }),
    },
  ];

  tests.forEach((t) => {
    assertEquals(t.input.toZonedTime(t.tz).timezone, t.expected.timezone);
    assertEquals(
      t.input.toZonedTime(t.tz).toDateInfo(),
      t.expected.toDateInfo(),
    );
  });
});

Deno.test("toJSDate", () => {
  type Test = {
    input: Datetime;
    expected: Date;
  };
  const tests: Test[] = [
    {
      input: new Datetime("2021-01-01T12:30:30.000Z"),
      expected: new Date(Date.UTC(2021, 0, 1, 12, 30, 30, 0)),
    },
    {
      input: new Datetime("2021-05-15T21:30:30.000Z"),
      expected: new Date(Date.UTC(2021, 4, 15, 21, 30, 30, 0)),
    },
  ];

  tests.forEach((t) => {
    assertEquals(t.input.toJSDate(), t.expected);
  });
});

Deno.test("toISODate", () => {
  type Test = {
    input: Datetime;
    expected: string;
  };
  const tests: Test[] = [
    {
      input: new Datetime({
        year: 2021,
        month: 5,
        day: 15,
        hours: 12,
        minutes: 30,
        seconds: 30,
        milliseconds: 0,
      }),
      expected: "2021-05-15",
    },
    {
      input: new Datetime({
        year: 2021,
        month: 7,
        day: 21,
        hours: 12,
        minutes: 30,
        seconds: 30,
        milliseconds: 0,
      }),
      expected: "2021-07-21",
    },
  ];

  tests.forEach((t) => {
    assertEquals(t.input.toISODate(), t.expected);
  });
});

Deno.test("toISOWeekDate", () => {
  type Test = {
    input: Datetime;
    expected: string;
  };
  const tests: Test[] = [
    {
      input: new Datetime({
        year: 2021,
        month: 5,
        day: 15,
        hours: 12,
        minutes: 30,
        seconds: 30,
        milliseconds: 999,
      }),
      expected: "2021-W19-6",
    },
    {
      input: new Datetime({
        year: 2021,
        month: 7,
        day: 21,
        hours: 23,
        minutes: 0,
        seconds: 59,
        milliseconds: 0,
      }),
      expected: "2021-W29-3",
    },
    {
      input: new Datetime({
        year: 2021,
        month: 1,
        day: 1,
        hours: 23,
        minutes: 0,
        seconds: 59,
        milliseconds: 0,
      }),
      expected: "2021-W53-5",
    },
    {
      input: new Datetime({
        year: 2021,
        month: 12,
        day: 31,
        hours: 23,
        minutes: 0,
        seconds: 59,
        milliseconds: 0,
      }),
      expected: "2021-W52-5",
    },
  ];

  tests.forEach((t) => {
    assertEquals(t.input.toISOWeekDate(), t.expected);
  });
});

Deno.test("toISOTime", () => {
  type Test = {
    input: Datetime;
    expected: string;
  };
  const tests: Test[] = [
    {
      input: new Datetime({
        year: 2021,
        month: 5,
        day: 15,
        hours: 12,
        minutes: 30,
        seconds: 30,
        milliseconds: 999,
      }),
      expected: "12:30:30.999",
    },
    {
      input: new Datetime({
        year: 2021,
        month: 7,
        day: 21,
        hours: 23,
        minutes: 0,
        seconds: 59,
        milliseconds: 0,
      }),
      expected: "23:00:59.000",
    },
  ];

  tests.forEach((t) => {
    assertEquals(t.input.toISOTime(), t.expected);
  });
});

Deno.test("toISO", () => {
  type Test = {
    input: Datetime;
    expected: string;
  };
  const tests: Test[] = [
    {
      input: new Datetime({
        year: 2021,
        month: 5,
        day: 15,
        hours: 12,
        minutes: 30,
        seconds: 30,
        milliseconds: 999,
      }),
      expected: "2021-05-15T12:30:30.999Z",
    },
    {
      input: new Datetime({
        year: 2021,
        month: 7,
        day: 21,
        hours: 23,
        minutes: 0,
        seconds: 59,
        milliseconds: 0,
      }, { timezone: "Asia/Tokyo" }),
      expected: "2021-07-21T23:00:59.000+09:00",
    },
    {
      input: new Datetime({
        year: 2021,
        month: 7,
        day: 21,
        hours: 23,
        minutes: 0,
        seconds: 59,
        milliseconds: 0,
      }, { timezone: "America/New_York" }),
      expected: "2021-07-21T23:00:59.000-04:00",
    },
  ];

  tests.forEach((t) => {
    assertEquals(t.input.toISO(), t.expected);
  });
});

Deno.test("toDateArray", () => {
  const tests = [
    { input: "2021-07-21", expected: [2021, 7, 21, 0, 0, 0, 0] },
    { input: "2021-07-21T23:00:59", expected: [2021, 7, 21, 23, 0, 59, 0] },
    {
      input: "2021-07-21T23:15:59.999",
      expected: [2021, 7, 21, 23, 15, 59, 999],
    },
    {
      input: "2021-07-21T23:15:59.999Z",
      expected: [2021, 7, 21, 23, 15, 59, 999],
    },
    {
      input: "2021-07-21T23:00:59.000+09:00",
      expected: [2021, 7, 21, 23, 0, 59, 0],
    },
  ];
  tests.forEach((t) => {
    assertEquals(new Datetime(t.input).toDateArray(), t.expected);
  });
});

Deno.test("toTimestamp", () => {
  const tests = [
    {
      input: "2021-05-30T06:03:40",
      expected: 1622354620000,
    },
    { input: "2021-07-21T23:00:59", expected: 1626908459000 },
  ];
  tests.forEach((t) => {
    assertEquals(new Datetime(t.input).toTimestamp(), t.expected);
  });
});

Deno.test("dayOfYear", () => {
  const tests = [
    { input: "2021-01-01", expected: 1 },
    { input: "2021-02-23", expected: 54 },
    { input: "2021-12-31", expected: 365 },
    { input: "2020-12-31", expected: 366 },
  ];
  tests.forEach((t) => {
    assertEquals(new Datetime(t.input).dayOfYear(), t.expected);
  });
});

Deno.test("add", () => {
  const tests = [
    {
      initialDate: "2021-05-31T23:00:00",
      addDate: { year: 1 },
      expected: {
        year: 2022,
        month: 5,
        day: 31,
        hours: 23,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      },
    },
    {
      initialDate: "2021-05-31T23:00:00",
      addDate: { month: 1 },
      expected: {
        year: 2021,
        month: 6,
        day: 30,
        hours: 23,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      },
    },
    {
      initialDate: "2021-02-01T23:00:00",
      addDate: { hours: 1 },
      expected: {
        year: 2021,
        month: 2,
        day: 2,
        hours: 0,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      },
    },
    {
      initialDate: "2021-02-01T23:00:00",
      addDate: { minutes: 65 },
      expected: {
        year: 2021,
        month: 2,
        day: 2,
        hours: 0,
        minutes: 5,
        seconds: 0,
        milliseconds: 0,
      },
    },
  ];
  tests.forEach((t) => {
    assertEquals(
      new Datetime(t.initialDate).add(t.addDate).toDateInfo(),
      t.expected,
    );
  });
});

Deno.test("substract", () => {
  const tests = [
    {
      initialDate: "2021-02-01T23:00:00",
      subDate: { year: 20 },
      expected: {
        year: 2001,
        month: 2,
        day: 1,
        hours: 23,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      },
    },
    {
      initialDate: "2021-02-28T23:00:00",
      subDate: { month: 2 },
      expected: {
        year: 2020,
        month: 12,
        day: 28,
        hours: 23,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      },
    },
    {
      initialDate: "2021-02-01T23:00:00",
      subDate: { day: 1 },
      expected: {
        year: 2021,
        month: 1,
        day: 31,
        hours: 23,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      },
    },
  ];
  tests.forEach((t) => {
    assertEquals(
      new Datetime(t.initialDate).substract(t.subDate).toDateInfo(),
      t.expected,
    );
  });
});

Deno.test("diffInDays", () => {
  const tests = [
    {
      baseDate: "2021-02-01T23:00:00",
      compareDate: "2021-02-02T23:00:00",
      expected: 1,
    },
    {
      baseDate: "2021-02-01T23:00:00",
      compareDate: "2021-03-01T23:00:00",
      expected: 28,
    },
    {
      baseDate: "2021-01-01T23:00:00",
      compareDate: "2021-12-31T23:00:00",
      expected: 364,
    },
    {
      baseDate: "2020-01-01T23:00:00",
      compareDate: "2020-12-31T23:00:00",
      expected: 365,
    },
  ];
  tests.forEach((t) => {
    assertEquals(
      Datetime.diffInDays(
        new Datetime(t.baseDate),
        new Datetime(t.compareDate),
      ),
      t.expected,
    );
  });
});

Deno.test("diffInHours", () => {
  const tests = [
    {
      baseDate: "2021-02-01T23:00:00",
      compareDate: "2021-02-02T23:00:00",
      expected: 24,
    },
    {
      baseDate: "2021-02-01T00:00:00",
      compareDate: "2021-02-03T02:00:00",
      expected: 50,
    },
    {
      baseDate: "2021-01-01T00:00:00",
      compareDate: "2021-01-01T02:00:00",
      expected: 2,
    },
    {
      baseDate: "2021-01-01T00:00:00",
      compareDate: "2021-01-01T00:30:00",
      expected: 0,
    },
  ];
  tests.forEach((t) => {
    assertEquals(
      Datetime.diffInHours(
        new Datetime(t.baseDate),
        new Datetime(t.compareDate),
      ),
      t.expected,
    );
  });
});

Deno.test("diffInMin", () => {
  const tests = [
    {
      baseDate: "2021-02-01T23:00:00",
      compareDate: "2021-02-02T23:00:00",
      expected: 1440,
    },
    {
      baseDate: "2021-02-01T00:00:00",
      compareDate: "2021-02-01T02:30:00",
      expected: 150,
    },
    {
      baseDate: "2021-01-01T00:00:00",
      compareDate: "2021-01-01T00:30:59",
      expected: 30,
    },
    {
      baseDate: "2021-01-01T00:00:00",
      compareDate: "2021-01-01T02:30:30",
      expected: 150,
    },
  ];
  tests.forEach((t) => {
    assertEquals(
      Datetime.diffInMin(
        new Datetime(t.baseDate),
        new Datetime(t.compareDate),
      ),
      t.expected,
    );
  });
});

Deno.test("diffInSec", () => {
  const tests = [
    {
      baseDate: "2021-02-01T23:00:00",
      compareDate: "2021-02-01T23:00:50",
      expected: 50,
    },
    {
      baseDate: "2021-02-01T00:00:00",
      compareDate: "2021-02-01T00:30:00",
      expected: 1800,
    },
    {
      baseDate: "2021-01-01T00:00:00",
      compareDate: "2021-01-01T00:30:59",
      expected: 1859,
    },
  ];
  tests.forEach((t) => {
    assertEquals(
      Datetime.diffInSec(
        new Datetime(t.baseDate),
        new Datetime(t.compareDate),
      ),
      t.expected,
    );
  });
});

Deno.test("diffInMillisec", () => {
  const tests = [
    {
      baseDate: "2021-02-01T23:00:00",
      compareDate: "2021-02-01T23:00:50:999",
      expected: 50999,
    },
    {
      baseDate: "2021-02-01T00:00:00",
      compareDate: "2021-02-01T00:30:100",
      expected: 1810000,
    },
  ];
  tests.forEach((t) => {
    assertEquals(
      Datetime.diffInMillisec(
        new Datetime(t.baseDate),
        new Datetime(t.compareDate),
      ),
      t.expected,
    );
  });
});
