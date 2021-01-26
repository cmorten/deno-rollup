import { exists } from "../../src/rollup-plugin-deno-resolver/exists.ts";

const url = new URL("data://123abc");

await exists(url);
