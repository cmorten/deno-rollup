// @deno-types="https://unpkg.com/rollup@2.36.1/dist/rollup.d.ts"
export {
  rollup,
  VERSION,
} from "https://unpkg.com/rollup@2.36.1/dist/es/rollup.browser.js";
export type {
  OutputOptions,
  RollupBuild,
  RollupOptions,
  RollupOutput,
  RollupWatcher,
  RollupWatchOptions,
} from "https://unpkg.com/rollup@2.36.1/dist/rollup.d.ts";
export {
  dirname,
  isAbsolute,
  join,
  resolve,
  sep,
  toFileUrl,
} from "https://deno.land/std@0.83.0/path/mod.ts";
