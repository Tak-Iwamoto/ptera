import { Timezone } from "./types.ts";

function cacheKey(locale: string, options: unknown): string {
  return JSON.stringify([locale, options]);
}

const dtfCache: Record<string, Intl.DateTimeFormat> = {};
function cachedDTF(locale: string, options: Intl.DateTimeFormatOptions) {
  const key = cacheKey(locale, options);
  let dtf = dtfCache[key];

  if (!dtf) {
    dtf = new Intl.DateTimeFormat(locale, options);
    dtfCache[key] = dtf;
  }
  return dtf;
}

const nfCache: Record<string, Intl.NumberFormat> = {};
function cachedNF(locale: string, options: Intl.NumberFormatOptions) {
  const key = cacheKey(locale, options);
  let nf = nfCache[key];

  if (!nf) {
    nf = new Intl.NumberFormat(locale, options);
    nfCache[key] = nf;
  }
  return nf;
}

const rtfCache: Record<string, Intl.RelativeTimeFormat> = {};
function cachedRTF(locale: string, options: Intl.RelativeTimeFormatOptions) {
  const key = cacheKey(locale, options);
  let rtf = rtfCache[key];

  if (!rtf) {
    rtf = new Intl.RelativeTimeFormat(locale, options);
    rtfCache[key] = rtf;
  }
  return rtf;
}

export class Locale {
  readonly locale: string;
  readonly dtfOptions: Intl.DateTimeFormatOptions;
  readonly nfOptions: Intl.NumberFormatOptions;
  readonly rtfOptions: Intl.RelativeTimeFormatOptions;

  constructor(
    locale: string,
    options?: {
      dtfOptions?: Intl.DateTimeFormatOptions;
      nfOptions?: Intl.NumberFormatOptions;
      rtfOptions?: Intl.RelativeTimeFormatOptions;
    },
  ) {
    this.locale = locale;
    this.dtfOptions = options?.dtfOptions ?? {};
    this.nfOptions = options?.nfOptions ?? {};
    this.rtfOptions = options?.rtfOptions ?? {};
  }

  dtfFormat(date: Date, options?: Intl.DateTimeFormatOptions) {
    const opts = options ?? this.dtfOptions;
    return cachedDTF(this.locale, opts).format(date);
  }

  dtfFormatToParts(date: Date, options?: Intl.DateTimeFormatOptions) {
    const opts = options ?? this.dtfOptions;
    return cachedDTF(this.locale, opts).formatToParts(date);
  }

  nfFormat(n: number, options?: Intl.NumberFormatOptions) {
    const opts = options ?? this.nfOptions;
    return cachedNF(this.locale, opts).format(n);
  }

  nfFormatToParts(n: number, options?: Intl.NumberFormatOptions) {
    const opts = options ?? this.nfOptions;
    return cachedNF(this.locale, opts).formatToParts(n);
  }

  rtfFormat(
    n: number,
    unit: Intl.RelativeTimeFormatUnit,
    options?: Intl.RelativeTimeFormatOptions,
  ) {
    const opts = options ?? this.rtfOptions;
    return cachedRTF(this.locale, opts).format(n, unit);
  }

  rtfFormatToParts(
    n: number,
    unit: Intl.RelativeTimeFormatUnit,
    options?: Intl.RelativeTimeFormatOptions,
  ) {
    const opts = options ?? this.rtfOptions;
    return cachedRTF(this.locale, opts).formatToParts(n, unit);
  }

  monthList(format: "numeric" | "2-digit" | "long" | "short" | "narrow") {
    const monthIndexes = [...Array(12).keys()];
    return monthIndexes.map((m) =>
      this.dtfFormat(new Date(2021, m), { month: format })
    );
  }

  weekList(format: "long" | "short" | "narrow") {
    const weekIndexes = [...Array(7).keys()];

    return weekIndexes.map((m) =>
      this.dtfFormat(new Date(2021, 0, 3 + m), { weekday: format })
    );
  }

  meridiems(format?: "long" | "short" | "narrow") {
    return [
      this.#extractDTFParts(new Date(Date.UTC(2021, 1, 1, 9)), "dayPeriod", {
        dayPeriod: format,
        hour12: true,
        hour: "numeric",
        timeZone: "UTC",
      }),
      this.#extractDTFParts(new Date(Date.UTC(2021, 1, 1, 21)), "dayPeriod", {
        dayPeriod: format,
        hour12: true,
        hour: "numeric",
        timeZone: "UTC",
      }),
    ];
  }

  eras(format: "long" | "short" | "narrow") {
    return [
      this.#extractDTFParts(new Date(-40, 1, 1), "era", { era: format }),
      this.#extractDTFParts(new Date(2021, 1, 1), "era", { era: format }),
    ];
  }

  offsetName(date: Date, offsetFormat: "long" | "short", timezone?: Timezone) {
    const parsedParts = this.#extractDTFParts(date, "timeZoneName", {
      hour12: false,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: offsetFormat,
      timeZone: timezone,
    });
    return parsedParts;
  }

  #extractDTFParts(
    date: Date,
    type: Intl.DateTimeFormatPartTypes,
    options?: Intl.DateTimeFormatOptions,
  ) {
    const opts = options ?? this.dtfOptions;
    const parts = this.dtfFormatToParts(date, opts);
    const matchParts = parts.find((p) => p.type === type);
    return matchParts?.value ?? null;
  }
}
