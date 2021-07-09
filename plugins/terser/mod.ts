// deno-lint-ignore-file no-explicit-any
/**
 * Derived from <https://github.com/TrySound/rollup-plugin-terser>
 *
 * Licensed as follows:
 *
 * The MIT License (MIT)
 *
 * Copyright 2018 Bogdan Chadkin <trysound@yandex.ru>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import type { NormalizedOutputOptions } from "../../mod.ts";
import type { RollupTerserOptions } from "./types.ts";
import type { SourceMapInput } from "../../deps.ts";
import { transform } from "./transform.ts";

/**
 * @public
 */
export function terser(options: RollupTerserOptions = {}) {
  return {
    name: "terser",

    async renderChunk(
      code: string,
      _chunk: unknown,
      outputOptions: NormalizedOutputOptions,
    ) {
      const defaultOptions: Record<string, any> = {
        sourceMap: outputOptions.sourcemap === true ||
          typeof outputOptions.sourcemap === "string",
      };

      if (outputOptions.format === "es") {
        defaultOptions.module = true;
      } else if (outputOptions.format === "cjs") {
        defaultOptions.toplevel = true;
      }

      const normalizedOptions: Record<string, any> = {
        ...defaultOptions,
        ...options,
      };

      delete normalizedOptions.numWorkers;

      let result;

      try {
        result = await transform(code, normalizedOptions);

        if (result.nameCache) {
          const resultNameCache = result.nameCache;
          let { vars, props } = options.nameCache ?? {};

          if (vars) {
            const newVars = resultNameCache?.vars?.props;

            if (newVars) {
              vars.props = vars.props || {};
              Object.assign(vars.props, newVars);
            }
          }

          if (!props) {
            options.nameCache = {};
            props = options.nameCache.props = {};
          }

          const newProps = resultNameCache?.props?.props;

          if (newProps) {
            props.props = props.props || {};
            Object.assign(props.props, newProps);
          }
        }
      } catch (error) {
        throw error;
      }

      return result.result as { code: string; map?: SourceMapInput };
    },
  };
}
