export * as path from "https://deno.land/std@0.91.0/path/mod.ts";

export {
  compile,
  preprocess,
} from "https://deno.land/x/snel@v0.5.0/compiler/compiler.ts";

export type {
  compileOptions,
  PreprocessorGroup,
} from "https://deno.land/x/snel@v0.5.0/compiler/types.ts";
