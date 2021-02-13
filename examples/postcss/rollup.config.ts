import type { AcceptedPlugin } from "../../plugins/postcss/mod.ts";
import { default as autoprefixer } from "https://esm.sh/autoprefixer@10.2.4";
import { postcss } from "../../plugins/postcss/mod.ts";
import { html } from "../../plugins/html/mod.ts";
import { dirname } from "../../deps.ts";

const __dirname = dirname(import.meta.url);
const format = "es" as const;

export default {
  input: new URL("./src/main.ts", `${__dirname}/`).href,
  plugins: [
    postcss({
      modules: true,
      plugins: [autoprefixer as AcceptedPlugin],
    }),
    html(),
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
