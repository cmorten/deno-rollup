/**
 * Derived from <https://github.com/egoist/rollup-plugin-postcss>
 * 
 * Licensed as follows:
 * 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2017 EGOIST <0x142857@gmail.com>
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

import type {
  FilterPattern,
  NormalizedOutputOptions,
  OutputBundle,
  Plugin,
} from "../../mod.ts";
import type { AcceptedPlugin, ProcessOptions } from "./deps.ts";
import { createFilter } from "../../src/rollup/createFilter.ts";
import { parse, postcss as _postcss, postcssModules } from "./deps.ts";

/**
 * @public
 */
export type { AcceptedPlugin };

/**
 * @public
 */
export type RollupPostcssProcessOptions = Omit<ProcessOptions, "from">;

/**
 * @public
 */
export type RollupPostcssOutputFunction = (
  styles: string,
  styleNodes: Record<string, string>,
  bundle: OutputBundle,
) => void;

/**
 * @public
 */
export interface RollupPostcssOptions {
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
  output?: string | boolean | RollupPostcssOutputFunction | null;
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
  /**
   * PostCSS plugins to apply.
   * 
   * @default []
   */
  plugins?: AcceptedPlugin[];
  /**
   * Options to pass to PostCSS.
   */
  processOptions?: RollupPostcssProcessOptions;
  /**
   * Automatically enable CSS modules for files with `.module.*` extensions.
   * 
   * @default true
   */
  autoModules?: boolean;
  /**
   * Enable CSS modules for `postcss-modules`.
   * 
   * If an object is provided, it is passed as options to the `postcss-modules`
   * library.
   * 
   * @default false
   */
  modules?: boolean | Record<string, any>;
}

/**
 * @private
 */
function isCssModule(id: string) {
  return /\.module\.[a-z]{2,6}$/.test(id);
}

/**
 * @private
 */
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
 * A Rollup plugin that bundles imported css using postcss.
 * 
 * @param {RollupPostcssOptions} options Plugin options.
 * @returns {Plugin} Plugin instance.
 * @public
 */
export function postcss(options: RollupPostcssOptions = {}): Plugin {
  const filter = createFilter(options.include || ["**/*.css"], options.exclude);
  const autoModules = options.autoModules !== false &&
    options.modules !== true;

  const styles: Record<string, string> = {};
  const importOrder: string[] = [];

  let changes = 0;
  let source = "";

  return {
    name: "postcss",

    async transform(code, id) {
      if (!filter(id)) {
        return null;
      }

      const plugins = [...(options.plugins ?? [])];
      const cssModules: Record<string, any> = {};
      const supportModules = autoModules ? isCssModule(id) : options.modules;

      if (supportModules) {
        const postcssModulesOptions = typeof options.modules !== "object"
          ? {}
          : options.modules;

        plugins.unshift(postcssModules({
          ...postcssModulesOptions,
          getJSON(id: string, json: any, outpath: string) {
            cssModules[id] = json;

            if (typeof postcssModulesOptions.getJSON === "function") {
              return postcssModulesOptions.getJSON(id, json, outpath);
            }
          },
        }));
      }

      if (!plugins.length) {
        plugins.push({
          postcssPlugin: "postcss-noop-plugin",
          Once() {},
        });
      }

      const result = await _postcss(plugins).process(
        code,
        {
          to: id,
          ...options.processOptions,
          from: id,
        },
      );

      for (const message of result.messages) {
        if (message.type === "dependency") {
          this.addWatchFile(message.file);
        }
      }

      for (const warning of result.warnings()) {
        this.warn({ ...warning, message: warning.text });
      }

      const cssString = JSON.stringify(result.css);

      const defaultExport = supportModules
        ? JSON.stringify(cssModules[id])
        : cssString;

      if (!importOrder.includes(id)) {
        importOrder.push(id);
      }

      if (styles[id] !== result.css && (styles[id] || result.css)) {
        styles[id] = result.css;
        changes++;
      }

      return {
        code:
          `export default ${defaultExport}\nexport const stylesheet=${cssString}`,
        map: { mappings: "" },
      };
    },

    async generateBundle(opts, bundle) {
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

      const fileName = options.output === "string"
        ? options.output
        : getFileName(opts, bundle);

      this.emitFile({ type: "asset", fileName, source });
    },
  };
}
