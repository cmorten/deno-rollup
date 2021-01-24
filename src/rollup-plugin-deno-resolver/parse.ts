import { getUrlBase } from "./getUrlBase.ts";

/**
 * parse
 * 
 * @param {string} source 
 * @param {string} [importer] 
 * @returns {URL|null}
 * @private
 */
export function parse(
  source: string,
  importer?: string,
): URL | null {
  try {
    return new URL(source);
  } catch {
    // Not a URL in it's own right, but may be
    // relative to an importer URL or the CWD.
  }

  try {
    return new URL(source, getUrlBase(importer));
  } catch (_) {
    return null;
  }
}
