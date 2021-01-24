const RE_URL = /^(https?|file):\/\//;
const RE_PATH_MALFORMED_URL = /^((https?|file):\/)([^\/]?)/;

/**
 * ensureUrl
 * 
 * @param {string} source 
 * @returns {string | null}
 * @private
 */
export function ensureUrl(source: string): string | null {
  if (RE_URL.test(source)) {
    return source;
  } else if (RE_PATH_MALFORMED_URL.test(source)) {
    return source.replace(RE_PATH_MALFORMED_URL, "$1/$3");
  }

  return null;
}
