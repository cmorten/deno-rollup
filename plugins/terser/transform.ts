// deno-lint-ignore-file no-explicit-any
import type { MinifyOptions } from "./types.ts";
import "https://unpkg.com/source-map@0.7.3/dist/source-map.js";
import "https://unpkg.com/terser@5.7.1/dist/bundle.min.js";

const minify = (globalThis as any).Terser.minify;
delete (globalThis as any).Terser;

export const transform = async (code: string, options?: MinifyOptions) => {
  const result = await minify(
    code,
    options,
  );

  return {
    result,
    nameCache: options?.nameCache,
  };
};
