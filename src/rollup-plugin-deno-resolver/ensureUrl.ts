const RE_URL = /^(https?|file):\/\//;
const RE_PATH_MALFORMED_HTTP_URL = /^((https?):\/)([^\/]?)/;
const RE_PATH_MALFORMED_FILE_URL = /^((file):\/)([^\/]?)/;
const RE_WIN_PATH_MALFORMED_HTTP_URL = /^((https?):)(?:\\|\/)/;
const RE_WIN_PATH_MALFORMED_FILE_URL = /^((file):)(?:\\?|\/)(\w:)?/;

/**
 * ensureUrl
 * 
 * @param {string} source 
 * @returns {string|null}
 * @private
 */
export function ensureUrl(source: string): string | null {
  if (RE_URL.test(source)) {
    return source;
  } else if (RE_WIN_PATH_MALFORMED_HTTP_URL.test(source)) {
    return source.replace(RE_WIN_PATH_MALFORMED_HTTP_URL, "$1//").replace(
      /\\/g,
      "/",
    );
  } else if (RE_PATH_MALFORMED_HTTP_URL.test(source)) {
    return source.replace(RE_PATH_MALFORMED_HTTP_URL, "$1/$3");
  } else if (RE_WIN_PATH_MALFORMED_FILE_URL.test(source)) {
    return source.replace(RE_WIN_PATH_MALFORMED_FILE_URL, "$1///$3").replace(
      /\\/g,
      "/",
    );
  } else if (RE_PATH_MALFORMED_FILE_URL.test(source)) {
    return source.replace(RE_PATH_MALFORMED_FILE_URL, "$1//$3");
  }

  return null;
}
