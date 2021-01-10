# Example

This is a basic example to show Rollup usage withing Deno.

The Rollup configu is defined in the `./rollup.config.ts` file, and specifies that we wish to created ES bundles from our code in the `./src` directory, including source maps.

The code in `./src` is fairly trivial, but makes use of typescript, dynamic imports, URL imports (from the std library) and the Deno namespace, in order to demonstrate the bundling capabilities of Rollup with Deno.

## Usage

To invoke Rollup to bundle files in the `./src` directory, from this directory run:

```console
deno run --allow-read="./" --allow-write="./dist" --allow-net="deno.land" --unstable ./rollup.build.ts
```

This executes the `./rollup.build.ts` file, which imports the config, invokes Rollup and then writes out the bundles.

To execute your newly bundled code run:

```console
deno run --allow-read="./" ./dist/mod.js
```
