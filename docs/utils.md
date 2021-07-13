---
layout: default
title: Utils
nav_order: 6
---

# Utils

## isBefore

Check if the datetime is in the past If no argument is given, compare with the
current time.

```typescript
datetime("1992-01-01").isBefore(); // true
datetime("2045-01-01").isBefore(); // false
datetime("2045-01-01").isBefore(datetime("2046-01-01")); // true
```

## isAfter

Check if the datetime is in the future

```typescript
datetime("1992-01-01").isAfter(); // false
datetime("2045-01-01").isAfter(); // true
datetime("2045-01-01").isAfter(datetime("2030-01-01")); // true
```

## isLeapYear

Check if the datetime is in leap year

```typescript
datetime("2020-01-01").isLeapYear(); // true
datetime("2021-01-01").isLeapYear(); // false
```

## isValid

Check if the datetime is valid

```typescript
datetime("2020-01-01").isValid(); // true
datetime("2021-13-01").isValid(); // false
```
