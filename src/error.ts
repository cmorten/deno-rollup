/**
 * Derived from <https://github.com/rollup/rollup/blob/v2.42.3/src/utils/error.ts>
 */

import type { RollupError } from "../deps.ts";

/**
 * error
 *
 * @param {Error|RollupError} base
 * @private
 */
export function error(base: Error | RollupError): never {
  if (!(base instanceof Error)) {
    base = Object.assign(new Error(base.message), base);
  }

  throw base;
}
