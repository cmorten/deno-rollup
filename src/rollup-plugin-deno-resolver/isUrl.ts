const RE_URL = /^(https?|file):\/\//;

/**
 * isUrl
 * 
 * @param {string} source 
 * @returns {boolean}
 * @private
 */
export function isUrl(source: string): boolean {
  return RE_URL.test(source);
}
