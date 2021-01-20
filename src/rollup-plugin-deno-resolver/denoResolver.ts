import type { Plugin } from "../rollup/mod.ts";
import { parse } from "./parse.ts";
import { isTypescript } from "./isTypescript.ts";
import { isUrl } from "./isUrl.ts";
import { resolveId } from "./resolveId.ts";
import { loadUrl } from "./loadUrl.ts";

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
      const url = parse(source, importer);

      if (!url) {
        return null;
      }

      if (isTypescript(url.href)) {
        const outputUrlHref = url.href + ".js";
        const { files: { [outputUrlHref]: output } } = await Deno.emit(
          url,
          {
            check: false,
            compilerOptions: compilerOpts,
          },
        );

        return output;
      }
      
      const code = await loadUrl(url, fetchOpts);

      // TODO: URL import source maps not yet supported
      if (isUrl(source)) {
        return { code, map: { mappings: "" } };
      }

      return code;
    },
  };
}
