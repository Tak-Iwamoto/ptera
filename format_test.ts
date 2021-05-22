import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { format, formatDate, parseFormat } from "./format.ts";
import { getUtcTime } from "./utc_time.ts";

Deno.test("format: YY", () => {
  const tests = [{ input: getUtcTime(new Date(2021, 1, 1)), expected: "21" }, {
    input: getUtcTime(new Date(1900, 3, 1)),
    expected: "00",
  }];
  tests.forEach((t) => {
    assertEquals(format(t.input, "YY"), t.expected);
  });
});

Deno.test("format: YYYY", () => {
  const tests = [
    { input: getUtcTime(new Date(2021, 1, 1)), expected: "2021" },
    {
      input: getUtcTime(new Date(1900, 3, 1)),
      expected: "1900",
    },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "YYYY"), t.expected);
  });
});

Deno.test("format: M", () => {
  const tests = [
    { input: getUtcTime(new Date(2021, 0, 1)), expected: "1" },
    {
      input: getUtcTime(new Date(2021, 8, 1)),
      expected: "9",
    },
    {
      input: getUtcTime(new Date(2021, 11, 1)),
      expected: "12",
    },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "M"), t.expected);
  });
});

Deno.test("format: M", () => {
  const tests = [
    { input: getUtcTime(new Date(2021, 0, 1)), expected: "01" },
    {
      input: getUtcTime(new Date(2021, 8, 1)),
      expected: "09",
    },
    {
      input: getUtcTime(new Date(2021, 11, 1)),
      expected: "12",
    },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "MM"), t.expected);
  });
});

Deno.test("format: MMM", () => {
  const tests = [
    { input: getUtcTime(new Date(2021, 0, 1)), expected: "Jan" },
    {
      input: getUtcTime(new Date(2021, 8, 1)),
      expected: "Sep",
    },
    {
      input: getUtcTime(new Date(2021, 11, 1)),
      expected: "Dec",
    },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "MMM"), t.expected);
  });
});

Deno.test("format: MMMM", () => {
  const tests = [
    { input: getUtcTime(new Date(2021, 0, 1)), expected: "January" },
    {
      input: getUtcTime(new Date(2021, 8, 1)),
      expected: "September",
    },
    {
      input: getUtcTime(new Date(2021, 11, 1)),
      expected: "December",
    },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "MMMM"), t.expected);
  });
});

Deno.test("format: d", () => {
  const tests = [
    { input: getUtcTime(new Date(2021, 0, 1, 15)), expected: "1" },
    {
      input: getUtcTime(new Date(2021, 8, 15, 15)),
      expected: "15",
    },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "d"), t.expected);
  });
});

Deno.test("format: dd", () => {
  const tests = [
    { input: getUtcTime(new Date(2021, 0, 1, 15)), expected: "01" },
    {
      input: getUtcTime(new Date(2021, 8, 15, 15)),
      expected: "15",
    },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "dd"), t.expected);
  });
});

Deno.test("format: D", () => {
  const tests = [
    { input: getUtcTime(new Date(2021, 0, 1, 15)), expected: "1" },
    {
      input: getUtcTime(new Date(2021, 11, 31, 15)),
      expected: "365",
    },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "D"), t.expected);
  });
});

Deno.test("format: DD", () => {
  const tests = [
    { input: getUtcTime(new Date(2021, 0, 1, 15)), expected: "01" },
    {
      input: getUtcTime(new Date(2021, 11, 31, 15)),
      expected: "365",
    },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "DD"), t.expected);
  });
});

Deno.test("format: H", () => {
  const tests = [
    { input: getUtcTime(new Date(2021, 0, 1, 4)), expected: "4" },
    { input: getUtcTime(new Date(2021, 0, 1, 9)), expected: "9" },
    { input: getUtcTime(new Date(2021, 0, 1, 21)), expected: "21" },
    { input: getUtcTime(new Date(2021, 0, 1, 23)), expected: "23" },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "H"), t.expected);
  });
});

Deno.test("format: HH", () => {
  const tests = [
    { input: getUtcTime(new Date(2021, 0, 1, 4)), expected: "04" },
    { input: getUtcTime(new Date(2021, 0, 1, 9)), expected: "09" },
    { input: getUtcTime(new Date(2021, 0, 1, 21)), expected: "21" },
    { input: getUtcTime(new Date(2021, 0, 1, 23)), expected: "23" },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "HH"), t.expected);
  });
});

Deno.test("format: h", () => {
  const tests = [
    { input: getUtcTime(new Date(2021, 0, 1, 4)), expected: "4" },
    { input: getUtcTime(new Date(2021, 0, 1, 9)), expected: "9" },
    { input: getUtcTime(new Date(2021, 0, 1, 21)), expected: "9" },
    { input: getUtcTime(new Date(2021, 0, 1, 23)), expected: "11" },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "h"), t.expected);
  });
});

Deno.test("format: hh", () => {
  const tests = [
    { input: getUtcTime(new Date(2021, 0, 1, 4)), expected: "04" },
    { input: getUtcTime(new Date(2021, 0, 1, 9)), expected: "09" },
    { input: getUtcTime(new Date(2021, 0, 1, 21)), expected: "09" },
    { input: getUtcTime(new Date(2021, 0, 1, 23)), expected: "11" },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "hh"), t.expected);
  });
});

Deno.test("format: m", () => {
  const tests = [
    { input: getUtcTime(new Date(2021, 0, 1, 1, 0)), expected: "0" },
    { input: getUtcTime(new Date(2021, 0, 1, 1, 1)), expected: "1" },
    { input: getUtcTime(new Date(2021, 0, 1, 1, 10)), expected: "10" },
    { input: getUtcTime(new Date(2021, 0, 1, 1, 59)), expected: "59" },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "m"), t.expected);
  });
});

Deno.test("format: mm", () => {
  const tests = [
    { input: getUtcTime(new Date(2021, 0, 1, 1, 0)), expected: "00" },
    { input: getUtcTime(new Date(2021, 0, 1, 1, 1)), expected: "01" },
    { input: getUtcTime(new Date(2021, 0, 1, 1, 10)), expected: "10" },
    { input: getUtcTime(new Date(2021, 0, 1, 1, 59)), expected: "59" },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "mm"), t.expected);
  });
});

Deno.test("format: a", () => {
  const tests = [
    { input: getUtcTime(new Date(2021, 0, 1, 4)), expected: "AM" },
    { input: getUtcTime(new Date(2021, 0, 1, 12)), expected: "AM" },
    { input: getUtcTime(new Date(2021, 0, 1, 13)), expected: "PM" },
    { input: getUtcTime(new Date(2021, 0, 1, 23)), expected: "PM" },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "a"), t.expected);
  });
});

Deno.test("format: WWW", () => {
  const tests = [
    { input: getUtcTime(new Date(2021, 0, 2)), expected: "Sat" },
    { input: getUtcTime(new Date(2021, 0, 3)), expected: "Sun" },
    { input: getUtcTime(new Date(2021, 4, 3)), expected: "Mon" },
    { input: getUtcTime(new Date(2021, 4, 7)), expected: "Fri" },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "WWW"), t.expected);
  });
});

Deno.test("format: WWWW", () => {
  const tests = [
    { input: getUtcTime(new Date(2021, 0, 2)), expected: "Saturday" },
    { input: getUtcTime(new Date(2021, 0, 3)), expected: "Sunday" },
    { input: getUtcTime(new Date(2021, 4, 3)), expected: "Monday" },
    { input: getUtcTime(new Date(2021, 4, 7)), expected: "Friday" },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "WWWW"), t.expected);
  });
});

Deno.test("parseFormat 'MMMM yyyy'", () => {
  const result = parseFormat("MMMM yyyy");
  assertEquals(result, [{ value: "MMMM", isLiteral: false }, {
    value: " ",
    isLiteral: false,
  }, { value: "yyyy", isLiteral: false }]);
});

Deno.test("parseFormat 'hh 'aaa' WWW'", () => {
  const result = parseFormat("hh 'aaa' WWW");
  assertEquals(result, [
    { value: "hh", isLiteral: false },
    {
      value: " ",
      isLiteral: false,
    },
    { value: "aaa", isLiteral: true },
    { value: " ", isLiteral: false },
    { value: "WWW", isLiteral: false },
  ]);
});

Deno.test("formatDate MMMM yyyy", () => {
  const date = new Date("2021-06-01T09:00:00");
  const result = formatDate(date, "MMMM YYYY");
  assertEquals(result, "June 2021");
});
