const format = "es" as const;

export default {
  input: "./src/mod.ts",
  output: {
    dir: "./dist",
    format,
    sourcemap: true,
  },
};
