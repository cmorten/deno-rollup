# Rollup plugin to serve the bundle

<a href="LICENSE">
  <img src="https://img.shields.io/badge/license-MIT-brightgreen.svg" alt="Software License" />
</a>
<a href="https://github.com/thgh/rollup-plugin-serve/issues">
  <img src="https://img.shields.io/github/issues/denyncrawford/deno-rollup-plugin-serve.svg" alt="Issues" />
</a>
<a href="https://github.com/standard/ts-standard/">
  <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg" alt="Typescript Style Guide" />
</a>
<a href="https://deno.land/x/deno-rollup-plugin-serve">
  <img src="https://img.shields.io/badge/deno-^1.8.1-informational.svg?style=flat-squar" alt="Deno.land" />
</a>
<a href="https://github.com/denyncrawford/deno-rollup-plugin-serve/releases">
  <img src="https://img.shields.io/github/release/denyncrawford/deno-rollup-plugin-serve.svg" alt="Latest Version" />
</a>

[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/your-module)

## Overview

This modules made for [deno-rollup](https://github.com/cmorten/deno-rollup) ***Next-generation ES module bundler for Deno ported from Rollup.***

**deno-rollup-plugin-serve** is a Deno rebuilt/port from [rollup-plugin-serve](https://www.npmjs.com/package/rollup-plugin-serve). It creates a development server for testing your front-end apps.

## Import
```typescript
# Deno Rollup v2.36.1+0.1.2+
import serve from 'https://deno.land/x/drollup_plugin_serve@1.1.0+0.1.3/mod.ts'
// or
import serve from 'http://x.nest.land/deno-rollup-plugin-serve@4.1.0/mod.ts'
```

## Usage
```js
// rollup.config.js
import serve from '...'

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: ...
  },
  plugins: [
    serve('dist')
  ]
}
```

### Options

By default it serves the current project folder. Change it by passing a string:
```js
serve('public')    // will be used as contentBase

// Default options
serve({
  // Launch in browser (default: false)
  open: true,

  // Page to navigate to when opening the browser.
  // Will not do anything if open=false.
  // Remember to start with a slash.
  openPage: '/different/page',

  // Show server address in console (default: true)
  verbose: false,

  // Folder to serve files from
  contentBase: '',

  // Multiple folders to serve from
  contentBase: ['dist', 'static'],

  // Set to true to return index.html (200) instead of error page (404)
  historyApiFallback: false,

  // Path to fallback page
  historyApiFallback: '/200.html',

  // Options used in setting up server
  host: 'localhost',
  port: 10001,

  // By default server will be served over HTTP (https: false). It can optionally be served over HTTPS
  https: {
    key: fs.readFileSync('/path/to/server.key'),
    cert: fs.readFileSync('/path/to/server.crt'),
    ca: fs.readFileSync('/path/to/ca.pem')
  },

  //set headers
  headers: {
    'Access-Control-Allow-Origin': '*',
    foo: 'bar'
  },

  // set custom mime types, usage https://github.com/broofa/mime#mimedefinetypemap-force--false
  mimeTypes: {
    'application/javascript': ['js_commonjs-proxy']
  }

  // execute function after server has begun listening
  onListening: function (server) {
    const address = server.address()
    const host = address.address === '::' ? 'localhost' : address.address
    // by using a bound function, we can access options as `this`
    const protocol = this.https ? 'https' : 'http'
    console.log(`Server listening at ${protocol}://${host}:${address.port}/`)
  }
})
```

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## Contributing

Contributions and feedback are very welcome.

This project aims to stay lean and close to standards. New features should encourage to stick to standards. Options that match the behaviour of [webpack-dev-server](https://webpack.js.org/configuration/dev-server/#devserver) are always ok.

## Credits

- [Thomas Ghysels](https://github.com/thgh)
- [Miguel Rangel][link-author-2]
- [All Contributors][link-contributors]

## License

The MIT License (MIT). Please see [License File](LICENSE) for more information.

[link-author]: https://github.com/thgh
[link-author-2]: https://github.com/denyncrawford
[link-contributors]: ../../contributors
[rollup-plugin-serve]: https://www.npmjs.com/package/rollup-plugin-serve