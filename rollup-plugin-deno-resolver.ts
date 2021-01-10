import type { Plugin } from "./mod.ts";
import {
  dirname,
  extname,
  isAbsolute,
  join,
  resolve,
  sep,
  toFileUrl,
} from "https://deno.land/std@0.83.0/path/mod.ts";

const RE_URL = /^(https?|file):\/\//;
const RE_TS = /^\.tsx?$/;

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
 * @param {string} [importer] 
 * @returns {string | undefined}
 * @private
 */
function getBase(importer?: string): string {
  return importer
    ? resolve(join(dirname(importer), sep))
    : join(Deno.cwd(), sep);
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
  importer?: string,
): URL | null {
  try {
    return new URL(source);
  } catch {
    // Suppress
  }

  try {
    const base = getBase(importer);

    return new URL(source, toFileUrl(base));
  } catch (_) {
    return null;
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
): Promise<string> | never {
  switch (url.protocol) {
    case "file:": {
      return await Deno.readTextFile(url);
    }
    case "http:":
    case "https:": {
      const res = await fetch(url.href, fetchOpts);

      return await res.text();
    }
    default: {
      return notImplemented(url.protocol);
    }
  }
}

/**
 * isTypescript
 * 
 * @param {string} source 
 * @returns {boolean}
 * @private
 */
function isTypescript(source: string): boolean {
  return RE_TS.test(source);
}

/**
 * isUrl
 * 
 * @param {string} source 
 * @returns {boolean}
 * @private
 */
function isUrl(source: string): boolean {
  return RE_URL.test(source);
}

/**
 * resolveId
 * 
 * @param {string} source 
 * @param {string} [importer]
 * @returns {string}
 * @private
 */
function resolveId(source: string, importer?: string): string {
  if (isUrl(source) || isAbsolute(source)) {
    return source;
  }

  return importer ? join(dirname(importer), source) : source;
}

/**
 * @public
 */
export type DenoResolverOptions = {
  fetchOpts?: RequestInit;
  compilerOpts?: Deno.CompilerOptions;
};

/**
 * denoResolver
 * 
 * Resolver plugin for Deno. Handles relative, absolute
 * and URL imports. Typescript files are detected automatically
 * by extension matching, and transpiled using the
 * `Deno.transpileOnly()` API.
 * 
 * Accepts fetch options to pass to `fetch()` when requesting
 * remote URL imports, compiler options to pass to
 * `Deno.transpileOnly()` when transpiling typescript imports.
 * 
 * @param {DenoResolverOptions} [opts] 
 * @param {RequestInit} [opts.fetchOpts] 
 * @param {Deno.CompilerOptions} [opts.compilerOpts] 
 * @returns {Plugin}
 * @public
 */
export function denoResolver(
  { fetchOpts, compilerOpts }: DenoResolverOptions = {},
): Plugin | never {
  return {
    name: "rollup-plugin-deno-resolver",
    resolveId(source: string, importer?: string) {
      return resolveId(source, importer);
    },
    async load(source: string, importer?: string) {
      const id = resolveId(source, importer);
      const url = parse(source, importer);

      // Unable to resolve the import url
      if (!url) {
        return null;
      }

      const code = await loadUrl(url, fetchOpts);

      if (isTypescript(extname(url.href))) {
        const { [id]: { source } } = await Deno.transpileOnly(
          { [id]: code },
          compilerOpts,
        );

        return source;
      }

      // URL import source maps not supported
      if (isUrl(source)) {
        return { code, map: { mappings: "" } };
      }

      return code;
    },
  };
}

export default denoResolver;
