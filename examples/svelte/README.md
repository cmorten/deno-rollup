# svelte

This is a basic example to show Rollup usage with the `svelte` plugin.

### Bundling

```console
rollup -c
```

To view your new HTML page and bundled code run:

```console
deno run --allow-net --allow-read https://deno.land/std@0.100.0/http/file_server.ts ./dist --port 3000
```

This uses the Deno standard library's `file_server` module to serve the static
files in the `./dist` directory to `0.0.0.0` port `3000`. Open a browser at
<http://0.0.0.0:3000/> to view your running Svelte app.
