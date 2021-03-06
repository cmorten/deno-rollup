/**
 * Derived from <https://github.com/rollup/rollup/blob/v2.39.1/src/utils/relativeId.ts>
 */

import { basename, extname } from "../../deps.ts";

export function getAliasName(id: string) {
  const base = basename(id);

  return base.substr(0, base.length - extname(id).length);
}
