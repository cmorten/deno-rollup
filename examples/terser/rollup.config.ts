import { dirname } from "../../deps.ts";
import { terser } from "../../plugins/terser/mod.ts";

const __dirname = dirname(import.meta.url);
const format = "es" as const;

export default {
  input: new URL("./src/mod.ts", `${__dirname}/`).href,
  output: {
    dir: "./dist",
    format,
    sourcemap: true,
  },
  plugins: [terser()],
  watch: {
    include: ["src/**"],
    clearScreen: true,
  },
  // Suppress circular dependency warnings about Deno's std library!
  onwarn: () => {},
};
