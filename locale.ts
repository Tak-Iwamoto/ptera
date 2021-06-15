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
    options: {
      dtfOptions?: Intl.DateTimeFormatOptions;
      nfOptions?: Intl.NumberFormatOptions;
      rtfOptions?: Intl.RelativeTimeFormatOptions;
    },
  ) {
    this.locale = locale;
    this.dtfOptions = options.dtfOptions ?? {};
    this.nfOptions = options.nfOptions ?? {};
    this.rtfOptions = options.rtfOptions ?? {};
  }

  dtfFormat(date: Date, options?: Intl.DateTimeFormatOptions) {
    const opts = options ?? this.dtfOptions;
    return cachedDTF(this.locale, opts).format(date);
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
      this.dtfFormat(new Date(2021, 0, 4 + m), { weekday: format })
    );
  }

  dtfFormatToParts(date: Date) {
    return cachedDTF(this.locale, this.dtfOptions).formatToParts(date);
  }

  nfFormat(n: number) {
    return cachedNF(this.locale, this.nfOptions).format(n);
  }

  nfFormatToParts(n: number) {
    return cachedNF(this.locale, this.nfOptions).formatToParts(n);
  }

  rtfFormat(n: number, unit: Intl.RelativeTimeFormatUnit) {
    return cachedRTF(this.locale, this.rtfOptions).format(n, unit);
  }

  rtfFormatToParts(n: number, unit: Intl.RelativeTimeFormatUnit) {
    return cachedRTF(this.locale, this.rtfOptions).formatToParts(n, unit);
  }
}
