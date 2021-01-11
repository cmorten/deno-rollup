import { dirname, isAbsolute, join } from "../../deps.ts";
import { isUrl } from "./isUrl.ts";

/**
 * resolveId
 * 
 * @param {string} source 
 * @param {string} [importer]
 * @returns {string}
 * @private
 */
export function resolveId(source: string, importer?: string): string {
  if (isUrl(source) || isAbsolute(source)) {
    return source;
  }

  return importer ? join(dirname(importer), source) : source;
}
