import { css } from "../../plugins/css/mod.ts";
import { html } from "../../plugins/html/mod.ts";
import { dirname } from "../../deps.ts";

const __dirname = dirname(import.meta.url);
const format = "es" as const;

export default {
  input: new URL("./src/main.ts", `${__dirname}/`).href,
  plugins: [
    css(),
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
