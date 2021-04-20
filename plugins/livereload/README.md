# Rollup plugin LiveReload

<a href="LICENSE">
  <img src="https://img.shields.io/badge/license-MIT-brightgreen.svg" alt="Software License" />
</a>
<a href="https://github.com/denyncrawford/deno-rollup-plugin-livereload/issues">
  <img src="https://img.shields.io/github/issues/denyncrawford/deno-rollup-plugin-livereload.svg" alt="Issues" />
</a>
<a href="https://github.com/standard/ts-standard/">
  <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg" alt="Typescript Style Guide" />
</a>
<a href="https://deno.land/x/drollup_plugin_livereload">
  <img src="https://img.shields.io/badge/deno-^1.8.1-informational.svg?style=flat-squar" alt="Deno.land" />
</a>
<a href="https://github.com/denyncrawford/deno-rollup-plugin-livereload/releases">
  <img src="https://img.shields.io/github/release/denyncrawford/deno-rollup-plugin-livereload.svg" alt="Latest Version" />
</a>

## Overview

This modules made for [deno-rollup](https://github.com/cmorten/deno-rollup) **Next-generation ES module bundler for Deno ported from Rollup**.

deno-rollup-plugin-livereload is a Deno rebuilt/port from rollup-plugin-livereload. Automatically reload your browser when the filesystem changes.

## Import

```typescript
import livereload from 'https://deno.land/x/drollup_plugin_livereload@0.1.0/mod.ts'
```

## Usage

```js
// rollup.config.js

export default {
  entry: 'entry.js',
  dest: 'bundle.js',
  plugins: [livereload()],
}
```

To make it a real dev-server, combine this plugin with [deno-rollup-plugin-serve].

```js
// rollup.config.js
import serve from 'https://deno.land/x/drollup_plugin_serve/mod.ts'
import livereload from 'https://deno.land/x/drollup_plugin_livereload/mod.ts'

export default {
  entry: 'entry.js',
  dest: 'bundle.js',
  plugins: [
    serve(), // index.html should be in root of project
    livereload(),
  ],
}
```

### Options

By default, it watches the current directory. If you also have css output, pass the folder to which the build files are written.

```typescript
livereload('dist')

// --- OR ---

livereload({
  base: ['dist'],
  verbose: false, // Disable console output

  // other livereload options
  exclude: ['*.ts']
})
```

Options are always passed to [`new LiveReload()`][deno-livereload]

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## Contributing

Contributions and feedback are very welcome.

## Credits

- [Thomas Ghysels](https://github.com/thgh)
- [Miguel Rangel](https://github.com/denyncrawford)
- [All Contributors][link-contributors]

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.

[link-author]: https://github.com/thgh
[link-contributors]: ../../contributors
[deno-livereload]: https://deno.land/x/livereload
[deno-rollup-plugin-serve]: https://deno.land/x/drollup_plugin_serve