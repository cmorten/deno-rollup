import { rollup } from "../rollup.ts";
import options from "./rollup.config.ts";

const bundle = await rollup(options);
await bundle.write(options.output);
