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

import type { FilterPattern, NormalizedOutputOptions } from "../../mod.ts";
import {
  importw,
  workerSymbol,
} from "https://deno.land/x/importw@0.3.0/src/importw.ts";
import { MinifyOptions } from "https://cdn.esm.sh/v16/terser@5.6.0/tools/terser.d.ts";

/**
 * @public
 */
export interface RollupTerserOptions extends Omit<MinifyOptions, "sourceMap"> {}

const workerScriptUrl = new URL("./worker.js", import.meta.url).href;

export function terser(options: RollupTerserOptions = {}) {
  const workerPromise = importw(
    workerScriptUrl,
    {
      name: "transform",
      deno: {
        namespace: false,
        permissions: {
          write: false,
          read: true,
          net: true,
          env: false,
          hrtime: false,
          plugin: false,
          run: false,
        },
      },
    },
  );

  return {
    name: "terser",

    async renderChunk(
      code: string,
      _chunk: unknown,
      outputOptions: NormalizedOutputOptions,
    ) {
      const worker = await workerPromise;

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

      for (let key of ["numWorkers"]) {
        if (normalizedOptions.hasOwnProperty(key)) {
          delete normalizedOptions[key];
        }
      }

      let result;

      try {
        result = await worker.transform(code, normalizedOptions);

        if (result.nameCache) {
          let { vars, props } = options.nameCache as { vars: any; props: any };

          if (vars) {
            const newVars = result.nameCache.vars &&
              result.nameCache.vars.props;
            if (newVars) {
              vars.props = vars.props || {};
              Object.assign(vars.props, newVars);
            }
          }

          if (!props) {
            props = (options.nameCache as { props: any }).props = {};
          }

          const newProps = result.nameCache.props &&
            result.nameCache.props.props;
          if (newProps) {
            props.props = props.props || {};
            Object.assign(props.props, newProps);
          }
        }
      } catch (error) {
        throw error;
      }

      return result.result;
    },

    async closeBundle() {
      const worker = await workerPromise;

      worker[workerSymbol].terminate();
    },
  };
}
