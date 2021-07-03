# Format

## ISO 8601

```typescript
datetime().toISO(); // 2021-07-21T23:30:59.000+09:00
datetime().toISODate(); // 2021-07-21
datetime().toISOWeekDateDate(); // 2021-W29-3
datetime().toISOTime(); // 23:30:59.000
```

## Intl

Ptera supports native Intl.DateTimeFormat

```typescript
const dt = datetime().setLocale("fr");
dt.toDateTimeFormat({ dateStyle: "full" }); // samedi 3 juillet 2021;
```

## Custom Format

Ptera supports custom format.

```typescript
datetime().format("YYYY/MMMM/dd"); // 2021/July/03
datetime().setLocale("fr").format("YYYY/MMMM/dd"); // 2021/juillet/03
```

You can escape string by using single quotes.

```typescript
datetime().format("'Year is: 'YYYY"); // Year is: 2021
```

### Available formats

| Format | Description                               | Example               |
| ------ | :---------------------------------------- | :-------------------- |
| YY     | year, two digits                          | 21                    |
| YYYY   | year, four digits                         | 2021                  |
| M      | month, one or Two digits                  | 6                     |
| MM     | month, two digits                         | 06                    |
| MMM    | short month string                        | Aug                   |
| MMMM   | long month string                         | August                |
| d      | day, one or two digits                    | 8                     |
| dd     | day, two digits                           | 08                    |
| D      | day of year, between one and three digits | 29                    |
| DDD    | day of year, between one and three digits | 365                   |
| H      | 24hour, one or two digits                 | 9                     |
| HH     | 24hour, two digits                        | 13                    |
| h      | 12hour, one or two digits                 | 02                    |
| hh     | 12hour, two digits                        | 11                    |
| m      | minutes, one or two digits                | 45                    |
| mm     | minutes, two digits                       | 45                    |
| s      | seconds, one or two digits                | 30                    |
| ss     | seconds, two digits                       | 07                    |
| S      | milliseconds, three digits                | 999                   |
| w      | day of the week, 1 is Monday, 7 is Sunday | 7                     |
| www    | short week string                         | Fri                   |
| wwww   | long week string                          | Friday                |
| W      | iso week number, one or two digits        | 52                    |
| WW     | iso week number, two digits               | 52                    |
| a      | AM or PM                                  | AM                    |
| X      | Unix timestamp seconds                    | 1609507800            |
| x      | Unix timestamp milliseconds               | 1609507800000         |
| z      | Timezone                                  | Asia/Tokyo            |
| Z      | offset with colon                         | +03:00                |
| ZZ     | short offset                              | +0300                 |
| ZZZ    | short offset name                         | UTC-5                 |
| ZZZZ   | long offset name                          | Eastern Standard Time |
