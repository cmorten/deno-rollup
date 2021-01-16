<p align="center">
  <h1 align="center">deno-rollup</h1>
</p>
<p align="center">
Next-generation ES module bundler for <a href="https://deno.land/">Deno</a> ported from <a href="https://github.com/rollup/rollup">Rollup</a>.</p>
<p align="center">
   <a href="https://github.com/cmorten/deno-rollup/tags/"><img src="https://img.shields.io/github/tag/cmorten/deno-rollup" alt="Current version" /></a>
   <img src="https://github.com/cmorten/deno-rollup/workflows/Test/badge.svg" alt="Current test status" />
   <a href="https://doc.deno.land/https/deno.land/x/drollup/mod.ts"><img src="https://doc.deno.land/badge.svg" alt="Deno docs" /></a>
   <a href="http://makeapullrequest.com"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs are welcome" /></a>
   <a href="https://github.com/cmorten/deno-rollup/issues/"><img src="https://img.shields.io/github/issues/cmorten/deno-rollup" alt="deno-rollup issues" /></a>
   <img src="https://img.shields.io/github/stars/cmorten/deno-rollup" alt="deno-rollup stars" />
   <img src="https://img.shields.io/github/forks/cmorten/deno-rollup" alt="deno-rollup forks" />
   <img src="https://img.shields.io/github/license/cmorten/deno-rollup" alt="deno-rollup license" />
   <a href="https://github.com/cmorten/deno-rollup/graphs/commit-activity"><img src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" alt="deno-rollup is maintained" /></a>
   <a href="http://hits.dwyl.com/cmorten/deno-rollup"><img src="http://hits.dwyl.com/cmorten/deno-rollup.svg" alt="deno-rollup repository visit count" /></a>
</p>

---

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Documentation](#documentation)
- [Example](#example)
- [Contributing](#contributing)
- [License](#license)

## Overview

[Rollup](https://github.com/rollup/rollup) is a module bundler for JavaScript which compiles small pieces of code into something larger and more complex, such as a library or application.

This library extends Rollup so that it can be used within Deno scripts to bundle Deno code.

## Installation

deno-rollup can be used either through a [command line interface (CLI)](https://rollupjs.org/guide/en/#command-line-reference) with an optional configuration file, or else through its [JavaScript API](https://rollupjs.org/guide/en/#javascript-api).

### CLI

To install the CLI run:

```console
deno install -f -q --allow-read --allow-write --allow-net --unstable https://deno.land/x/drollup@2+0.3./rollup.ts
```

And follow any suggestions to update your `PATH` environment variable.

You can then use the CLI to bundle your modules:

```console
# compile to an ESM
rollup main.js --format es --name "myBundle" --file bundle.js
```

### JavaScript API

You can import deno-rollup straight into your project to bundle your modules:

```ts
import { rollup } from "https://deno.land/x/drollup@2+0.3./mod.ts";

const options = {
  input: "./mod.ts",
  output: {
    dir: "./dist",
    format: "es" as "es",
    sourcemap: true,
  },
};

const bundle = await rollup(options);
await bundle.write(options.output);
```

## Documentation

Please refer to the official [Rollup Documentation](https://rollupjs.org). Specifically, please refer to the [JavaScript API](https://rollupjs.org/guide/en/#javascript-api) which this library extends to provide Deno compatibility.

> Note: currently this library only supports the `rollup` method, it does not yet have support for the `watch` method.

## Example

To run the [example](./example):

1. Clone the deno-rollup repo locally:

   ```bash
   git clone git://github.com/cmorten/deno-rollup.git --depth 1
   cd deno-rollup
   ```

1. Then enter the example directory and run the build script:

   ```bash
   cd example
   deno run --allow-read="./" --allow-write="./dist" --allow-net="deno.land" --unstable ./rollup.build.ts
   ```

1. Further details are available in the [example README](./example/README.md).

## Contributing

[Contributing guide](https://github.com/cmorten/rollup/blob/main/.github/CONTRIBUTING.md)

---

## License

deno-rollup is licensed under the [MIT License](./LICENSE.md).

The license for the Rollup library, which this library adapts, is available at [ROLLUP_LICENSE](./ROLLUP_LICENSE.md).
