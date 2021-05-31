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
  if (importer !== undefined) {
    return null;
  }

  error({
    code: "UNRESOLVED_ENTRY",
    message: `Could not resolve entry module (${relativeId(id)}).`,
  });
}
