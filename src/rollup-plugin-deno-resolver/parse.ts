import { getUrlBase } from "./getUrlBase.ts";

/**
 * parse
 * 
 * @param {string} id
 * @returns {URL|null}
 * @private
 */
export function parse(id: string): URL | null {
  try {
    return new URL(id);
  } catch {
    // Not a URL in it's own right, but may be
    // relative to an importer URL or the CWD.
  }

  try {
    return new URL(id, getUrlBase());
  } catch {
    return null;
  }
}
