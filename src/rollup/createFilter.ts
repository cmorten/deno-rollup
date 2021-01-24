import { isAbsolute, join, normalize, pm, resolve } from "../../deps.ts";
import { ensureArray } from "../ensureArray.ts";

/**
 * getMatcherString
 * 
 * @param {string} id 
 * @param {string|false|null|undefined} resolutionBase 
 * @returns {string}
 * @private
 */
function getMatcherString(
  id: string,
  resolutionBase: string | false | null | undefined,
) {
  if (resolutionBase === false || isAbsolute(id) || id.startsWith("*")) {
    return id;
  }

  const basePath = normalize(resolve(resolutionBase || ""))
    .replace(/[-^$*+?.()|[\]{}]/g, "\\$&");

  return join(basePath, id);
}

/**
 * A valid `minimatch` pattern, or array of patterns.
 */
export type FilterPattern =
  | (string | RegExp)[]
  | string
  | RegExp
  | null;

export type CreateFilter = (id: string | unknown) => boolean;

/**
 * createFilter
 * 
 * @param {FilterPattern} include 
 * @param {FilterPattern} exclude 
 * @param {any} options
 * @returns {CreateFilter}
 * @private
 */
export function createFilter(
  include?: FilterPattern,
  exclude?: FilterPattern,
  options?: { resolve?: string | false | null },
): CreateFilter {
  const resolutionBase = options && options.resolve;

  const getMatcher = (id: string | RegExp) =>
    id instanceof RegExp ? id : {
      test: (what: string) => {
        const pattern = getMatcherString(id, resolutionBase);
        const fn = pm(pattern, { dot: true });
        const result = fn(what);

        return result;
      },
    };

  const includeMatchers = ensureArray(include).map(getMatcher);
  const excludeMatchers = ensureArray(exclude).map(getMatcher);

  return function result(id: string | unknown): boolean {
    if (typeof id !== "string" || /\0/.test(id)) {
      return false;
    }

    const pathId = normalize(id);

    for (let i = 0; i < excludeMatchers.length; ++i) {
      const matcher = excludeMatchers[i];

      if (matcher.test(pathId)) {
        return false;
      }
    }

    for (let i = 0; i < includeMatchers.length; ++i) {
      const matcher = includeMatchers[i];

      if (matcher.test(pathId)) {
        return true;
      }
    }

    return !includeMatchers.length;
  };
}
