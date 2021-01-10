/**
 * Derived from rollup-plugin-url-resolve (https://github.com/mjackson/rollup-plugin-url-resolve)
 * 
 * Licensed as follows:
 * 
 * Copyright 2019 Michael Jackson
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 */

import type { Plugin } from "./rollup.ts";
import {
  dirname,
  isAbsolute,
  join,
  resolve,
  sep,
  toFileUrl,
} from "https://deno.land/std@0.83.0/path/mod.ts";
/**
 * notImplemented
 * 
 * @param {string} [msg]
 * @throws {Error}
 * @private
 */
function notImplemented(msg?: string): never {
  const message = msg ? `Not implemented: ${msg}` : "Not implemented";
  throw new Error(message);
}

/**
 * getBase
 * 
 * @param {string} [parent] 
 * @returns {string | undefined}
 * @private
 */
function getBase(parent?: string): string {
  return parent ? resolve(join(dirname(parent), sep)) : join(Deno.cwd(), sep);
}

/**
 * parse
 * 
 * @param {string} source 
 * @param {string | URL} base 
 * @returns {URL | null}
 * @private
 */
function parse(
  source: string,
  parent?: string,
): URL | null {
  try {
    return new URL(source);
  } catch (_) {}

  try {
    const base = getBase(parent);

    return new URL(source, toFileUrl(base));
  } catch (_) {
    return null;
  }
}

/**
 * resolveUrl
 * 
 * @param {URL} url 
 * @returns {string}
 * @private
 */
function resolveUrl(url: URL): string {
  switch (url.protocol) {
    case "file:":
    case "http:":
    case "https:":
      return url.pathname;
    default:
      throw new Error(`Cannot resolve protocol: ${url.protocol}`);
  }
}

/**
 * loadUrl
 * 
 * @param {URL} url 
 * @param {RequestInit} [fetchOpts] 
 * @returns {Promise<string | null> | never}
 * @private
 */
async function loadUrl(
  url: URL,
  fetchOpts?: RequestInit,
): Promise<string | null> | never {
  switch (url.protocol) {
    case "file:":
      return await Deno.readTextFile(url);
    case "http:":
    case "https:":
      const res = await fetch(url.href, fetchOpts);

      if (res.status === 404) {
        return null;
      }

      return await res.text();
    default:
      return notImplemented(url.protocol);
  }
}

/**
 * getRelativeBase
 * 
 * @param {string} parent
 * @returns {string}
 * @private
 */
function getRelativeBase(parent: string): string {
  return `.${sep}${join(dirname(parent), sep)}`;
}

/**
 * isUrl
 * 
 * @param {string} source 
 * @returns {boolean}
 * @private
 */
function isUrl(source: string): boolean {
  return /^(https?|file):\/\/.*$/.test(source);
}

/**
 * denoResolver
 * 
 * @param {RequestInit} [fetchOpts] 
 * @returns {Plugin}
 * @public
 */
export function denoResolver(fetchOpts?: RequestInit): Plugin {
  return {
    name: "rollup-plugin-deno-resolver",
    resolveId(source: string, parent?: string) {
      // Needs to return value reflective of source, i.e. absolute, relative or URL.
      if (isUrl(source) || isAbsolute(source)) {
        return source;
      }

      return parent ? join(getRelativeBase(parent), source) : source;
    },
    load: async function (source: string, parent?: string) {
      const url = parse(source, parent);

      return url ? await loadUrl(url, fetchOpts) : null;
    },
  };
}

export default denoResolver;
