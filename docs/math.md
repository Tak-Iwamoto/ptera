---
layout: default
title: Math
nav_order: 5
---

# Math

## add, substract

You can manipulate datetime by using `add` or `substract`.

### Support properties

- year
- month
- day
- hour
- minute
- second
- millisecond
- quarter
- weeks

```typescript
const dt = datetime("2021-08-21:13:30:00"); // { year: 2021, month: 8, day: 21, hour: 13, minute: 30, second: 0, millisecond: 0, }

dt.add({ year: 1, second: 10 }).substract({ month: 2, minute: 5 }); // { year: 2022, month: 6, day: 21, hour: 13, minute: 25, second: 10, millisecond: 0, }
```

## start and end

These methods return the start and end of the unit time.

### Available Methods

- startOfYear
- startOfQuarter
- startOfMonth
- startOfDay
- startOfHour
- startOfMinute
- startOfSecond
- endOfYear
- endOfQuarter
- endOfMonth
- endOfDay
- endOfHour
- endOfMinute
- endOfSecond

```typescript
const dt = datetime("2021-08-21:13:30:00").startOfYear();
// { year: 2021, month: 1, day: 1, hour: 0, minute: 0, second: 0, millisecond: 0, }
```

## diff

Ptera supports these functions to calculate difference between two datetime.

- `diffInMillisec`
- `diffInSec`
- `diffInMin`
- `diffInHours`
- `diffInDays`

`diffInMin`, `diffInHours`, `diffInDays` support `showDecimal` option.

```typescript
import { diffInDays, diffInMillisec } from "https://deno.land/x/ptera/mod.ts";
const dt1 = datetime("2021-08-21:13:30:00");
const dt2 = datetime("2021-01-30:21:30:00");

diffInMillisec(dt1, dt2); // 17510400000
diffInDays(dt1, dt2); // 202
diffInDays(dt1, dt2, { showDecimal: true }); // 202.66666666666666
```

## latest, oldest

Extracts the latest or oldest date

```typescript
import {
  latestDateTime,
  oldestDateTime,
} from "https://deno.land/x/ptera/mod.ts";

const dt1 = datetime("2021-08-21");
const dt2 = datetime("2021-01-30");
const dt3 = datetime("2021-04-30");
const datetimes = [dt1, dt2, dt3];

latestDateTime(datetimes); // dt1
oldestDateTime(datetimes); // dt2
```
