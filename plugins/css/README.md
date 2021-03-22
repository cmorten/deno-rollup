# css

🍣 A Rollup plugin that bundles imported css.

This is a fork of the `rollup-plugin-css-only` package.

Please refer to the original
[README](https://github.com/thgh/rollup-plugin-css-only) for further
information.

## Usage

Create a `rollup.config.js`
[configuration file](https://www.rollupjs.org/guide/en/#configuration-files) and
import the plugin:

```ts
import { css } from "https://deno.land/x/drollup@2.42.3+0.17.0/plugins/css/mod.ts";

export default {
  input: "./src/mod.ts",
  output: {
    dir: "./dist",
    format: "es" as const,
  },
  plugins: [css()],
};
```

Then call `rollup` either via the
[CLI](https://www.rollupjs.org/guide/en/#command-line-reference) or the
[API](https://www.rollupjs.org/guide/en/#javascript-api).

## Options

### `exclude`

Type: `String` | `String[]`<br> Default: `null`

A [minimatch pattern](https://github.com/isaacs/minimatch), or array of
patterns, which specifies the files in the build the plugin should _ignore_. By
default no files are ignored.

### `include`

Type: `String` | `String[]`<br> Default: `null`

A [minimatch pattern](https://github.com/isaacs/minimatch), or array of
patterns, which specifies the files in the build the plugin should operate on.
By default all files are targeted.

### `output`

Type: `String` | `Function` | `Boolean`<br> Default: `null`

One of:

- A string filename to write all styles to;
- A callback that will be called once generated with three arguments:
  - `styles`: the contents of all style tags combined:
    `"body { color: green }"`;
  - `styleNodes`: an array of style objects:
    `[{ lang: "css", content: "body { color: green }" }]`;
  - `bundle`: the output bundle object;
- `false` to disable any style output or callbacks;
- `null` for the default behaviour: to write all styles to the bundle
  destination where .js is replaced by .css.

## Meta

[LICENSE (MIT)](./LICENSE.md)
