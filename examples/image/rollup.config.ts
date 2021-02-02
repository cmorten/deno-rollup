import { dirname } from "../../deps.ts";
import { image } from "../../plugins/image/mod.ts";
import { html } from "../../plugins/html/mod.ts";

const __dirname = dirname(import.meta.url);
const format = "es" as const;

export default {
  input: new URL("./src/mod.ts", `${__dirname}/`).href,
  plugins: [
    image({ dom: true }),
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
