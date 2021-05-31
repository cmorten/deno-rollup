const RE_TS = /\.tsx?$/;

/**
 * isTypescript
 *
 * @param {string} source
 * @returns {boolean}
 * @private
 */
export function isTypescript(source: string): boolean {
  return RE_TS.test(source);
}
