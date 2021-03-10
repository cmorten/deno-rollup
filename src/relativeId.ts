/**
 * Derived from <https://github.com/rollup/rollup/blob/v2.41.0/src/utils/relativeId.ts>
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
