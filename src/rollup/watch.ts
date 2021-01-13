import type { RollupWatcher, RollupWatchOptions } from "./mod.ts";
import { notImplemented } from "../notImplemented.ts";

export function watch(
  config: RollupWatchOptions | RollupWatchOptions[],
): RollupWatcher {
  return notImplemented(`support for 'watch'`);
}
