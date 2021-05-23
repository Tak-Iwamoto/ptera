export function utcTime(
  year: number,
  month: number,
  day?: number,
  hour?: number,
  minute?: number,
  second?: number,
  millisecond?: number,
): Date {
  const ts = Date.UTC(
    year,
    month - 1,
    day ?? 0,
    hour ?? 0,
    minute ?? 0,
    second ?? 0,
    millisecond ?? 0,
  );

  return new Date(ts);
}
