import { Timezone } from "./types.ts";
import { zonedTime } from "./zoned_time.ts";

function newInstance(date: Date): DD {
  return new DD(date);
}

export default class DD {
  #ddDateTime: Date;

  constructor(date: Date | number | string) {
    this.#ddDateTime = date instanceof Date
      ? new Date(date.getTime())
      : new Date(date);
  }

  getTime() {
    return this.#ddDateTime.getTime();
  }

  tz(tz: Timezone) {
    return newInstance(zonedTime(this.#ddDateTime, tz));
  }
}
