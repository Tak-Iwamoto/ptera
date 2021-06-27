# Ptera

Ptera is datetime library for Deno. Wrttiten in 100% Deno.

Heavily inspired by the great libraries Luxon, Dayjs, Moment.js.

## Features

- Immutable, chainable
- Parsing and Formatting
- Timezone and Intl support

## Getting Started

### API

You can use `ptera` or `DateTime`.

`ptera` is wrapper function returns `DateTime` class.

```typescript
ptera("2021-06-30T21:15:30.200"); // parse iso8601 format
new DateTime("2021-06-30T21:15:30.200");

ptera().setTimezone("Asia/Tokyo"); // timezone
ptera().setLocale("fr"); // locale

ptera().add({ year: 1 }); // add Date
ptera().substract({ day: 1 }); // substract Date
```

### Doc

WIP
