import { getLocalOffset } from "./local_time.ts";
import { Timestamp } from "./types.ts";

export function getUtcTime(timestamp: Timestamp): Date {
  const utcTimestamp = new Date(timestamp).getTime() +
    getLocalOffset(timestamp);
  return new Date(utcTimestamp);
}
