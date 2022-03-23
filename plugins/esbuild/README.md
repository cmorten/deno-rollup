# esbuild

🍣 A Rollup plugin to apply [esbuild](https://github.com/evanw/esbuild)
transforms to code.

## Usage

Create a `rollup.config.js`
[configuration file](https://www.rollupjs.org/guide/en/#configuration-files) and
import the plugin:

```ts
import { esbuild } from "https://deno.land/x/drollup@2.58.0+0.20.0/plugins/esbuild/mod.ts";

export default {
  input: "./src/mod.ts",
  output: {
    dir: "./dist",
    format: "es" as const,
  },
  plugins: [esbuild({ loader: "ts", minify: true })],
};
```

Then call `rollup` either via the
[CLI](https://www.rollupjs.org/guide/en/#command-line-reference) or the
[API](https://www.rollupjs.org/guide/en/#javascript-api).

## Options

### `exclude`

Type: `string` | `string[]`<br> Default: `null`

A [minimatch pattern](https://github.com/isaacs/minimatch), or array of
patterns, which specifies the files in the build the plugin should _ignore_. By
default no files are ignored.

### `include`

Type: `string` | `string[]`<br> Default: `null`

A [minimatch pattern](https://github.com/isaacs/minimatch), or array of
patterns, which specifies the files in the build the plugin should operate on.
By default all files are targeted.

### `transformOptions`

Type: `Object`

Esbuild [transform options](https://esbuild.github.io/api/#transform-api).

## Meta

[LICENSE (MIT)](./LICENSE.md)
