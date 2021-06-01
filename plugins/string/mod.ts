import type { FilterPattern, Plugin } from "../../mod.ts";

import { createFilter } from "../../src/rollup/createFilter.ts";

export interface RollupStringOptions {

  /**
   * Specify include files
   */
  include?: FilterPattern;

  /**
   * Specify exclude files
   */
  exclude?: FilterPattern;
}

export function string(opts: RollupStringOptions = {}) : Plugin {

  if (!opts.include) {
    throw Error("include option should be specified");
  }

  const filter = createFilter(opts.include, opts.exclude);

  return {

    name: "string",

    transform(code, id) {
      if (filter(id)) {
        return {
          code: `export default ${JSON.stringify(code)};`,
          map: { mappings: "" }
        };
      }
    }
  };
}
