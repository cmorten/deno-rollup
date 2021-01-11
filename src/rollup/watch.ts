import type { RollupWatcher, RollupWatchOptions } from "../../deps.ts";
import { notImplemented } from "../notImplemented.ts";

export function watch(
  config: RollupWatchOptions | RollupWatchOptions[],
): RollupWatcher {
  return notImplemented(`support for 'watch'`);
}
