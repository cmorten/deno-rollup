<p>
  <h1>deno-rollup</h1>
</p>
<p>
Next-generation ES module bundler for <a href="https://deno.land/">Deno</a> ported from <a href="https://github.com/rollup/rollup">Rollup</a>.</p>

[![Current version](https://img.shields.io/github/tag/cmorten/deno-rollup)](https://github.com/cmorten/deno-rollup/tags/)
[![Current test status](https://github.com/cmorten/deno-rollup/workflows/Test/badge.svg)](https://github.com/cmorten/deno-rollup/actions)
[![Deno docs](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/drollup/mod.ts)
[![PRs are welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![deno-rollup issues](https://img.shields.io/github/issues/cmorten/deno-rollup)](https://github.com/cmorten/deno-rollup/issues/)
![deno-rollup stars](https://img.shields.io/github/stars/cmorten/deno-rollup)
![deno-rollup forks](https://img.shields.io/github/forks/cmorten/deno-rollup)
![deno-rollup license](https://img.shields.io/github/license/cmorten/deno-rollup)
[![deno-rollup is maintained](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/cmorten/deno-rollup/graphs/commit-activity)
[![deno-rollup repository visit count](https://hits.dwyl.com/cmorten/deno-rollup.svg)](https://hits.dwyl.com/cmorten/deno-rollup)

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
deno install -f -q --allow-read --allow-write --allow-net --allow-env --unstable https://deno.land/x/drollup@2.37.1+0.5.1/rollup.ts
```

And follow any suggestions to update your `PATH` environment variable.

You can then use the CLI to bundle your modules:

```console
# compile to an ESM
rollup main.js --format es --name "myBundle" --file bundle.js
```

You can also rebuild the bundle when it's source or config files change on disk using the `--watch` flag:

```console
# recompile based on `rollup.config.ts` when source files change
rollup -c --watch
```

### JavaScript API

You can import deno-rollup straight into your project to bundle your modules:

```ts
import { rollup } from "https://deno.land/x/drollup@2.37.1+0.5.1/mod.ts";

const options = {
  input: "./mod.ts",
  output: {
    dir: "./dist",
    format: "es" as const,
    sourcemap: true,
  },
};

const bundle = await rollup(options);
await bundle.write(options.output);
```

Or using the `watch` API:

```ts
import { watch } from "https://deno.land/x/drollup@2.37.1+0.5.1/mod.ts";

const options = {
  input: "./src/mod.ts",
  output: {
    dir: "./dist",
    format: "es" as const,
    sourcemap: true,
  },
  watch: {
    include: ["src/**"],
  },
};

const watcher = await watch(options);

watcher.on("event", (event) => {
  // event.code can be one of:
  //   START        — the watcher is (re)starting
  //   BUNDLE_START — building an individual bundle
  //                  * event.input will be the input options object if present
  //                  * event.outputFiles cantains an array of the "file" or
  //                    "dir" option values of the generated outputs
  //   BUNDLE_END   — finished building a bundle
  //                  * event.input will be the input options object if present
  //                  * event.outputFiles cantains an array of the "file" or
  //                    "dir" option values of the generated outputs
  //                  * event.duration is the build duration in milliseconds
  //                  * event.result contains the bundle object that can be
  //                    used to generate additional outputs by calling
  //                    bundle.generate or bundle.write. This is especially
  //                    important when the watch.skipWrite option is used.
  //                  You should call "event.result.close()" once you are done
  //                  generating outputs, or if you do not generate outputs.
  //                  This will allow plugins to clean up resources via the
  //                  "closeBundle" hook.
  //   END          — finished building all bundles
  //   ERROR        — encountered an error while bundling
  //                  * event.error contains the error that was thrown
});

// This will make sure that bundles are properly closed after each run
watcher.on("event", (event) => {
  if (event.code === "BUNDLE_END") {
    event.result.close();
  }
});

// stop watching
watcher.close();
```

## Documentation

Please refer to the official [Rollup Documentation](https://rollupjs.org).

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
