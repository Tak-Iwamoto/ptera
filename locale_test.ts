import { assertEquals } from "https://deno.land/std@0.95.0/testing/asserts.ts";
import { Locale } from "./locale.ts";

Deno.test("meridiems", () => {
  const tests = [
    { input: "en", expected: ["AM", "PM"] },
    { input: "ja", expected: ["午前", "午後"] },
  ];

  tests.forEach((t) => {
    assertEquals(new Locale(t.input).meridiems(), t.expected);
  });
});

Deno.test("eras", () => {
  const tests = [
    { input: "en", expected: ["Before Christ", "Anno Domini"] },
    { input: "ja", expected: ["紀元前", "西暦"] },
  ];

  tests.forEach((t) => {
    assertEquals(new Locale(t.input).eras("long"), t.expected);
  });
});
