import { IntlOptions } from "./types.ts"

function cacheKey(locale: string, options: {}): string {
  return JSON.stringify([locale, options])
}

let dtfCache: Record<string, Intl.DateTimeFormat> = {}
function cachedDTF(locale: string, options: Intl.DateTimeFormatOptions) {
  const key = cacheKey(locale, options)
  let dtf = dtfCache[key]

  if (!dtf) {
    dtf = new Intl.DateTimeFormat(locale, options)
    dtfCache[key] = dtf
  }
  return dtf
}

let nfCache: Record<string, Intl.NumberFormat> = {}
function cachedNF(locale: string, options: Intl.NumberFormatOptions) {
  const key = cacheKey(locale, options)
  let nf = nfCache[key]

  if (!nf) {
    nf = new Intl.NumberFormat(locale, options)
    nfCache[key] = nf
  }
  return nf
}

let rtfCache: Record<string, Intl.RelativeTimeFormat> = {}
function cachedRTF(locale: string, options: Intl.RelativeTimeFormatOptions) {
  const key = cacheKey(locale, options)
  let rtf = rtfCache[key]

  if (!rtf) {
    rtf = new Intl.RelativeTimeFormat(locale, options)
    rtfCache[key] = rtf
  }
  return rtf
}

export class Locale {
  readonly locale: string
  readonly option: IntlOptions

  constructor(locale: string, option: IntlOptions) {
    this.locale = locale
    this.option = option
  }
}
