import type { Plugin } from "../mod.ts";
import { pluginTerserTransform } from "https://deno.land/x/denopack@0.10.0/plugin/terserTransform/mod.ts";

const format = "es" as const;

export default {
  input: "./src/mod.ts",
  plugins: [
    pluginTerserTransform() as Plugin,
  ],
  output: {
    dir: "./dist",
    format,
    sourcemap: true,
  },
};
