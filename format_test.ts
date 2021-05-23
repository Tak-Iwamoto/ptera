import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { format, formatDate, parseFormat } from "./format.ts";
import { utcToLocalTime } from "./local_time.ts";

Deno.test("format: YY", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1 }, expected: "21" },
    {
      input: { year: 1900, month: 3, day: 1 },
      expected: "00",
    },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "YY"), t.expected);
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
    assertEquals(format(t.input, "YYYY"), t.expected);
  });
});

Deno.test("format: M", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1 }, expected: "1" },
    { input: { year: 2021, month: 8, day: 1 }, expected: "8" },
    { input: { year: 2021, month: 11, day: 15 }, expected: "11" },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "M"), t.expected);
  });
});

Deno.test("format: MM", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1 }, expected: "01" },
    { input: { year: 2021, month: 8, day: 1 }, expected: "08" },
    { input: { year: 2021, month: 11, day: 15 }, expected: "11" },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "MM"), t.expected);
  });
});

Deno.test("format: MMM", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1 }, expected: "Jan" },
    { input: { year: 2021, month: 8, day: 1 }, expected: "Aug" },
    { input: { year: 2021, month: 11, day: 15 }, expected: "Nov" },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "MMM"), t.expected);
  });
});

Deno.test("format: MMMM", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1 }, expected: "January" },
    { input: { year: 2021, month: 8, day: 1 }, expected: "August" },
    { input: { year: 2021, month: 11, day: 15 }, expected: "November" },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "MMMM"), t.expected);
  });
});

Deno.test("format: d", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1 }, expected: "1" },
    { input: { year: 2021, month: 11, day: 15 }, expected: "15" },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "d"), t.expected);
  });
});

Deno.test("format: dd", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1 }, expected: "01" },
    { input: { year: 2021, month: 11, day: 15 }, expected: "15" },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "dd"), t.expected);
  });
});

// Deno.test("format: D", () => {
//   const tests = [
//     { input: { year: 2021, month: 1, day: 1, hours: 21 }, expected: "1" },
//     { input: { year: 2021, month: 12, day: 31, hours: 21 }, expected: "365" },
//     { input: { year: 2020, month: 12, day: 31, hours: 21 }, expected: "366" },
//   ];
//   tests.forEach((t) => {
//     assertEquals(format(t.input, "D"), t.expected);
//   });
// });

// Deno.test("format: DD", () => {
//   const tests = [
//     { input: { year: 2021, month: 1, day: 1, hours: 21 }, expected: "01" },
//     { input: { year: 2021, month: 12, day: 31, hours: 21 }, expected: "365" },
//     { input: { year: 2020, month: 12, day: 31, hours: 21 }, expected: "366" },
//   ];
//   tests.forEach((t) => {
//     assertEquals(format(t.input, "DD"), t.expected);
//   });
// });

Deno.test("format: H", () => {
  const tests = [
    { input: { year: 2021, month: 1, day: 1, hours: 4 }, expected: "4" },
    { input: { year: 2021, month: 12, day: 31, hours: 9 }, expected: "9" },
    { input: { year: 2020, month: 12, day: 31, hours: 21 }, expected: "21" },
    { input: { year: 2020, month: 12, day: 31, hours: 23 }, expected: "23" },
  ];
  tests.forEach((t) => {
    assertEquals(format(t.input, "H"), t.expected);
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
    assertEquals(format(t.input, "HH"), t.expected);
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
    assertEquals(format(t.input, "h"), t.expected);
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
    assertEquals(format(t.input, "hh"), t.expected);
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
    assertEquals(format(t.input, "m"), t.expected);
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
    assertEquals(format(t.input, "mm"), t.expected);
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
    assertEquals(format(t.input, "a"), t.expected);
  });
});

// Deno.test("format: WWW", () => {
//   const tests = [
//     { input: { year: 2021, month: 1, day: 2}, expected: "Sat" },
//   ];
//   tests.forEach((t) => {
//     assertEquals(format(t.input, "WWW"), t.expected);
//   });
// });

// Deno.test("format: WWWW", () => {
//   const tests = [
//     { input: utcToLocalTime(new Date(2021, 0, 2)), expected: "Saturday" },
//     { input: utcToLocalTime(new Date(2021, 0, 3)), expected: "Sunday" },
//     { input: utcToLocalTime(new Date(2021, 4, 3)), expected: "Monday" },
//     { input: utcToLocalTime(new Date(2021, 4, 7)), expected: "Friday" },
//   ];
//   tests.forEach((t) => {
//     assertEquals(format(t.input, "WWWW"), t.expected);
//   });
// });

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
  const dateInfo = { year: 2021, month: 6, day: 1, hours: 9 };
  const result = formatDate(dateInfo, "MMMM YYYY");
  assertEquals(result, "June 2021");
});
