import { rollup } from "../mod.ts";
import options from "./rollup.config.ts";

const bundle = await rollup(options);
await bundle.write(options.output);
await bundle.close();
