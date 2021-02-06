import { dirname } from "../../deps.ts";
import { virtual } from "../../plugins/virtual/mod.ts";

const __dirname = dirname(import.meta.url);
const format = "es" as const;

export default {
  input: new URL("./src/mod.ts", `${__dirname}/`).href,
  plugins: [
    virtual({
      "log": `export default () => console.log("Hello Deno!");`,
    }),
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
