import options from "./rollup.config.ts";
import { rollup } from "../../mod.ts";

const bundle = await rollup(options);
await bundle.write(options.output);
await bundle.close();
