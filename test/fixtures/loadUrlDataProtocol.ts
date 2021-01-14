import { loadUrl } from "../../src/rollup-plugin-deno-resolver/loadUrl.ts";

const url = new URL("data://123abc");

await loadUrl(url);
