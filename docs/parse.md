---
layout: default
title: Parse
nav_order: 2
---

# Parse

## String

parse ISO 8601.

```typescript
// parse ISO 8601
datetime("2021-06-30T21:15:30.200");
```

You can also parse custom format by using `parse`.

Ptera also supports parsing intl string.

```typescript
import { parse } from "https://deno.land/x/ptera/mod.ts";

const dt = parse("5/Aug/2021:14:15:30 +0900", "d/MMM/YYYY:HH:mm:ss ZZ");

// support locale
parse("2021 лютий 03", "YYYY MMMM dd", { locale: "uk" });
```

### Available Formats

| Format | Description                               | Example |
| ------ | :---------------------------------------- | :------ |
| YYYY   | year, four digits                         | 2021    |
| M      | month, one or Two digits                  | 6       |
| MM     | month, two digits                         | 06      |
| MMM    | short month string                        | Aug     |
| MMMM   | long month string                         | August  |
| d      | day, one or two digits                    | 8       |
| dd     | day, two digits                           | 08      |
| D      | day of year, between one and three digits | 29      |
| DDD    | day of year, between one and three digits | 365     |
| H      | 24hour, one or two digits                 | 9       |
| HH     | 24hour, two digits                        | 13      |
| h      | 12hour, one or two digits                 | 02      |
| hh     | 12hour, two digits                        | 11      |
| m      | minutes, one or two digits                | 45      |
| mm     | minutes, two digits                       | 45      |
| s      | seconds, one or two digits                | 30      |
| ss     | seconds, two digits                       | 07      |
| S      | milliseconds, three digits                | 999     |
| w      | day of the week, 1 is Monday, 7 is Sunday | 7       |
| www    | short week string                         | Fri     |
| wwww   | long week string                          | Friday  |
| a      | AM or PM                                  | AM      |
| Z      | offset with colon                         | +03:00  |
| ZZ     | short offset                              | +0300   |

## Unix Timestamp

Ptera supports milliseconds Unix Timestamp.

If you want to parse seconds Unix Timestamp, please convert to milliseconds
(timestamp * 1000).

```typescript
datetime(1625238137000);
```

## Date

```typescript
datetime(new Date(2021, 3, 10));
```

## Array

```typescript
datetime([2021, 6, 25]); // 2021-06-25
datetime([2021, 6, 25, 13, 40, 30, 10]); // 2021-06-25T13:40:30.010
```
