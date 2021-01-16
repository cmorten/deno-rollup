import type { RollupWatcher, RollupWatchOptions } from "./mod.ts";
import { EventEmitter } from "../../deps.ts";
import { Watcher } from "./watcher.ts";
import { ensureArray } from "../ensureArray.ts";
import { handleError } from "../logging.ts";

// TODO: watch.clearScreen  -- TBD
// TODO: watch.chokidar     -- unless chokidar gets Denoified this won't be supported,
//                             but can consider Deno.watchFs options?

class WatchEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(Infinity);
  }

  close() {}
}

export function watch(
  config: RollupWatchOptions | RollupWatchOptions[],
): RollupWatcher {
  const emitter = new WatchEmitter() as RollupWatcher;
  const configArray = ensureArray(config);
  const watchConfigs = configArray.filter((config) => config.watch !== false);

  if (!watchConfigs.length) {
    throw handleError({
      message:
        `Invalid value for option "watch" - there must be at least one config where "watch" is not set to "false".`,
    });
  }

  new Watcher(watchConfigs, emitter);

  return emitter;
}
