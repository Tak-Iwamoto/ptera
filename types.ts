export type DateObj = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
};

export type DateArray = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
];

export type DateDiff = Partial<DateObj> & {
  quarter?: number;
  weeks?: number;
};

export type Option = {
  timezone?: Timezone;
  offsetMillisec?: number;
  locale?: string;
};

export const TIMEZONE = [
  "Etc/GMT+12",
  "Etc/GMT+11",
  "Pacific/Honolulu",
  "America/Anchorage",
  "America/Santa_Isabel",
  "America/Los_Angeles",
  "America/Chihuahua",
  "America/Phoenix",
  "America/Denver",
  "America/Guatemala",
  "America/Chicago",
  "America/Regina",
  "America/Mexico_City",
  "America/Bogota",
  "America/Indiana/Indianapolis",
  "America/New_York",
  "America/Caracas",
  "America/Halifax",
  "America/Asuncion",
  "America/La_Paz",
  "America/Cuiaba",
  "America/Santiago",
  "America/St_Johns",
  "America/Sao_Paulo",
  "America/Godthab",
  "America/Cayenne",
  "America/Argentina/Buenos_Aires",
  "America/Montevideo",
  "Etc/GMT+2",
  "Atlantic/Cape_Verde",
  "Atlantic/Azores",
  "Africa/Casablanca",
  "Atlantic/Reykjavik",
  "Europe/London",
  "Etc/GMT",
  "Europe/Berlin",
  "Europe/Paris",
  "Africa/Lagos",
  "Europe/Budapest",
  "Europe/Warsaw",
  "Africa/Windhoek",
  "Europe/Istanbul",
  "Europe/Kiev",
  "Africa/Cairo",
  "Asia/Damascus",
  "Asia/Amman",
  "Africa/Johannesburg",
  "Asia/Jerusalem",
  "Asia/Beirut",
  "Asia/Baghdad",
  "Europe/Minsk",
  "Asia/Riyadh",
  "Africa/Nairobi",
  "Asia/Tehran",
  "Europe/Moscow",
  "Asia/Tbilisi",
  "Asia/Yerevan",
  "Asia/Dubai",
  "Asia/Baku",
  "Indian/Mauritius",
  "Asia/Kabul",
  "Asia/Tashkent",
  "Asia/Karachi",
  "Asia/Colombo",
  "Asia/Kolkata",
  "Asia/Kathmandu",
  "Asia/Almaty",
  "Asia/Dhaka",
  "Asia/Yekaterinburg",
  "Asia/Yangon",
  "Asia/Bangkok",
  "Asia/Novosibirsk",
  "Asia/Krasnoyarsk",
  "Asia/Ulaanbaatar",
  "Asia/Shanghai",
  "Australia/Perth",
  "Asia/Singapore",
  "Asia/Taipei",
  "Asia/Irkutsk",
  "Asia/Seoul",
  "Asia/Tokyo",
  "Australia/Darwin",
  "Australia/Adelaide",
  "Australia/Hobart",
  "Asia/Yakutsk",
  "Australia/Brisbane",
  "Pacific/Port_Moresby",
  "Australia/Sydney",
  "Asia/Vladivostok",
  "Pacific/Guadalcanal",
  "Etc/GMT-12",
  "Pacific/Fiji",
  "Asia/Magadan",
  "Pacific/Auckland",
  "Pacific/Tongatapu",
  "Pacific/Apia",
  "UTC",
];

export type Timezone = typeof TIMEZONE[number];

export const DATE_FORMAT = [
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
  "ZZZ",
  "ZZZZ",
  "X",
  "x",
] as const;

export type DateFormatType = typeof DATE_FORMAT[number];

export function isFormatDateType(format: string): format is DateFormatType {
  return DATE_FORMAT.includes(format as DateFormatType);
}
