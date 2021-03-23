# postcss

🍣 A Rollup plugin to apply [PostCSS](https://github.com/postcss/postcss)
transforms to styles.

This is a fork of the `rollup-plugin-postcss` package.

Please refer to the original
[README](https://github.com/egoist/rollup-plugin-postcss) for further
information.

## Usage

Create a `rollup.config.js`
[configuration file](https://www.rollupjs.org/guide/en/#configuration-files) and
import the plugin:

```ts
import { postcss } from "https://deno.land/x/drollup@2.42.3+0.17.1/plugins/postcss/mod.ts";

export default {
  input: "./src/mod.ts",
  output: {
    dir: "./dist",
    format: "es" as const,
  },
  plugins: [postcss()],
};
```

Then call `rollup` either via the
[CLI](https://www.rollupjs.org/guide/en/#command-line-reference) or the
[API](https://www.rollupjs.org/guide/en/#javascript-api).

## Options

### `autoModules`

Type: `boolean`<br> Default: `true`

Automatically enable CSS modules for files with `.module.*` extensions.

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

### `modules`

Type: `boolen` | `Object`<br> Default: `false`

Enable CSS modules for `postcss-modules`.

If an object is provided, it is passed as options to the `postcss-modules`
library.

### `output`

Type: `string` | `Function` | `boolean`<br> Default: `null`

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

### `plugins`

Type: `Object[]`<br> Default: `null`

PostCSS plugins to apply.

### `processOptions`

Type: `Object`<br> Default: `null`

Options to pass to PostCSS.

## Meta

[LICENSE (MIT)](./LICENSE.md)
