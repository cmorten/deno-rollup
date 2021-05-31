/**
 * Derived from <https://github.com/thgh/rollup-plugin-css-only>
 * 
 * Licensed as follows:
 * 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2016 Thomas Ghysels
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import type {
  FilterPattern,
  NormalizedOutputOptions,
  OutputBundle,
  Plugin,
} from "../../mod.ts";
import { createFilter } from "../../src/rollup/createFilter.ts";
import { parse } from "./deps.ts";

export type OutputFunction = (
  styles: string,
  styleNodes: Record<string, string>,
  bundle: OutputBundle,
) => void;

export interface RollupCssOptions {
  /**
   * One of:
   * - A string filename to write all styles to;
   * - A callback that will be called once generated with three arguments:
   *   - `styles`: the contents of all style tags combined: `"body { color: green }"`;
   *   - `styleNodes`: an array of style objects: `[{ lang: "css", content: "body { color: green }" }]`;
   *   - `bundle`: the output bundle object;
   * - `false` to disable any style output or callbacks;
   * - `null` for the default behaviour: to write all styles to the bundle destination where .js is replaced by .css.
   */
  output?: string | boolean | OutputFunction | null;
  /**
   * All CSS files will be parsed by default,
   * but you can also specifically include files
   */
  include?: FilterPattern;
  /**
   * All CSS files will be parsed by default,
   * but you can also specifically exclude files
   */
  exclude?: FilterPattern;
}

function getFileName(
  opts: NormalizedOutputOptions,
  bundle: OutputBundle,
): string {
  if (opts.file) {
    return `${parse(opts.file).name}.css`;
  }

  const entryFile = Object.keys(bundle).find((fileName) => {
    const file = bundle[fileName];

    if ("isEntry" in file) {
      return file.isEntry;
    }

    return false;
  });

  if (entryFile) {
    return `${parse(entryFile).name}.css`;
  }

  return "bundle.css";
}

/**
 * A Rollup plugin that bundles imported css.
 * 
 * @param {RollupCssOptions} options Plugin options.
 * @returns {Plugin} Plugin instance.
 */
export function css(options: RollupCssOptions = {}): Plugin {
  const filter = createFilter(options.include || ["**/*.css"], options.exclude);
  const styles: Record<string, string> = {};
  const importOrder: string[] = [];

  let changes = 0;
  let source = "";

  return {
    name: "css",
    transform(code, id) {
      if (!filter(id)) {
        return;
      }

      if (options.output === false) {
        return {
          code: `export default ${JSON.stringify(code)}`,
          map: { mappings: "" },
        };
      }

      if (!importOrder.includes(id)) {
        importOrder.push(id);
      }

      if (styles[id] !== code && (styles[id] || code)) {
        styles[id] = code;
        changes++;
      }

      return "";
    },
    generateBundle(opts, bundle) {
      if (options.output === false) {
        return;
      }

      if (changes) {
        changes = 0;
        source = "";

        for (let x = 0; x < importOrder.length; x++) {
          const id = importOrder[x];
          source += styles[id] ?? "";
        }
      }

      if (typeof options.output === "function") {
        options.output(source, styles, bundle);

        return;
      }

      if (!source.length) {
        return;
      }

      const fileName = typeof options.output === "string"
        ? options.output
        : getFileName(opts, bundle);

      this.emitFile({ type: "asset", fileName, source });
    },
  };
}
