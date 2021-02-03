# importmap

🍣 A Rollup plugin to apply [import map](https://github.com/WICG/import-maps) mappings to ES modules.

## Usage

Assuming a `import_map.json` exists and contains:

```json
{
  "imports": {
    "fmt/": "https://deno.land/std@0.85.0/fmt/"
  }
}
```

Create a `rollup.config.js` [configuration file](https://www.rollupjs.org/guide/en/#configuration-files) and import the plugin:

```ts
import { rollupImportMapPlugin } from "https://deno.land/x/drollup@2.38.4+0.9.0/plugins/importmap/mod.ts";

export default {
  input: "./src/mod.ts",
  output: {
    dir: "./dist",
    format: "es" as const,
  },
  plugins: [rollupImportMapPlugin({ maps: "./import_map.json" })],
};
```

Then call `rollup` either via the [CLI](https://www.rollupjs.org/guide/en/#command-line-reference) or the [API](https://www.rollupjs.org/guide/en/#javascript-api).

## Options

### `maps`

Type: `String` | `Object` | `(String | Object)[]`
Default: `[]`

A path to an import map, an inline import map object, or an array containing any combination of the above.

### `external`

Type: `Boolean`
Default: `null`

If `true`, instructs Rollup to mark imports declared in the provided import maps as external. If `false` the imports are bundled. If not specified, the external status will be determined by Rollup and other provided plugins when the import path is resolved.

### `baseUrl`

Type: `String`
Default: `null`

Set the base url from which the relative-URL-like addresses are resolved.

If not provided, the base url will the location of the import map if an import map path is provided, or the current working directory if not.

## Meta

[LICENSE (MIT)](./LICENSE.md)
