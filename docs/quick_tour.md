# Quick Tour

## datetime

The main function is `datetime` returns `DateTime` class. You can get the
current time by calling the `datetime` function with no arguments.

```typescript
import { datetime } from "https://deno.land/x/ptera/mod.ts";

// now
const dt = datetime();
```

`datetime` takes several types of arguments, string, Date, Object, number, array
of number.

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
// more...
```

### Utilities

```typescript
const dt = datetime();
dt.isLeapYear();
dt.isBefore();
dt.dayOfYear();
// more...
```

### Format

```typescript
dt.format("YYYY-MM-dd Z"); // 2021-08-21 +03:00
dt.format("MMMM ZZZ"); // January JST
```

### Timezone

```typescript
const dt = datetime("2021-07-21", { timezone: "America/New_York" });
dt.timezone; // America/New_York

dt.toZonedTime("Asia/Tokyo"); // change to other zoned time
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
