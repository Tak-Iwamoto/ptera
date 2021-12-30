# Ptera

[![ci](https://github.com/Tak-Iwamoto/ptera/actions/workflows/ci.yml/badge.svg)](https://github.com/Tak-Iwamoto/ptera/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

<p align="center"><a href="https://tak-iwamoto.github.io/ptera/"><img src="https://user-images.githubusercontent.com/36841033/126181352-800b8efb-220e-435c-91e2-2f60e82c44df.png" alt="ptera-log"></a></p>

Ptera is DateTime library for Deno.

Fully Written in Deno.

Heavily inspired by the great libraries
[Luxon](https://github.com/moment/luxon),
[Day.js](https://github.com/iamkun/dayjs),
[Moment.js](https://github.com/moment/moment).

## Features

- Immutable, chainable
- Parsing and Formatting
- Timezone and Intl support

## Getting Started

### API

```typescript
import { datetime } from "https://deno.land/x/ptera/mod.ts";

datetime("2021-06-30T21:15:30.200");

// timezone
datetime().toZonedTime("Asia/Tokyo");

// locale
datetime().setLocale("fr");

// add, subtract
datetime().add({ year: 1 });
datetime().subtract({ day: 1 });
```

### Documentation

https://tak-iwamoto.github.io/ptera/
