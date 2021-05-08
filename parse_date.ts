import { DateArg } from "./types.ts";

export function parseDate(arg: DateArg): Date {
  if (arg instanceof Date) {
    return new Date(arg.getTime())
  }

  return new Date(arg)
}