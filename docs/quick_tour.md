---
layout: default
title: Quick Tour
nav_order: 1
---

# Quick Tour

## datetime

The main function is `datetime`.

You can get the current time by calling the `datetime` function with no
arguments.

The default timezone is local time.

```typescript
import { datetime } from "https://deno.land/x/ptera/mod.ts";

// now in localtime
const dt = datetime();
// DateTime {
//   year: 2021,
//   month: 7,
//   day: 8,
//   hour: 23,
//   minute: 23,
//   second: 57,
//   millisecond: 580,
//   timezone: "Asia/Tokyo",
//   valid: true,
//   locale: "en"
// }

// utc
dt.toUTC();
// DateTime {
//   year: 2021,
//   month: 7,
//   day: 8,
//   hour: 14,
//   minute: 23,
//   second: 57,
//   millisecond: 580,
//   timezone: "UTC",
//   valid: true,
//   locale: "en"
// }
```

`datetime` takes several types of arguments, ISO 8601 string, Date, Object,
milliseconds unixtime, array.

```typescript
// parse ISO 8601
datetime("2021-06-30T21:15:30.200");

// JavaScript Date
datetime(new Date());

// Object
datetime({ year: 2021, month: 3, day: 21 });

// Unixtime
datetime(1625238137000);

// Array
datetime([2021, 6, 11, 13, 30, 30]);
```

### Properties

```typescript
const dt = datetime("2021-06-30T21:15:30.200");
dt.year; // 2021
dt.month; // 6
dt.day; // 30
dt.hour; // 21
dt.minute; // 15
dt.second; // 30
dt.millisecond; // 200
dt.timezone;
dt.locale;
```

### Utilities

```typescript
const dt = datetime();
dt.isLeapYear();
dt.isBefore();
dt.dayOfYear();
```

### Format

```typescript
dt.format("YYYY-MM-dd Z"); // 2021-08-21 +03:00
dt.format("MMMM ZZZ"); // January JST
```

### Timezone

```typescript
const dt = datetime("2021-07-21");
dt.toZonedTime("America/New_York"); // change to other zoned time
```

### Intl

```typescript
const dt = datetime().setLocale("ja");
dt.format("MMMM www"); // 7月 金
dt.setLocale("fr").format("MMMM www"); // juillet ven.
```

### Diff

```typescript
import { diffInMillisec } from "https://deno.land/x/ptera/mod.ts";
diffInMillisec(datetime("2021-08-29"), datetime("2021-12-21"));
```
