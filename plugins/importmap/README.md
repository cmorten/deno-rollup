# importmap

🍣 A Rollup plugin to apply [import map](https://github.com/WICG/import-maps) mappings to ES modules.

## Usage

```ts
import { rollupImportMapPlugin } from "https://deno.land/x/drollup@2.38.4+0.9.0/plugins/importmap/mod.ts";

export default {
  input: "./src/mod.ts",
  plugins: [rollupImportMapPlugin({ maps: "./import-map.json" })],
  output: {
    dir: "./dist",
    format: "es" as const,
  },
};
```
