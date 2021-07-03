# Ptera

Ptera is DateTime library for Deno.

Fully Written in Deno.

Heavily inspired by the great libraries
[Luxon](https://github.com/moment/luxon),
[Day.js](https://github.com/iamkun/dayjs),
[Moment.js](https://github.com/moment/moment).

## Features

- Immutable, chainable
- Parsing and Formatting
- Timezone and Intl support

## Getting Started

### API

```typescript
datetime("2021-06-30T21:15:30.200"); // parse iso8601 format

datetime().setTimezone("Asia/Tokyo"); // timezone
datetime().setLocale("fr"); // locale

datetime().add({ year: 1 }); // add Date
datetime().substract({ day: 1 }); // substract Date
```

### Documentation

https://tak-iwamoto.github.io/ptera/
