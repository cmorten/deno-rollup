export * as path from "https://deno.land/std@0.91.0/path/mod.ts";

export {
  compile,
  preprocess,
} from "https://deno.land/x/snel@v0.0.5/compiler/core.js";

export type {
  compileOptions,
  PreprocessorGroup,
} from "https://deno.land/x/snel@v0.0.5/compiler/types.ts";
