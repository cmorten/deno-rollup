# serve

This is a basic example to show Rollup usage with the `serve` plugin.

## Usage

### Bundling

#### Bundle CLI

You can use the Rollup CLI to bundle files.

Install the CLI:

```console
deno install -f -q --allow-read --allow-write --allow-net --allow-env --allow-run --unstable https://deno.land/x/drollup@2.50.5+0.18.1/rollup.ts
```

And follow any suggestions to update your `PATH` environment variable.

You can then bundle the files using the `rollup.config.ts` with:

```console
rollup -c
```

### Watching

#### Watch CLI

Alternatively you can use the Rollup CLI to watch and rebuild your bundle.

Install the CLI (same as before):

```console
deno install -f -q --allow-read --allow-write --allow-net --allow-env --allow-run --unstable https://deno.land/x/drollup@2.50.5+0.18.1/rollup.ts
```

And follow any suggestions to update your `PATH` environment variable.

You can then bundle the files using the `rollup.config.ts` with:

```console
rollup -c --watch
```

When using the `--watch` CLI, not only will your bundle be rebuilt when your
source files change, but Rollup will also reload your `rollup.config.ts` file
when that changes.
