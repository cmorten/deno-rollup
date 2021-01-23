import type { RollupError } from "../deps.ts";

export function error(base: Error | RollupError): never {
  if (!(base instanceof Error)) {
    base = Object.assign(new Error(base.message), base);
  }

  throw base;
}
