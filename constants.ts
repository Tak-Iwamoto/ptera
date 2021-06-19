export const MILLISECONDS_IN_DAY = 86400000;
export const MILLISECONDS_IN_HOUR = 3600000;
export const MILLISECONDS_IN_MINUTE = 60000;

export const dateFormatType = [
  "YY",
  "YYYY",
  "M",
  "MM",
  "MMM",
  "MMMM",
  "d",
  "dd",
  "D",
  "DDD",
  "H",
  "HH",
  "h",
  "hh",
  "m",
  "mm",
  "s",
  "ss",
  "S",
  "SSS",
  "w",
  "www",
  "wwww",
  "W",
  "WW",
  "a",
  "z",
  "Z",
  "ZZ",
  "X",
  "x",
] as const;

export type DateFormatType = typeof dateFormatType[number];

export function isFormatDateType(format: string): format is DateFormatType {
  return dateFormatType.includes(format as DateFormatType);
}
