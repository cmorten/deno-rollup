import type { RollupWatcher, RollupWatchOptions } from "./mod.ts";
import { EventEmitter } from "../../deps.ts";
import { Watcher } from "./watcher.ts";
import { ensureArray } from "../ensureArray.ts";
import { handleError } from "../logging.ts";

/**
 * WatchEmitter
 *
 * @private
 */
class WatchEmitter extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(Infinity);
  }

  close() {}
}

/**
 * watch
 *
 * The `watch` function rebuilds your bundle when it detects that the
 * individual modules have changed on disk. It is used internally when
 * you run Rollup from the command line with the `--watch` flag. Note
 * that when using watch mode via the JavaScript API, it is your
 * responsibility to call `event.result.close()` in response to the
 * `BUNDLE_END` event to allow plugins to clean up resources in the
 * `closeBundle` hook.
 *
 * @param {RollupWatchOptions|RollupWatchOptions[]} config
 * @returns {RollupWatcher}
 * @public
 */
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
