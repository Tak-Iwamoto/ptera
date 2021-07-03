# Math

## add, substract

You can manipulate datetime by using `add` or `substract`

### Support properties

- year
- month
- day
- hour
- minutes
- seconds
- milliseconds
- quarter
- weeks

```typescript
const dt = datetime("2021-08-21:13:30:00"); // { year: 2021, month: 8, day: 21, hour: 13, minute: 30, second: 0, millisecond: 0, }

dt.add({ year: 1 }).substract({ month: 2 }); // { year: 2022, month: 6, day: 21, hour: 13, minute: 30, second: 0, millisecond: 0, }
```

## diff

Ptera supports these functions to calculate diff between two datetime

- `diffInMillisec`
- `diffInSec`
- `diffInMin`
- `diffInHours`
- `diffInDays`

```typescript
const dt1 = datetime("2021-08-21:13:30:00");
const dt2 = datetime("2021-01-30:21:30:00");

diffInMillisec(dt1, dt2); // 17510400000
diffInDays(dt1, dt2); // 202
```

## latest, oldest

Extracts the latest or oldest date

```typescript
const dt1 = datetime("2021-08-21");
const dt2 = datetime("2021-01-30");
const dt3 = datetime("2021-04-30");
const datetimes = [dt1, dt2, dt3];

latestDateTime(datetimes); // dt1
oldestDateTime(datetimes); // dt2
```
