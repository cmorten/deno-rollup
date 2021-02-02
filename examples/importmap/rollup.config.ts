import { dirname } from "../../deps.ts";
import { rollupImportMapPlugin } from "../../plugins/importmap/mod.ts";

const __dirname = dirname(import.meta.url);
const format = "es" as const;

export default {
  input: new URL("./src/mod.ts", `${__dirname}/`).href,
  plugins: [
    rollupImportMapPlugin({ maps: "./import_map.json" }),
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
