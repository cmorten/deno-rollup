# terser

🍣 A Rollup plugin to apply [terser](https://github.com/terser/terser) transforms
to styles.

This is a fork of the `rollup-plugin-terser` package.

Please refer to the original
[README](https://github.com/TrySound/rollup-plugin-terser) for further
information.

This plugin requires the `--allow-read` and `--allow-net` permissions.

## Usage

Create a `rollup.config.js`
[configuration file](https://www.rollupjs.org/guide/en/#configuration-files) and
import the plugin:

```ts
import { terser } from "https://deno.land/x/drollup@2.50.5+0.18.1/plugins/terser/mod.ts";

export default {
  input: "./src/mod.ts",
  output: {
    dir: "./dist",
    format: "es" as const,
  },
  plugins: [terser()],
};
```

Then call `rollup` either via the
[CLI](https://www.rollupjs.org/guide/en/#command-line-reference) or the
[API](https://www.rollupjs.org/guide/en/#javascript-api).

## Options

Please refer to the
[terser minify options](https://github.com/terser/terser#minify-options).

Note that some terser options are set by the plugin automatically:

- `module`: true is set when format is `es`.
- `toplevel`: true is set when format is `cjs`.

## Meta

[LICENSE (MIT)](./LICENSE.md)
