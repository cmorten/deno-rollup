import { relativeId } from "../relativeId.ts";
import { error } from "../error.ts";

export function handleUnresolvedId(id: string, importer?: string) {
  // Let rollup core handle external module resolution
  if (importer !== undefined) {
    return null;
  }

  // TODO: raise issue / PR for rollup lib
  //
  // Workaround for issue with Rollup browser bundle. In the codepath
  // resolve() is called with no args when returning null from resolveId,
  // but the bundled browser distribution of rollup throws an error for
  // it's implementation of resolve when not passed any args.
  //
  // REF: https://github.com/rollup/rollup/blob/master/browser/path.ts#L61
  return error({
    code: "UNRESOLVED_ENTRY",
    message: `Could not resolve entry module (${relativeId(id)}).`,
  });
}
