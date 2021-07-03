# Parse

## String
Ptera can parse ISO 8601.

```typescript
// parse ISO 8601
datetime("2021-06-30T21:15:30.200");
```

You can also parse custom format by using `parse`.

```typescript
import { parse } from "https://deno.land/x/ptera/mod.ts";

const dt = parse("5/Aug/2021:14:15:30 +0900", "d/MMM/YYYY:HH:mm:ss ZZ");

// support locale
parse("2021 лютий 03", "YYYY MMMM dd", { locale: "uk" });
```

## Unixtime
Ptera supports milliseconds Unix timestamp.
If you want to parse seconds Unix timestamp, please convert to milliseconds (timestamp * 1000).

``` typescript
datetime(1625238137000);
```

## Date
With Javascript Date.

``` typescript
const jsDate = new Date(2021, 3, 10)
datetime(jsDate);
```
