import { denoResolver } from "../rollup-plugin-deno-resolver.ts";

export default {
  input: "./src/mod.js",
  plugins: [denoResolver()],
  output: {
    file: "./dist/mod.js",
    format: "es" as "es",
    sourcemap: true
  },
};
