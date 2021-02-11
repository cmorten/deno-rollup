import svelte from "../../plugins/svelte/mod.ts";
import { dirname } from "../../deps.ts";

const __dirname = dirname(import.meta.url);
const format = "es" as const;

export default {
  input: new URL("./src/main.js", `${__dirname}/`).href,
  plugins: [
    svelte(),
  ],
  output: {
    dir: "./dist",
    format,
    sourcemap: true,
  },
  // Suppress circular dependency warnings about Deno's std library!
  onwarn: () => {},
};
