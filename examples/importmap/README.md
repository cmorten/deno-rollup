# importmap

This is a basic example to show Rollup usage with the `importmap` plugin.

The Rollup config is defined in the `./rollup.config.ts` file, and specifies
that we wish to created ES bundles from our code in the `./src` directory,
including source maps.

The code in `./src` makes use of the mappings in the `./import_map.json` import
map.

## Usage

### Bundling

#### Bundle Script

To invoke Rollup to bundle files in the `./src` directory, from this directory
run:

```console
# Direct from repository
deno run --allow-read="./" --allow-write="./dist" --allow-net="deno.land" --allow-env --unstable https://deno.land/x/drollup@2.50.5+0.18.2/examples/importmap/rollup.build.ts

# When cloned locally
deno run --allow-read="./" --allow-write="./dist" --allow-net="deno.land" --allow-env --unstable ./rollup.build.ts
```

This executes the `./rollup.build.ts` file, which imports the config, invokes
Rollup and then writes out the bundles.

To execute your newly bundled server code run:

```console
deno run --allow-read="./" --allow-net="0.0.0.0:3000" ./dist/mod.js
```

The code starts an [Opine](https://github.com/asos-craigmorten/opine) server on
<http://0.0.0.0:3000> and returns a simple message with your CWD.

#### Bundle CLI

Alternatively you can use the Rollup CLI to bundle files.

Install the CLI:

```console
deno install -f -q --allow-read --allow-write --allow-net --allow-env --unstable https://deno.land/x/drollup@2.50.5+0.18.2/rollup.ts
```

And follow any suggestions to update your `PATH` environment variable.

You can then bundle the files using the `rollup.config.ts` with:

```console
rollup -c
```

### Watching

#### Watch Script

To watch and rebuild your bundle when it is detected that modules have changed
on disk run:

```console
# Direct from repository
deno run --allow-read="./" --allow-write="./dist" --allow-net="deno.land" --allow-env --unstable https://deno.land/x/drollup@2.50.5+0.18.2/examples/importmap/rollup.watch.ts

# When cloned locally
deno run --allow-read="./" --allow-write="./dist" --allow-net="deno.land" --allow-env --unstable ./rollup.watch.ts
```

This executes the `./rollup.watch.ts` file, which imports the config, adds a few
`watch` options, and then invokes the Rollup watch API.

In this example we log out the various events that are emitted by returned the
Rollup watcher.

#### Watch CLI

Alternatively you can use the Rollup CLI to watch and rebuild your bundle.

Install the CLI (same as before):

```console
deno install -f -q --allow-read --allow-write --allow-net --allow-env --unstable https://deno.land/x/drollup@2.50.5+0.18.2/rollup.ts
```

And follow any suggestions to update your `PATH` environment variable.

You can then bundle the files using the `rollup.config.ts` with:

```console
rollup -c --watch
```

When using the `--watch` CLI, not only will your bundle be rebuilt when your
source files change, but Rollup will also reload your `rollup.config.ts` file
when that changes. For example, try switching the `external` option of the
plugin to `true`!
