---
layout: default
title: Timezone
nav_order: 4
---

# Timezone

Timezone can be set by using `datetime` option or `setTimezone`

```typescript
datetime("2021-08-21", { timezone: "America/New_York" });
datetime().setTimezone("America/New_York");
```

## Offset

```typescript
datetime().setTimezone("America/New_York").offsetHours(); // -4
datetime().setTimezone("America/New_York").offsetMillisec(); // -14400000
```

## UTC

`toUTC` converts to UTC datetime

```typescript
// { year: 2021, month: 7, day: 21, hour: 21, minute: 30, second: 0, millisecond: 0, }
const dt = datetime("2021-07-21T21:30:00").setTimezone("America/New_York");
// { year: 2021, month: 7, day: 22, hour: 1, minute: 30, second: 0, millisecond: 0,}
const utc = dt.toUTC();
```

## Convert to zoned time

```typescript
// { year: 2021, month: 7, day: 21, hour: 21, minute: 30, second: 0, millisecond: 0, }
const NewYork = datetime("2021-07-21T21:30:00").setTimezone("America/New_York");
// { year: 2021, month: 7, day: 22, hour: 10, minute: 30, second: 0, millisecond: 0, }
const Tokyo = dt.toZonedTime("Asia/Tokyo");
```
