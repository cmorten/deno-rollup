/**
 * Derived from <https://github.com/rollup/rollup/blob/v2.42.3/src/utils/relativeId.ts>
 */

import { isAbsolute, relative } from "../deps.ts";

/**
 * relativeId
 *
 * @param {string} id
 * @returns {string}
 * @private
 */
export function relativeId(id: string): string {
  if (!isAbsolute(id)) {
    return id;
  }

  return relative(Deno.cwd(), id);
}
