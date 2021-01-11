import { dirname, isAbsolute, join, sep, toFileUrl } from "../../deps.ts";

/**
 * getUrlBase
 * 
 * @param {string} [importer] 
 * @returns {URL}
 * @private
 */
export function getUrlBase(importer?: string): URL {
  let path: string;

  if (importer) {
    if (isAbsolute(importer)) {
      path = dirname(importer);
    } else {
      path = dirname(join(Deno.cwd(), importer));
    }
  } else {
    path = Deno.cwd();
  }

  return toFileUrl(join(path, sep));
}
