import type { Plugin } from "../mod.ts";
import { dirname } from "../deps.ts";
import { pluginTerserTransform } from "https://deno.land/x/denopack@0.10.0/plugin/terserTransform/mod.ts";

const __dirname = dirname(import.meta.url);
const format = "es" as const;

export default {
  input: new URL("./src/mod.ts", `${__dirname}/`).href,
  plugins: [
    pluginTerserTransform() as Plugin,
  ],
  output: {
    dir: "./dist",
    format,
    sourcemap: true,
  },
  watch: {
    include: ["src/**"],
    clearScreen: true,
  },
  // Suppress circular dependency warnings about Deno's std library!
  onwarn: () => {},
};
