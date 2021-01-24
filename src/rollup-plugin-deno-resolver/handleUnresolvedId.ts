import { relativeId } from "../relativeId.ts";
import { error } from "../error.ts";

/**
 * handleUnresolvedId
 * 
 * @param {string} id 
 * @param {string} [importer] 
 * @returns {null}
 * @private
 */
export function handleUnresolvedId(
  id: string,
  importer?: string,
): null | never {
  // Let rollup core handle external module resolution
  if (importer !== undefined) {
    return null;
  }

  // TODO:
  //
  // Workaround for issue with Rollup browser bundle. In the codepath
  // resolve() is called with no args when returning null from resolveId,
  // but the bundled browser distribution of rollup throws an error for
  // it's implementation of resolve when not passed any args.
  //
  // REF:
  // - https://github.com/cmorten/deno-rollup/issues/4
  // - https://github.com/rollup/rollup/issues/3934
  return error({
    code: "UNRESOLVED_ENTRY",
    message: `Could not resolve entry module (${relativeId(id)}).`,
  });
}
