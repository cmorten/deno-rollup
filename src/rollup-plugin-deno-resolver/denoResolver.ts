import type { Plugin } from "../../deps.ts";
import { parse } from "./parse.ts";
import { isTypescript } from "./isTypescript.ts";
import { resolveId } from "./resolveId.ts";
import { exists } from "./exists.ts";
import { loadUrl } from "./loadUrl.ts";
import { handleUnresolvedId } from "./handleUnresolvedId.ts";

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
 * `Deno.emit()` API.
 *
 * Accepts fetch options to pass to `fetch()` when requesting
 * remote URL imports, compiler options to pass to
 * `Deno.emit()` when transpiling typescript imports.
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
    async resolveId(source: string, importer?: string) {
      let id = resolveId(source, importer);
      let url = parse(id);

      if (!url) {
        return handleUnresolvedId(id, importer);
      }

      if (!(await exists(url, fetchOpts))) {
        // We assume extensionless imports are from bundling commonjs
        // as in Deno extensions are compulsory. We assume that the
        // extensionless commonjs file is JavaScript and not TypeScript.
        id += ".js";
        url = new URL(`${url.href}.js`);
      }

      if (!(await exists(url, fetchOpts))) {
        id = id.substr(0, id.length - 3);

        return handleUnresolvedId(id, importer);
      }

      return id;
    },
    async load(id: string) {
      const url = parse(id);

      if (!url) {
        return null;
      }

      const code = await loadUrl(url, fetchOpts);

      if (isTypescript(url.href)) {
        const outputUrlHref = `${url.href}.js`;
        const { files: { [outputUrlHref]: output } } = await Deno.emit(
          url,
          {
            check: false,
            compilerOptions: compilerOpts,
            sources: {
              [url.href]: code,
            },
          },
        );

        return output;
      }

      return code;
    },
  };
}
