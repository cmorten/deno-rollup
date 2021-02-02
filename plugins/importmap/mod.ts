/**
 * Derived from <https://github.com/trygve-lie/rollup-plugin-import-map>
 * 
 * Licensed as follows:
 * 
 * MIT License
 * 
 * Copyright (c) 2020 Trygve Lie
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

import type { NormalizedInputOptions, Plugin } from "../../mod.ts";
import { dirname, fromFileUrl, normalize, relative } from "./deps.ts";
import { ensureArray } from "../../src/ensureArray.ts";
import { resolveId } from "../../src/rollup-plugin-deno-resolver/resolveId.ts";

/**
 * @public
 */
export interface ImportMapObject {
  imports: Record<string, string>;
  scopes?: Record<string, Record<string, string>>;
}

/**
 * @public
 */
export type ImportMapPath = string;

/**
 * @public
 */
export type ImportMap = ImportMapObject | ImportMapPath;

/**
 * @public
 */
export interface RollupImportMapOptions {
  /**
   * A path to an import map, an inline import map object, or an
   * array containing any combination of the above.
   * @default []
   */
  maps?: ImportMap | ImportMap[];
  /**
   * If `true`, instructs Rollup to mark imports declared in the
   * provided import maps as external. If `false` the imports
   * are bundled. If not specified, the external status will be
   * determined by Rollup and other provided plugins when the
   * import path is resolved.
   */
  external?: boolean;
}

/**
 * isBareImportSpecifier
 * 
 * @param {string} address 
 * @returns {boolean}
 * @private
 */
const isBareImportSpecifier = (address: string) => {
  if (
    address.startsWith("/") || address.startsWith("./") ||
    address.startsWith("../") ||
    address.startsWith("http://") || address.startsWith("https://") ||
    address.startsWith("file://")
  ) {
    return false;
  }

  return true;
};

/**
 * validate
 * 
 * @param {ImportMapObject} importMap 
 * @param {NormalizedInputOptions} options 
 * @private
 */
const validate = (
  importMap: ImportMapObject,
  options: NormalizedInputOptions,
  baseUrl: string,
) =>
  Object.keys(importMap.imports).map((specifier) => {
    const address = importMap.imports[specifier];

    if (isBareImportSpecifier(address)) {
      throw new TypeError(
        `import specifier "${specifier}" can not be mapped to a bare import statement "${address}".`,
      );
    }

    if (typeof options.external === "function") {
      if (options.external(specifier, undefined, false)) {
        throw new TypeError(
          "import specifier must not be present in the Rollup external config",
        );
      }
    }

    if (Array.isArray(options.external)) {
      if (options.external.includes(specifier)) {
        throw new TypeError(
          "import specifier must not be present in the Rollup external config",
        );
      }
    }

    return { specifier, address, baseUrl };
  });

/**
 * readFile
 * 
 * @param {string} pathname 
 * @param options 
 * @private
 */
const readFile = async (
  path: string,
  options: NormalizedInputOptions,
) => {
  const importMapPath = normalize(path);
  const importMapFile = await Deno.readTextFile(importMapPath);
  const importMap = JSON.parse(importMapFile);

  return validate(importMap, options, dirname(importMapPath));
};

// TODO: consider scopes

/**
 * rollupImportMapPlugin
 * 
 * Apply [import map](https://github.com/WICG/import-maps)
 * mappings to ES modules.
 * 
 * @param {RollupImportMapOptions} rollupImportMapOptions
 * @returns {Plugin}
 * @public
 */
export function rollupImportMapPlugin(
  rollupImportMapOptions: RollupImportMapOptions,
): Plugin {
  const cache = new Map();
  const cwd = Deno.cwd();
  const importMaps = ensureArray(rollupImportMapOptions.maps);

  function getAddress(source: string, importer?: string) {
    for (const [specifier, { address, baseUrl }] of cache.entries()) {
      let base = baseUrl;

      if (importer) {
        if (importer.startsWith("file://")) {
          base = relative(fromFileUrl(importer), baseUrl);
        } else {
          base = relative(importer, baseUrl);
        }
      }

      const resolvedAddress = resolveId(address, base);

      if (specifier === source) {
        return resolvedAddress;
      } else if (
        specifier.endsWith("/") &&
        source.startsWith(specifier)
      ) {
        const suffix = source.slice(specifier.length);

        return resolveId(suffix, resolvedAddress);
      }
    }

    return null;
  }

  return {
    name: "rollup-plugin-import-map",

    async buildStart(options) {
      const mappings = await Promise.all(
        importMaps.map((importMap) => {
          if (typeof importMap === "string") {
            return readFile(importMap, options);
          }

          return validate(importMap, options, cwd);
        }),
      );

      mappings.forEach((map) => {
        map.forEach(({ specifier, address, baseUrl }) => {
          cache.set(specifier, { address, baseUrl });
        });
      });
    },

    async resolveId(source, importer) {
      const address = getAddress(source, importer);

      if (address) {
        const resolvedId = await this.resolve(address, importer);

        if (resolvedId !== null) {
          return {
            id: resolvedId.id,
            external: rollupImportMapOptions.external ?? resolvedId.external,
          };
        }
      }

      return null;
    },
  };
}
