import { Timezone } from "./types.ts";
import { utcToZonedTime } from "./zoned_time.ts";

type Config = {
  tz?: Timezone;
};

function newInstance(date: Date, config?: Config): DD {
  return new DD(date, config);
}

export default class DD {
  #ddDateTime: Date;
  #config?: Config;

  constructor(date: Date | number | string, config?: Config) {
    this.#ddDateTime = date instanceof Date
      ? new Date(date.getTime())
      : new Date(date);
    this.#config = config;
  }

  getDate() {
    return this.#ddDateTime;
  }

  getTime(): number {
    return this.#ddDateTime.getTime();
  }

  tz(tz: Timezone): DD {
    return newInstance(utcToZonedTime(this.#ddDateTime, tz), { tz });
  }

  startOfDay(): Date {
    const clone = newInstance(this.#ddDateTime);
    clone.#ddDateTime.setUTCHours(0, 0, 0, 0);
    return clone.#ddDateTime;
  }

  endOfDay(): Date {
    const clone = newInstance(this.#ddDateTime);
    clone.#ddDateTime.setUTCHours(23, 59, 59, 999);
    return clone.#ddDateTime;
  }

  startOfMonth(): Date {
    const clone = newInstance(this.#ddDateTime);
    clone.#ddDateTime.setUTCDate(1);
    return clone.#ddDateTime;
  }

  endOfMonth(): Date {
    return newInstance(
      new Date(
        this.#ddDateTime.getUTCFullYear(),
        this.#ddDateTime.getUTCMonth() + 1,
        0,
      ),
    ).#ddDateTime;
  }
}
