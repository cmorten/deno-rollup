/**
 * Dervived from <https://github.com/rollup/plugins/tree/pluginutils-v4.1.0/packages/pluginutils>
 *
 * Licensed as follows:
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 RollupJS Plugin Contributors (https://github.com/rollup/plugins/graphs/contributors)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

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
