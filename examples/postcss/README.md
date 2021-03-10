# postcss

This is a basic example to show Rollup usage with the `postcss` plugin.

Specifically it demonstrates using the
[autoprefixer](https://github.com/postcss/autoprefixer)
[PostCSS](https://github.com/postcss/postcss) plugin, and CSS modules.

## Usage

### Bundling

#### Bundle Script

To invoke Rollup to bundle files in the `./src` directory, from this directory
run:

```console
# Direct from repository
deno run --allow-read="./" --allow-write="./dist" --allow-net="deno.land" --allow-env --unstable https://deno.land/x/drollup@2.41.0+0.16.0/examples/postcss/rollup.build.ts

# When cloned locally
deno run --allow-read="./" --allow-write="./dist" --allow-net="deno.land" --allow-env --unstable ./rollup.build.ts
```

This executes the `./rollup.build.ts` file, which imports the config, invokes
Rollup and then writes out the bundles.

To view your new HTML page and bundle code run:

```console
deno run --allow-net --allow-read https://deno.land/std@0.90.0/http/file_server.ts ./dist --port 3000
```

This uses the Deno standard library's `file_server` module to serve the static
files in the `./dist` directory to `0.0.0.0` port `3000`. Open a browser at
<http://0.0.0.0:3000/> to view your page.

#### Bundle CLI

Alternatively you can use the Rollup CLI to bundle files.

Install the CLI:

```console
deno install -f -q --allow-read --allow-write --allow-net --allow-env --unstable https://deno.land/x/drollup@2.41.0+0.16.0/rollup.ts
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
deno run --allow-read="./" --allow-write="./dist" --allow-net="deno.land" --allow-env --unstable https://deno.land/x/drollup@2.41.0+0.16.0/examples/postcss/rollup.watch.ts

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
deno install -f -q --allow-read --allow-write --allow-net --allow-env --unstable https://deno.land/x/drollup@2.41.0+0.16.0/rollup.ts
```

And follow any suggestions to update your `PATH` environment variable.

You can then bundle the files using the `rollup.config.ts` with:

```console
rollup -c --watch
```

When using the `--watch` CLI, not only will your bundle be rebuilt when your
source files change, but Rollup will also reload your `rollup.config.ts` file
when that changes. Try editing the title colour in the `./src/styles.css` file.
