# Ptera

Ptera is datetime library for Deno. Wrttiten in 100% Deno.

Heavily inspired by the great libraries Luxon, Dayjs, Moment.js.

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

### Doc

WIP
