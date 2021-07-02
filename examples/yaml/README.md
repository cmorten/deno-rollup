# yaml

This is a basic example to show Rollup usage with the `yaml` plugin.

## Usage

### Bundling

#### Bundle Script

To invoke Rollup to bundle files in the `./src` directory, from this directory
run:

```console
# Direct from repository
deno run --allow-read="./" --allow-write="./dist" --allow-net="deno.land" --allow-env --unstable https://deno.land/x/drollup@2.52.7+0.19.0/examples/yaml/rollup.build.ts

# When cloned locally
deno run --allow-read="./" --allow-write="./dist" --allow-net="deno.land" --allow-env --unstable ./rollup.build.ts
```

This executes the `./rollup.build.ts` file, which imports the config, invokes
Rollup and then writes out the bundles.

To execute your newly bundled code run:

```console
deno run --allow-read="./" ./dist/mod.js
```

#### Bundle CLI

Alternatively you can use the Rollup CLI to bundle files.

Install the CLI:

```console
deno install -f -q --allow-read --allow-write --allow-net --allow-env --unstable https://deno.land/x/drollup@2.52.7+0.19.0/rollup.ts
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
deno run --allow-read="./" --allow-write="./dist" --allow-net="deno.land" --allow-env --unstable https://deno.land/x/drollup@2.52.7+0.19.0/examples/yaml/rollup.watch.ts

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
deno install -f -q --allow-read --allow-write --allow-net --allow-env --unstable https://deno.land/x/drollup@2.52.7+0.19.0/rollup.ts
```

And follow any suggestions to update your `PATH` environment variable.

You can then bundle the files using the `rollup.config.ts` with:

```console
rollup -c --watch
```

When using the `--watch` CLI, not only will your bundle be rebuilt when your
source files change, but Rollup will also reload your `rollup.config.ts` file
when that changes. For example, try switching the output directory to `./bin`!
