import { dirname } from "../../deps.ts";
import { esbuild } from "../../plugins/esbuild/mod.ts";

const __dirname = dirname(import.meta.url);
const format = "es" as const;

export default {
  input: new URL("./src/mod.ts", `${__dirname}/`).href,
  output: {
    dir: "./dist",
    format,
    sourcemap: true,
  },
  plugins: [
    esbuild({
      buildOptions: {
        minify: true,
        format: "esm",
        treeShaking: true
      },
    }),
  ],
  watch: {
    include: ["src/**"],
    clearScreen: true,
  },
};
